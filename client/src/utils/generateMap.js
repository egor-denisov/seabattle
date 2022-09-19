export const generateMap = (size) => {
    const res = [];
    for (var i = 0; i < size; i++) {
        res.push(Array(10).fill(0))
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