import React from 'react';
import classes from './MyModal.module.css'

const MyModal = ({children, visible, setViewModal, buttons, darkmode}) => {
    const RootClasses = [classes.MyModal];
    if(visible){
        RootClasses.push(classes.active)
    }
    if(darkmode){
        RootClasses.push(classes.darkmode)
    }
    return (
        <div className={RootClasses.join(' ')} onClick={()=>setViewModal({view: false, text: ''})}>
            <div className={classes.MyModalContent} onClick={e=>e.stopPropagation()}>
                <h1>Sorry, but...</h1>
                <div className={classes.modalBody}>{children}</div>
                {buttons}
            </div>
        </div>
    )
};
export default MyModal;