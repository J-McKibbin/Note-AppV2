import React from "react";
import "./componentStyles/BtnLogout.css"

function BtnLogout(props){
    return <button className='btnLogout' onClick={props.onClick}></button>
}

export default BtnLogout;