import React from 'react';
import GameBlock from '../GameBlock';
import { RandomArangeShips } from '../../utils/methodsOfShips';
import MyButton from '../UI/MyButton/MyButton';
const ArangeShip = ({setMap, ready, disabled, ...props}) => {
    const rndm = () => {
        setMap(RandomArangeShips());
    }
    const clr = () => {
        setMap(Array(100).fill(0))
    }
    return (
        <div className='gameblock'>
            <GameBlock {...props}/>
            <div className='buttons'>
                <MyButton onClick={rndm}>Rndm</MyButton>
                <MyButton onClick={clr}>Clear</MyButton>
                <MyButton onClick={() => ready()} disabled={disabled}>Start</MyButton>
            </div>
            
        </div>
    );
};

export default ArangeShip;