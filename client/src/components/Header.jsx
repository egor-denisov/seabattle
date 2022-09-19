import React from 'react';

const Header = ({children}) => {
    return (
        <div className='header'>
            <h1>{children}</h1>
        </div>
    );
};

export default Header;