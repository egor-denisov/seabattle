import React from 'react';
import classes from './MyInput.module.css'
const closeKeyBoard = e => {
    if(e.key === 'Enter'){
        e.target.blur();
    }
}
const MyInput = ({value, ...props}) => {
    return (
        <input type='text' value={value} className={classes.MyInput} onKeyDown={e => closeKeyBoard(e)} {...props}/>
    );
};

export default MyInput;