import React from 'react';
import GameBlock from '../GameBlock';

const BattlePage = ({gameMap, enemyMap, move, shoot}) => {
    const clickToCeil = (coord) => {
        if(move && enemyMap[coord] !== 3){
            shoot(coord)
        }
    }
    return (
        <div>
            <div style={{textAlign: 'center'}}>{move
                ?'Your move'
                :'Enemy move'
                }
            </div>
            <div className='battleMaps'>
                <div className='gameblock'><GameBlock gameMap={gameMap} shoot={()=>{return}}/></div>
                <div className='gameblock enemyMap'><GameBlock gameMap={enemyMap} shoot={clickToCeil}/></div>
            </div>
        </div>
        
    );
};

export default BattlePage;