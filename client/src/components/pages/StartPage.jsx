import React from 'react';
import MyButton from '../UI/MyButton/MyButton';
import MyInput from '../UI/MyInput/MyInput';
import MyToogle from '../UI/MyToogle/MyToogle';
import Refresh from '../../svg/Refresh';
const StartPage = ({gameMode, setGameMode, gameSpeed, setGameSpeed, nickname, setNickname, generateNickname, goToArangeShips, darkmode}) => {
    
    return (
        <div className='startPage'>
            <div className='gamemode'>
            <p>Select gamemode:</p>
            <div className='gamemode-buttons'>
                <MyToogle elements={['AI', 'RP']} active={gameMode} setActive={setGameMode} darkmode={darkmode}></MyToogle>
            </div>
            <p>Select speed game:</p>
            <div className='gamespeed-buttons'>
                <MyToogle elements={['Slow', 'Fast']} active={gameSpeed} setActive={setGameSpeed} darkmode={darkmode}></MyToogle>
            </div>
            <div className='name'>
                <p>Write your nickname:</p>
                <div className='container'>
                    <MyInput value={nickname} placeholder='Write your nickname' onChange={e => setNickname(e.target.value)}/>
                    <MyButton onClick={() => generateNickname()}><Refresh/></MyButton>
                </div>
            </div>
            <MyButton onClick={() => goToArangeShips()}><p>Next</p></MyButton>
            </div>
      </div>
    );
};

export default StartPage;