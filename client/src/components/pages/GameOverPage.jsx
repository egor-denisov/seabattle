import React from 'react';
import MyButton from '../UI/MyButton/MyButton';
import EmojiSad from '../../svg/EmojiSad';
import EmojiHappy from '../../svg/EmojiHappy';
const GameOverPage = ({winner, newGame}) => {
    return (
        <div className='gameOverPage'>
            {winner
                ? <div>
                    <div className='emotion'>
                        <EmojiHappy/>
                    </div>
                    <p>You win</p>
                </div>
                : <div>
                    <div className='emotion'>
                        <EmojiSad/>
                    </div>
                    <p>You lose</p>
                </div>
            }
            <div className="buttons">
                <MyButton onClick={() => newGame()}><p>Play again</p></MyButton>
            </div>
            
        </div>
    );
};

export default GameOverPage;