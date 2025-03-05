import React from 'react';
import BtnLogout from '../components/BtnLogout.jsx'
import useAuth from "../hooks/UseAuth.jsx";
import './componentStyles/NavStyles.css'

function Navigation(){
    const {logout} = useAuth();
    return(
        <nav id="navContainer">
            <ul id="navList">
                <li id="navHome">Notes App</li>
                <li><BtnLogout onClick={logout} label='Logout'></BtnLogout></li>
            </ul>
        </nav>
    );
}

export default Navigation;