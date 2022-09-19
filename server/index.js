const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    cors: {
        origin: '*'
    }
});
const getNearCeils = require("./scripts/getNearCeils");
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listen on *: ${PORT}`));
const readyUsers = new Map();
const inGameUsers = new Map();
io.on("connection", socket => {
    const id = socket.id;
    let room = '';
    socket.emit('yourID', id);
    socket.on('ready', (gameMap) => {
        if(readyUsers.size < 1){
            readyUsers.set(id, gameMap);
        }else{
            const [enemyID] = readyUsers.keys();
            room = enemyID + ' ' + id;
            io.sockets.sockets.get(enemyID).join(room);
            socket.join(room);
            inGameUsers.set(id, gameMap).set(enemyID, readyUsers.get(enemyID));
            io.to(id).emit('startGame', {firstMove: id, room: room, enemyID: enemyID});
            io.to(enemyID).emit('startGame', {firstMove: id, room: room, enemyID: id});
            readyUsers.delete(enemyID);
        }
    });
    socket.on('shoot', ({id, room, enemy, coord}) => {
        if(inGameUsers.get(enemy)[coord] < 2){
            socket.emit('missShoot', coord);
            io.to(enemy).emit('nextGambit', coord);
        }else if(inGameUsers.get(enemy)[coord] === 2){
            const enemyMap = [...inGameUsers.get(enemy)];
            enemyMap[coord] = 4;
            inGameUsers.set(enemy, enemyMap);
            const nearCeils = new Map();
            getNearCeils(coord).forEach(item => {
                nearCeils.set(item, enemyMap[item]);
            });
            if(!Array.from(nearCeils.values()).includes(2)){
                getNearCeils(coord).forEach(item => {
                    nearCeils.set(item, enemyMap[item]);
                    if(enemyMap[item] === 4 && item !== coord){
                        getNearCeils(item).forEach(item2 => {
                            nearCeils.set(item2, enemyMap[item2]);
                            if(enemyMap[item2] === 4 && item !== item2){
                                getNearCeils(item2).forEach(item3 => {
                                    nearCeils.set(item3, enemyMap[item3]);
                                    if(enemyMap[item3] === 4  && item2 !== item3){
                                        getNearCeils(item3).forEach(item4 => {
                                            nearCeils.set(item4, enemyMap[item4]);
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
                io.to(id).emit('shipBroken', {nearCeils: Array.from(nearCeils.keys()),
                                              field: true,
                                              coord: coord});
                io.to(enemy).emit('shipBroken', {nearCeils: Array.from(nearCeils.keys()),
                                                 field: false,
                                                 coord: coord});
                if(inGameUsers.get(enemy).filter(x => x==4).length === 20){
                    io.to(enemy).emit('gameOver', {win: false});
                    io.to(id).emit('gameOver', {win: true});
                    inGameUsers.delete(id);
                    inGameUsers.delete(enemy);
                }
            }else{
                socket.emit('hitShoot', coord);
                io.to(enemy).emit('hit', coord);
            }
            
        }
    })
    socket.on("disconnecting", () => {
        readyUsers.delete(id)
    });
    
  });