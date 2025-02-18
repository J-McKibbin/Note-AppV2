// Home.js
import React from 'react';
import useAuth from "../hooks/UseAuth.jsx";
import Navigation from "../components/Navigation.jsx";
import NoteItem from "../components/NoteItem.jsx";
import './PageStyles/HomeStyles.css'

function Home() {
    const {logout} = useAuth();
    return (
        <div>
            <Navigation></Navigation>
            {/*<BtnLogout onClick={logout} label="Logout" />*/}
            <div id='homeContainer'>
                <div id='noteContainer'>
                    <h2 id="notesTitle">Notes</h2>
                    <NoteItem />
                    <NoteItem />
                </div>
                <div id="noteContent">
                    <p>hello</p><p>hello</p><p>hello</p>
                </div>
            </div>
        </div>
    );
}

export default Home;
