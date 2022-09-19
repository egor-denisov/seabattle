import React from 'react';
import MyButton from '../UI/MyButton/MyButton';
import MyInput from '../UI/MyInput/MyInput';
import MyToogle from '../UI/MyToogle/MyToogle';
import DiceSVG from '../../svg/DiceSVG';
const StartPage = ({gameMode, setGameMode, nickname, setNickname, generateNickname, goToArangeShips}) => {
    
    return (
        <div className='startPage'>
            <div className='gamemode'>
            <p>Select gamemode:</p>
            <div className='gamemode-buttons'>
                <MyToogle elements={['AI', 'RP']} active={gameMode} setActive={setGameMode}></MyToogle>
            </div>
            <div className='name'>
                <p>Write your nickname:</p>
                <div className='container'>
                    <MyInput value={nickname} placeholder='Write your nickname' onChange={e => setNickname(e.target.value)}/>
                    <MyButton onClick={() => generateNickname()}><DiceSVG/></MyButton>
                </div>
            </div>
            <MyButton onClick={() => goToArangeShips()}>Next</MyButton>
            </div>
      </div>
    );
};

export default StartPage;