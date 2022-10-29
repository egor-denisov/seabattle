import React from 'react';
import classes from './MySetting.module.css';
const MySetting = ({changeColorMode, goHome, darkmode, menuActive}) => {
    const RootClasses = [classes.MySetting];
    if(menuActive){
        RootClasses.push(classes.active)
    }
    if(darkmode){
        RootClasses.push(classes.darkmode)
    }
    return (

        <div className={RootClasses.join(' ')}>
            <div>
                <p className={classes.bar} onClick={() => goHome()}>Exit to main menu</p>
                <p className={classes.bar} onClick={() => changeColorMode()}>Change colormode</p>
            </div>
        </div>
        
    );
};

export default MySetting;