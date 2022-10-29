const getNearCells = require("./getNearCells");

module.exports = ({coord, map}) => {
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
        left = Math.min.apply(null, ship);
        right = Math.max.apply(null, ship);
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
        top = Math.min.apply(null, ship);
        bottom = Math.max.apply(null, ship);
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