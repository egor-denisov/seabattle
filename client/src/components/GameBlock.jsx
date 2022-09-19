import React from 'react';
import Ceil from './Ceil';
const GameBlock = ({gameMap, shoot}) => {
    return (
        <div className='table'>
                {gameMap.map((ceil, index) => {
                    return <Ceil key={index} condition={ceil} onClick={() => shoot(index)}/>
                })}
        </div>
    );
};

export default GameBlock;