import React, { useRef, useEffect, useState } from 'react';
import { checkShip } from '../utils/methodsOfShips';
import { clearCell, startDrag, startDrop, startRotate } from '../utils/arange';
import Cell from './Cell';
import DragShip from './DragShip';
const GameBlock = ({gameMap, shoot, setGameMap, arange}) => {
    const [startCoords, setStartCoords] = useState({x: 0, y: 0});
    const [cell, setCell] = useState(-1);
    const [viewDraggableShip, setViewDraggableShip] = useState(false);
    const [ship, setShip] = useState({coords: [], length: 0, diff: 1, order: -1});
    const [width, setWidth] = useState(30);
    const tableRef = useRef();


    // добавить стилизацию для кораблей, сможет ли он поставиться или нет

    useEffect(() => {
        if(ship.order !== -1){
            setCell(cell);
            setGameMap(clearCell(ship.coords, gameMap));
            setViewDraggableShip(true);
        }
    }, [ship])
    return (
        <div className='table' ref={tableRef}>
            
            <DragShip startCoords={startCoords}
                      cell={cell}
                      setCell={setCell}
                      ship={ship}
                      view={viewDraggableShip}
                      width={width}/>
                {arange 
                ? gameMap.map((condition, index) => {
                    return <Cell key={index} 
                                 number={index}
                                 condition={condition}
                                 draggable={gameMap[index] === 2}
                                 onDragStart={(e) => startDrag(e, index, checkShip({coord: index, map: gameMap}).sort(), 
                                                               gameMap, tableRef, setWidth, setCell, setStartCoords, setShip)} 
                                 onDragEnd={() => startDrop(index, cell, ship, gameMap, setGameMap, setViewDraggableShip)}
                                 onDragEnter={() => setCell(index)}
                                 onDoubleClick={() => startRotate(index, checkShip({coord: index, map: gameMap}).sort(), gameMap, setGameMap)}
                            />
                })
                : gameMap.map((condition, index) => {
                    return <Cell key={index} 
                                 condition={condition}
                                 onClick={() => shoot(index)}
                            />
                })
                }
        </div>
    );
};

export default GameBlock;