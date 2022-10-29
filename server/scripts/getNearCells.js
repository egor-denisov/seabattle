module.exports = (coordSelectedCell) => {
    if(coordSelectedCell === 0){
        nearCells = [1, 10, 11];
    }else if(coordSelectedCell === 9){
        nearCells = [8, 18, 19];
    }else if(coordSelectedCell === 99){
        nearCells = [88, 89, 98];
    }else if(coordSelectedCell === 90){
        nearCells = [80, 81, 91];
    }else if(coordSelectedCell%10 === 9){
        nearCells = [coordSelectedCell - 10, coordSelectedCell + 10, 
            coordSelectedCell + 9, coordSelectedCell - 1, coordSelectedCell - 11];
    }else if(coordSelectedCell%10 === 0){
        nearCells = [coordSelectedCell - 10, coordSelectedCell - 9, coordSelectedCell + 1, coordSelectedCell + 11,
            coordSelectedCell + 10];
    }else if(~~(coordSelectedCell/10) === 0){
        nearCells = [coordSelectedCell - 1, coordSelectedCell + 10, 
            coordSelectedCell + 9, coordSelectedCell + 1, coordSelectedCell + 11];
    }else if(~~(coordSelectedCell/10) === 9){
        nearCells = [coordSelectedCell + 1, coordSelectedCell - 10, 
            coordSelectedCell - 9, coordSelectedCell - 1, coordSelectedCell - 11];
    }else{
        nearCells = [coordSelectedCell - 10, coordSelectedCell - 9, coordSelectedCell + 1, coordSelectedCell + 11,
            coordSelectedCell + 10, coordSelectedCell + 9, coordSelectedCell - 1, coordSelectedCell - 11];
    }
    return nearCells;
}