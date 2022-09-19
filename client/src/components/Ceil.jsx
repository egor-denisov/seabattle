import React from 'react';

const Ceil = ({condition, ...props}) => {
    return (
        <div className={['ceilContent', 'condition'+condition].join(' ')} {...props}></div>
    );
};

export default Ceil;