const express = require("express");
const checkShip = require("./scripts/checkShip");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    cors: {
        origin: '*'
    }
});
const getNearCells = require("./scripts/getNearCells");
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listen on *: ${PORT}`));
const users = {
    readyUsers: new Map(),
    inGameUsers: new Map(),
    disconUsers: new Map()
}
const timers = new Map();
io.on("connection", socket => {
    let data = {id: socket.id, room:'', enemyID: ''};
    socket.emit('yourID', data.id);
    // Timer
    let timerData = {timeForMove: false, timeStartTimer: -1, time: 19000, move: ''};
    const timer = ({move, waiter, time}) => {
        timerData.timeForMove = setTimeout(async () => {
            io.to(move).emit('gameOver', {win: false});
            io.to(waiter).emit('gameOver', {win: true});
            users.inGameUsers.delete(move);
            users.inGameUsers.delete(waiter);
        }, time);
        timerData = {
            ...timerData,
            timeStartTimer: Date.now(),
            time: time,
            move: move
        };
        return timerData;
    };
    socket.on('searchTimer', (room) => {
        if(timers.has(room)){
            const t = timers.get(room);
            if(t.timeForMove !== false){
                socket.emit('changeTimer', t.time + t.timeStartTimer - Date.now());
            }
        }
    });
    // Reconnection
    socket.on('wasInGame', (oldId) => {
        if(users.disconUsers.has(oldId)){
            let {gameMap, nickname, timeToMove, enemy, room, time, move} = users.disconUsers.get(oldId);
            users.disconUsers.delete(oldId);
            clearTimeout(timers.get(room).timeForMove);
            if(users.inGameUsers.has(enemy) && io.sockets.sockets.has(enemy)){
                data = {...data, enemyID: enemy, room: enemy + ' ' + data.id};
                // exit from old room
                io.in(room).socketsLeave(room);
                // adding to new room
                socket.join(data.room);
                io.sockets.sockets.get(data.enemyID).join(data.room);
                users.inGameUsers.set(data.id, {gameMap: gameMap, nickname: nickname, enemy: data.enemyID, room: data.room, timeToMove: timeToMove});
                users.inGameUsers.set(data.enemyID, {...users.inGameUsers.get(data.enemyID), enemy: data.id, room: data.room, timeToMove: timeToMove});
                const reconnData = {
                    ...data,
                    move: (oldId === move) ? data.id : data.enemyID,
                    time: time,
                    enemyNick: users.inGameUsers.get(data.enemyID).nickname,
                    timeToMove: timeToMove
                };
                socket.emit('reconnectToRoom', reconnData);
                io.to(data.enemyID).emit('enemyReconnect', {room: data.room, enemy: data.id, time: time, move: reconnData.move});
                timers.set(data.room, timer({move: reconnData.move, 
                                             waiter: (data.id === reconnData.move) ? data.enemyID : data.id, 
                                             time: time}));
            }
        }
    });
    // Ready
    socket.on('ready', ({gameMap, nickname, timeToMove}) => {
        if(Array.from(users.readyUsers.values()).filter(player => player.timeToMove === timeToMove).length < 1){
            users.readyUsers.set(data.id, {gameMap: gameMap, nickname: nickname, timeToMove: timeToMove});
        }else{
            data = {...data, enemyID: [...users.readyUsers.keys()][0], room: [...users.readyUsers.keys()][0] + ' ' + data.id};
            users.inGameUsers.set(data.id, {gameMap: gameMap, nickname: nickname, enemy: data.enemyID, room: data.room, timeToMove: timeToMove});
            users.inGameUsers.set(data.enemyID, {...users.readyUsers.get(data.enemyID), enemy: data.id, room: data.room, timeToMove: timeToMove});
            users.readyUsers.delete(data.enemyID);
            // adding to room
            socket.join(data.room);
            io.sockets.sockets.get(data.enemyID).join(data.room);
            // start game event
            socket.emit('startGame', {
                firstMove: data.id,
                id: data.id,
                room: data.room,
                enemyID: data.enemyID,
                enemyNick: users.inGameUsers.get(data.enemyID).nickname,
                timeToMove: timeToMove
            });
            io.to(data.enemyID).emit('startGame', {
                firstMove: data.id,
                id: data.enemyID,
                room: data.room,
                enemyID: data.id,
                enemyNick: nickname,
                timeToMove: timeToMove
            });
            timers.set(data.room, timer({move: data.id, waiter: data.enemyID, time: timeToMove*1000}));
        }
    });
    // shooting
    socket.on('shoot', ({id, room, enemy, coord}) => {
        clearTimeout(timers.get(room).timeForMove);
        let tempEnemyMap = [...users.inGameUsers.get(enemy).gameMap];
        if(tempEnemyMap[coord] < 2){
            tempEnemyMap = [...tempEnemyMap.slice(0, coord), 3, ...tempEnemyMap.slice(coord + 1)];
            socket.emit('missShoot', coord);
            io.to(enemy).emit('nextGambit', coord);
            timers.set(room, timer({move: enemy, waiter: id, time: users.inGameUsers.get(id).timeToMove * 1000}));
        }else if(tempEnemyMap[coord] === 2){
            tempEnemyMap = [...tempEnemyMap.slice(0, coord), 4, ...tempEnemyMap.slice(coord + 1)];
            const ship = checkShip({coord: coord, map: tempEnemyMap});
            if(!ship.map(cell => tempEnemyMap[cell]).includes(2)){
                let nearCells = [];
                ship.forEach(cell => {
                    nearCells = [...nearCells, ...getNearCells(cell)];
                });
                socket.emit('shipBroken', {nearCells: nearCells,
                                           field: true,
                                           coord: coord});
                io.to(enemy).emit('shipBroken', {nearCells: nearCells,
                                                 field: false,
                                                 coord: coord});
                if(tempEnemyMap.filter(x => x==4).length === 20){
                    io.to(enemy).emit('gameOver', {win: false});
                    socket.emit('gameOver', {win: true});
                    users.inGameUsers.delete(id);
                    users.inGameUsers.delete(enemy);
                }
            }else{
                socket.emit('hitShoot', coord);
                io.to(enemy).emit('hit', coord);
            }
            if(users.inGameUsers.has(id)){
                timers.set(room, timer({move: id, waiter: enemy, time: users.inGameUsers.get(id).timeToMove * 1000}));
            }
        }
        users.inGameUsers.set(enemy, {...users.inGameUsers.get(enemy), gameMap: tempEnemyMap});
    });
    //
    socket.on('exitFromGame', () => {
        if(users.readyUsers.has(data.id)){
            users.readyUsers.delete(data.id);
        }
        if(users.inGameUsers.has(data.id)){
            user = users.inGameUsers.get(data.id);
            io.in(user.room).socketsLeave(user.room);
            io.to(user.enemy).emit('gameOver', {win: true, status: 'discon'});
            users.inGameUsers.delete(data.id);
            users.inGameUsers.delete(user.enemy);
            const t = (timers.has(user.room)) ? timers.get(user.room) : timerData;
            clearTimeout(t.timeForMove);
        }
        
        
    })
    // disconnection
    socket.on("disconnecting", () => {
        if(users.inGameUsers.has(data.id)){
            const room = users.inGameUsers.get(data.id).room;
            const t = (timers.has(room)) ? timers.get(room) : timerData;
            clearTimeout(t.timeForMove);
            users.disconUsers.set(data.id, {...users.inGameUsers.get(data.id), time: t.time - Date.now() + t.timeStartTimer, move: t.move});
            io.to(room).emit('timerToReconnect');
            setTimeout(() => io.to(room).emit('enemyDisconnect'), 10000);
        }
        users.readyUsers.delete(data.id);
    });
});