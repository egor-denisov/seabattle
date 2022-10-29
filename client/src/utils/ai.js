import { checkShip, getNearCells } from "./methodsOfShips";
export const moveAI = (gameMap, woundedShip) => {
    const coord = getAIMove(gameMap, woundedShip);
    if(gameMap[coord] < 2){
        return [{3: [coord]}, woundedShip]
    }else if(gameMap[coord] === 2){
        const ship = checkShip({coord: coord, map: gameMap});
        let nearCells = [];
        if(!ship.map(cell => cell === coord ?4 :gameMap[cell]).includes(2)){
            ship.forEach(cell => {
                nearCells = [...nearCells, ...getNearCells(cell)];
            });
            return [{3: nearCells, 4: [coord]}, []];
        }else{
            return [{4: [coord]}, [...woundedShip, coord].sort((a, b) => a - b)];
        }
        
    }
}
export const getAIMove = (gameMap, woundedShip) => {
    let availableCells = [];
    if(woundedShip.length === 0){
        gameMap.forEach((cell, index) => {
            if(cell <= 2){
                availableCells.push(index);
            }
        });
    }else if(woundedShip.length >= 2){
        const diff = woundedShip[1] - woundedShip[0];
        if(diff === 1){
            availableCells = [woundedShip[0] - 1, woundedShip[woundedShip.length - 1] + 1].filter(x => ~~(x/10) === ~~(woundedShip[0]/10));
        }else{
            availableCells = [woundedShip[0] - 10, woundedShip[woundedShip.length - 1] + 10]
        }
    }else{
        availableCells = [woundedShip[0] - 1, woundedShip[0] + 1].filter(x => ~~(x/10) === ~~(woundedShip[0]/10));
        availableCells = [...availableCells, woundedShip[0] - 10, woundedShip[0] + 10];
    }
    
    availableCells = availableCells.filter(x => x >= 0 && x <= 99 && gameMap[x] <= 2);
    return availableCells[Math.floor(Math.random() * availableCells.length)];
}