import { getNearCells } from "./methodsOfShips";
export const clearCell = (coords, gameMap) => {
    const tempGameMap = [...gameMap];
    coords.forEach(i => {
        tempGameMap[i] = 0;
        getNearCells(i).forEach(k => {
            tempGameMap[k] = 0;
            getNearCells(k).forEach(j => {
                if(tempGameMap[j] === 2){
                    tempGameMap[k] = 1;
                }
            })
        })
    })
    return tempGameMap;
}
export const putShip = (dropCell, ship, map) => {
    const tempGameMap = [...map];
    ship.coords.forEach((i,n) => {
        let ind = dropCell - (ship.order - n)*ship.diff;
        tempGameMap[ind] = 2;
        getNearCells(ind).forEach(j => {
            tempGameMap[j] = Math.max(1, tempGameMap[j]);
        })
    });
    return tempGameMap;
}
export const checkShipsCells = (index, ship, map) => {
    const firstAndLast = [index - ship.order*ship.diff, index + (ship.length - ship.order - 1)*ship.diff];
    if(firstAndLast[1] > 99 || firstAndLast[0] < 0 || (~~(firstAndLast[0]/10) !== ~~(firstAndLast[1]/10) && ship.diff === 1)){
        return false;
    }
    for(let n = 0; n < ship.length; n++){
        let ind = index - (ship.order - n)*ship.diff;
        if(map[ind] !== 0){
            return false;
        }
    }
    return true;
    
}
export const startDrag = (e, cell, res, gameMap, tableRef, setWidth, setCell, setStartCoords, setShip) => {
    //e.preventDefault();
    if(gameMap[cell] === 2){
        let c = tableRef.current.getBoundingClientRect();
        setWidth(e.target.offsetWidth);
        setCell(cell);
        setStartCoords({x: c.x, y: c.y});
        setShip({coords: res, length: res.length, 
                 diff: ((res.length > 1) ? res[1] - res[0] : 0), 
                 order: res.indexOf(cell)});
    }else{
        e.preventDefault();
    }
}
export const startDrop = (index, cell, ship, gameMap, setGameMap, setViewDraggableShip) => {
    const tempGameMap = clearCell(ship.coords, gameMap);
    let dropCell = cell;
    if(!checkShipsCells(dropCell, ship, tempGameMap)){
        dropCell = index;
    }
    setGameMap(putShip(dropCell, ship, tempGameMap));
    setViewDraggableShip(false);
}
export const startRotate = (index, res, gameMap, setGameMap) => {
    if(gameMap[index] === 2 && res.length > 1){
        const tempGameMap = clearCell(res, gameMap);
        let tempShip = {coords: res, length: res.length, diff: res[1] - res[0], order: res.indexOf(index)}
        if(!checkShipsCells(index, {...tempShip, diff: tempShip.diff === 1 ? 10 : 1}, tempGameMap)){
            if(checkShipsCells(index, {...tempShip, diff: tempShip.diff === 1 ? 10 : 1, order: tempShip.length - tempShip.order - 1}, tempGameMap)){
                tempShip = {...tempShip, diff: tempShip.diff === 1 ? 10 : 1, order: tempShip.length - tempShip.order - 1};
            }
        }else{
            tempShip = {...tempShip, diff: tempShip.diff === 1 ? 10 : 1};
        }
        setGameMap(putShip(index, tempShip, tempGameMap));
    }
}
export const getStyle = (setStyle, startCoords, ship, cell, width) => {
    if(ship.diff === 1){
        setStyle({
            'gridTemplateColumns': `repeat(${ship.length}, 1fr)`,
            'left': startCoords.x + (width + 2) * (cell % 10 - ship.order) - 2,
            'top': startCoords.y + (width + 2) * ~~(cell / 10) - 2
        });
    }else{
        setStyle({
            'gridTemplateRows': `repeat(${ship.length}, 1fr)`,
            'left': startCoords.x + (width + 2) * (cell % 10) - 2,
            'top': startCoords.y + (width + 2) * (~~(cell / 10) - ship.order) - 2
        });
    }
}
export const onShip = (setCell, index, ship, cell) => {
    if(index !== ship.coords[ship.order]){
        const shift = (index - ship.coords[ship.order]);
        setCell((~~((cell+shift)/10) !== ~~(cell/10) && ship.diff === 1) ? cell : cell + shift);
    }
}