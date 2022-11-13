import React from 'react';
import GameBlock from '../GameBlock';
import { RandomArangeShips } from '../../utils/methodsOfShips';
import MyButton from '../UI/MyButton/MyButton';
import Refresh from '../../svg/Refresh';
const ArangeShip = ({setMap, ready, disabled, width, ...props}) => {
    const rndm = () => {
        setMap(RandomArangeShips());
    }
    return (
        <div className='arangePage'>
            <div className='title'><p>Arange ships</p></div>
            <div className='battleMaps'>
                <div className='gameblock'>
                    <GameBlock {...props} arange={!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent))}/>
                </div>
                {width < 670
                ?<div className='next-row'></div>
                : ''
                }
            </div>
            <div className='buttons'>
                    <MyButton onClick={rndm}><Refresh/></MyButton>
                    <MyButton onClick={() => ready()} disabled={disabled}><p>Start</p></MyButton>
            </div>
        </div>
    );
};

export default ArangeShip;