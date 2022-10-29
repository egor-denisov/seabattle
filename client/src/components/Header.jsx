import React from 'react';
import Home from '../svg/Home';
import Sun from '../svg/Sun';
import Moon from '../svg/Moon';
import Menu from '../svg/Menu';
import Close from '../svg/Close';
import Ship from '../svg/Ship';
const Header = ({children, goHome, darkmode, changeColorMode, menuActive, changeMenuActive}) => {
    return (
        <div className='header'>
            <div className="main-header">
                <div className="logo"><Ship/></div>
                <h1>{children}</h1>
            </div>
            <div className='menu'>
                <div className='menu-burger' onClick={() => changeMenuActive()}>
                    {menuActive
                    ? <Close/>
                    : <Menu/>
                    }
                </div>
                <div className='menu-child' onClick={() => changeColorMode()}>
                    {darkmode
                    ? <Moon/>
                    : <Sun/>
                    }
                </div>
                <div className='menu-child' onClick={() => goHome()}><Home/></div>
            </div>
        </div>
    );
};

export default Header;