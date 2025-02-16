// Home.js
import React from 'react';
import useAuth from "../hooks/UseAuth.jsx";
import BtnLogout from "../components/BtnLogout.jsx";

function Home() {
    const {logout} = useAuth();
    return (
        <div>
            <h1>Welcome to the Home Page!</h1>
            <button onClick={logout}>Logout</button>
            <BtnLogout onClick={logout} label="Logout" />
        </div>
    );
}

export default Home;
