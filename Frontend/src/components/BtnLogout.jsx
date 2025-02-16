import React from "react";
import "./componentStyles/BtnLogout.css"

function BtnLogout(props){
    return <button className='btnLogout' onClick={props.onClick}>{props.label}</button>
}

export default BtnLogout;