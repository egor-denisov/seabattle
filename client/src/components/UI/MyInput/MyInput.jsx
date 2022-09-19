import React from 'react';
import classes from './MyInput.module.css'

const MyInput = ({value, ...props}) => {
    return (
        <input type='text' value={value} className={classes.MyInput} {...props}/>
    );
};

export default MyInput;