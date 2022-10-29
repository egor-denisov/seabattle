import React from 'react';

const Cell = ({condition, ...props}) => {
    return (
        <div className={['cellContent', 'condition'+condition].join(' ')} {...props}></div>
    );
};

export default Cell;