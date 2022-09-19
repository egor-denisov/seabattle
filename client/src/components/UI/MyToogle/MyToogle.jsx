import React from 'react';
import classes from './MyToogle.module.css'

const MyToogle = ({elements, active, setActive}) => {

    return (
        <div className={classes.MyToogle}>
            {elements.map(el => {
                if(active===el){
                    return <button className={[classes.MyElToogle, classes.active].join(' ')} key={el}>{el}</button>
                }else{
                    return <button className={classes.MyElToogle} key={el} onClick={()=>setActive(el)}>{el}</button>
                }
            }
                
            )}
            
        </div>
    );
};

export default MyToogle;