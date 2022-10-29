import React, {useEffect} from 'react';

const Timer = ({time, tick}) => {
    useEffect(() => {
        const timerID = setInterval(() => tick(), 1000);
        return () => clearInterval(timerID);
    });
    return (
        <p className='timer'>
            0:{time < 10
                ?'0' + time
                : time
            }
        </p>
    );
};

export default Timer;