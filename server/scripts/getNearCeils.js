module.exports = (coordSelectedCeil) => {
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