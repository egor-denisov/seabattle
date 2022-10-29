import React from 'react';
import GameBlock from '../GameBlock';
import Timer from '../Timer';
const BattlePage = ({gameMap, enemyMap, move, shoot, nickname, enemyNick, time, tick, width, enemyReconn}) => {
    const clickToCell = (coord) => {
        if(move && enemyMap[coord] !== 3){
            shoot(coord)
        }
    }
    const battleInfo = () => {
        return  <div className='battleInfo'>
                    <p className='move'>
                    {enemyReconn 
                    ? 'Enemy Recconnecting'
                    : move ? 'Your move' : 'Enemy move'
                    }
                    </p>
                    <Timer time={time} tick={tick}/>
                </div>
    }
        return (
            <div className='battlePage'>
                {width > 670 && battleInfo()}
                <div className='battleMaps'>
                    <div className='gameblock'>
                        <p>{nickname} (You)</p>
                        <GameBlock gameMap={gameMap} shoot={()=>{return}}/>
                    </div>
                    {width <= 670 && battleInfo()}
                    <div className='gameblock enemyMap'>
                        <p>{enemyNick} (Enemy)</p>
                        <GameBlock gameMap={enemyMap} shoot={clickToCell}/>
                    </div>
                </div>
            </div>
            
        );
    
};

export default BattlePage;