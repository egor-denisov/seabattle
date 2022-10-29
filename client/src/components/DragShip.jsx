import React, { useEffect, useState } from 'react';
import { getStyle, onShip } from '../utils/arange';
const DragShip = ({startCoords, cell, setCell, ship, view, width}) => {
    let className = 'dragShip';
    const [style, setStyle] = useState({});
    if(!view){
        className += ' disabled';
    }
    
    useEffect(() => {
        getStyle(setStyle, startCoords, ship, cell, width)
    }, [cell])
    return (
        <div className={className} style={style}>
            {ship.coords.map(index => {
                return <div className='cellContent condition2' key={index} onDragEnter={() => onShip(setCell, index, ship, cell)}></div>
            })}
        </div>
    );
};

export default DragShip;