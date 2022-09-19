export const generateMap = (size) => {
    const res = [];
    for (var i = 0; i < size; i++) {
        res.push(Array(10).fill(0));
    }
    return res;
}
export const fromMassivToMatrix = (mass, size) => {
    const res = [];
    for(let i = 0; i < size; i++){
        res.push(mass.slice(i*size, i*size + size));
    }
    return res;
}
export const generateDefaultShips = () => {
    return {// orientation: horizontal - 0, vertical - 1
        1: [{ceil: 0, orientation: 0},
            {ceil: 2, orientation: 0},
            {ceil: 4, orientation: 0},
            {ceil: 6, orientation: 0}],
        2: [{ceil: 20, orientation: 0},
            {ceil: 23, orientation: 0},
            {ceil: 26, orientation: 0}],
        3: [{ceil: 40, orientation: 0},
            {ceil: 44, orientation: 0}],
        4: [{ceil: 60, orientation: 0}]
    }
}
export const CreateGameMap = (shipCoords) => {
    const defaultMap = generateMap(10);
        
    Object.keys(shipCoords).forEach(deck => {
        shipCoords[deck].forEach(ship => {
            let coord = {x: ship.ceil%10, y: ~~(ship.ceil/10)}
            if (ship.orientation){ // if orientation vertical
                for(let i = coord.y; i < coord.y+Number(deck); i++){
                    defaultMap[i][coord.x] = 1;
                }
            }else{
                for(let i = coord.x; i < coord.x+Number(deck); i++){
                    defaultMap[coord.y][i] = 1;
                }
            }
        })
    })
    return defaultMap;
}
export const getNearCeils = (coordSelectedCeil) => {
    let nearCeils = [];
    if(coordSelectedCeil === 0){
        nearCeils = [1, 10, 11]
    }else if(coordSelectedCeil === 9){
        nearCeils = [8, 18, 19]
    }else if(coordSelectedCeil === 99){
        nearCeils = [88, 89, 98]
    }else if(coordSelectedCeil === 90){
        nearCeils = [80, 81, 91]
    }else if(coordSelectedCeil%10 === 9){
        nearCeils = [coordSelectedCeil - 10, coordSelectedCeil + 10, 
            coordSelectedCeil + 9, coordSelectedCeil - 1, coordSelectedCeil - 11]
    }else if(coordSelectedCeil%10 === 0){
        nearCeils = [coordSelectedCeil - 10, coordSelectedCeil - 9, coordSelectedCeil + 1, coordSelectedCeil + 11,
            coordSelectedCeil + 10]
    }else if(~~(coordSelectedCeil/10) === 0){
        nearCeils = [coordSelectedCeil - 1, coordSelectedCeil + 10, 
            coordSelectedCeil + 9, coordSelectedCeil + 1, coordSelectedCeil + 11]
    }else if(~~(coordSelectedCeil/10) === 9){
        nearCeils = [coordSelectedCeil + 1, coordSelectedCeil - 10, 
            coordSelectedCeil - 9, coordSelectedCeil - 1, coordSelectedCeil - 11]
    }else{
        nearCeils = [coordSelectedCeil - 10, coordSelectedCeil - 9, coordSelectedCeil + 1, coordSelectedCeil + 11,
            coordSelectedCeil + 10, coordSelectedCeil + 9, coordSelectedCeil - 1, coordSelectedCeil - 11]
    }
    return nearCeils;
}
export const RandomArangeShip = (gapMap, lengthShip, selectedCeilBefore) => {
    let clearCeils = 0;
    gapMap.forEach(ceil => {
        if(ceil===0){
            clearCeils++;
        }
    });
    let selectedCeil = -1;
    if(!selectedCeilBefore || (selectedCeilBefore + 1) > 99){
        selectedCeil = Math.floor(Math.random() * (clearCeils));
    }else{
        selectedCeil = selectedCeilBefore + 1
    }
    const selectedOrientation = Math.floor(Math.random() * 2);
    let counter = 0;
    let coordSelectedCeil = 0;
    for(let i = 0; i < 100; i++){
        if(gapMap[i] === 0){
            counter++;
            if(counter === selectedCeil){
                coordSelectedCeil = i;
            }
        }
    }
    if(selectedOrientation && (coordSelectedCeil%10 + lengthShip) < 10 ){
        for(let i = 0; i < lengthShip; i++){
            if(gapMap[coordSelectedCeil + i] > 0){
                return RandomArangeShip(gapMap, lengthShip, selectedCeil)
            }
        }
        for(let i = 0; i < lengthShip; i++){
            gapMap[coordSelectedCeil + i] = 2;
            getNearCeils(coordSelectedCeil + i).map(ceil => gapMap[ceil] = Math.max(1, gapMap[ceil]))
        }
        return gapMap
    }else if(!selectedOrientation && (~~(coordSelectedCeil/10) + lengthShip) < 10){
        for(let i = 0; i < lengthShip; i++){
            if(gapMap[coordSelectedCeil + 10*i] > 0){
                return RandomArangeShip(gapMap, lengthShip, selectedCeil)
            }
        }
        for(let i = 0; i < lengthShip; i++){
            gapMap[coordSelectedCeil + 10*i] = 2;
            getNearCeils(coordSelectedCeil + 10*i).map(ceil => gapMap[ceil] = Math.max(1, gapMap[ceil]))
        }
        return gapMap
    }else{
        return RandomArangeShip(gapMap, lengthShip, selectedCeil)
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