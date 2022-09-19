import React from 'react';
import classes from './MyModal.module.css'

const MyModal = ({children, visible, setViewModal}) => {
    const RootClasses = [classes.MyModal];
    if(visible){
        RootClasses.push(classes.active)
    }
    return (
        <div className={RootClasses.join(' ')} onClick={()=>setViewModal({view: false, text: ''})}>
            <div className={classes.MyModalContent} onClick={e=>e.stopPropagation()}>
                <h1>Sorry, but...</h1>
                <p>{children}</p>
            </div>
        </div>
    )
};
export default MyModal;