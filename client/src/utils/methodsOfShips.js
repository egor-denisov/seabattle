export const getNearCells = (coordSelectedCell) => {
    let nearCells = [];
    if(coordSelectedCell === 0){
        nearCells = [1, 10, 11]
    }else if(coordSelectedCell === 9){
        nearCells = [8, 18, 19]
    }else if(coordSelectedCell === 99){
        nearCells = [88, 89, 98]
    }else if(coordSelectedCell === 90){
        nearCells = [80, 81, 91]
    }else if(coordSelectedCell%10 === 9){
        nearCells = [coordSelectedCell - 10, coordSelectedCell + 10, 
            coordSelectedCell + 9, coordSelectedCell - 1, coordSelectedCell - 11]
    }else if(coordSelectedCell%10 === 0){
        nearCells = [coordSelectedCell - 10, coordSelectedCell - 9, coordSelectedCell + 1, coordSelectedCell + 11,
            coordSelectedCell + 10]
    }else if(~~(coordSelectedCell/10) === 0){
        nearCells = [coordSelectedCell - 1, coordSelectedCell + 10, 
            coordSelectedCell + 9, coordSelectedCell + 1, coordSelectedCell + 11]
    }else if(~~(coordSelectedCell/10) === 9){
        nearCells = [coordSelectedCell + 1, coordSelectedCell - 10, 
            coordSelectedCell - 9, coordSelectedCell - 1, coordSelectedCell - 11]
    }else{
        nearCells = [coordSelectedCell - 10, coordSelectedCell - 9, coordSelectedCell + 1, coordSelectedCell + 11,
            coordSelectedCell + 10, coordSelectedCell + 9, coordSelectedCell - 1, coordSelectedCell - 11]
    }
    return nearCells;
}
export const RandomArangeShip = (gapMap, lengthShip, selectedCellBefore) => {
    let clearCells = 0;
    gapMap.forEach(cell => {
        if(cell===0){
            clearCells++;
        }
    });
    let selectedCell = -1;
    if(!selectedCellBefore || (selectedCellBefore + 1) > 99){
        selectedCell = Math.floor(Math.random() * (clearCells));
    }else{
        selectedCell = selectedCellBefore + 1
    }
    const selectedOrientation = Math.floor(Math.random() * 2);
    let counter = 0;
    let coordSelectedCell = 0;
    for(let i = 0; i < 100; i++){
        if(gapMap[i] === 0){
            counter++;
            if(counter === selectedCell){
                coordSelectedCell = i;
            }
        }
    }
    if(selectedOrientation && (coordSelectedCell%10 + lengthShip) < 10 ){
        for(let i = 0; i < lengthShip; i++){
            if(gapMap[coordSelectedCell + i] > 0){
                return RandomArangeShip(gapMap, lengthShip, selectedCell)
            }
        }
        for(let i = 0; i < lengthShip; i++){
            gapMap[coordSelectedCell + i] = 2;
            getNearCells(coordSelectedCell + i).map(cell => gapMap[cell] = Math.max(1, gapMap[cell]))
        }
        return gapMap
    }else if(!selectedOrientation && (~~(coordSelectedCell/10) + lengthShip) < 10){
        for(let i = 0; i < lengthShip; i++){
            if(gapMap[coordSelectedCell + 10*i] > 0){
                return RandomArangeShip(gapMap, lengthShip, selectedCell)
            }
        }
        for(let i = 0; i < lengthShip; i++){
            gapMap[coordSelectedCell + 10*i] = 2;
            getNearCells(coordSelectedCell + 10*i).map(cell => gapMap[cell] = Math.max(1, gapMap[cell]))
        }
        return gapMap
    }else{
        return RandomArangeShip(gapMap, lengthShip, selectedCell)
    }
        

}
export const RandomArangeShips = () => {
    let gapArange = Array(100).fill(0);
    for(let lengthShip = 4; lengthShip > 0; lengthShip--){
        for(let countShips = (5 - lengthShip); countShips > 0; countShips--){
            gapArange = RandomArangeShip(gapArange, lengthShip, false);
        }
    }
    return gapArange
}
export const checkShip = ({coord, map}) => {
    let nearCells = getNearCells(coord);
    let horizontal = false;
    let ship = [coord];
    nearCells.forEach(cell => {
        if(map[cell] === 2 || map[cell] === 4){
            ship.push(cell);
            if(Math.abs(coord - cell) === 1){
                horizontal = true;
            }
        }
    })
    if(horizontal){
        const left = Math.min.apply(null, ship);
        const right = Math.max.apply(null, ship);
        if((~~((left - 1) / 10) === ~~(left / 10)) && (map[left - 1] === 2 || map[left - 1] === 4)){
            ship.push(left - 1);
            if((~~((left - 2) / 10) === ~~(left / 10)) && (map[left - 2] === 2 || map[left - 2] === 4)){
                ship.push(left - 2);
            }
        }
        if((~~((right + 1) / 10) === ~~(right / 10)) && (map[right + 1] === 2 || map[right + 1] === 4)){
            ship.push(right + 1);
            if((~~((right + 2) / 10) === ~~(right / 10)) && (map[right + 2] === 2 || map[right + 2] === 4)){
                ship.push(right + 2);
            }
        }
    }else{
        const top = Math.min.apply(null, ship);
        const bottom = Math.max.apply(null, ship);
        if(map[top - 10] === 2 || map[top - 10] === 4){
            ship.push(top - 10);
            if(map[top - 20] === 2 || map[top - 20] === 4){
                ship.push(top - 20);
            }
        }
        if(map[bottom + 10] === 2 || map[bottom + 10] === 4){
            ship.push(bottom + 10);
            if(map[bottom + 20] === 2 || map[bottom + 20] === 4){
                ship.push(bottom + 20);
            }
        }
    }
    return ship;
}