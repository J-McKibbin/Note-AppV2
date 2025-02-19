// Home.js
import React from 'react';
import useAuth from "../hooks/UseAuth.jsx";
import Navigation from "../components/Navigation.jsx";
import NoteItem from "../components/NoteItem.jsx";
import './PageStyles/HomeStyles.css'
import Cookies from "js-cookie";
import axios from "axios";
import {useEffect, useState} from "react";

function Home() {
    //Getting the username and userID cookies and storing them
    const username = Cookies.get("username");
    //get the userid to search for the user dynamically
    const userID = Cookies.get("userID");
    //array for the notes
    const [notes, setNotes] = useState([]);
    //states for the note title and description in the note box
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const getNotes = async () => {
        try{
            const response = await axios.get(`http://localhost:3000/notes/1`);
            console.log("Response from the db: ", response.data)
            return response.data.notes;
        }catch(error){
            console.error(error);
        }
    }

    //function to fill the details of the note box
    const openNote = (noteTitle, noteContent) => {
        setTitle(noteTitle);
        setDescription(noteContent);
    }

    //get notes should be used on mount of the app
    useEffect(() => {
        const fetchNotes = async () => {
            const fetchedNotes = await getNotes();
            console.log("Logging notes: ", fetchedNotes)
            setNotes(fetchedNotes);
        };
        fetchNotes();
    },[])
    return (
        <div>
            <Navigation></Navigation>
            <p id='welcomeMsg'>Welcome to your notes app {username}</p>
            {/*<div>*/}
            {/*    {notes.map((note, index) => (*/}
            {/*        <h1 key={index}>{note.noteTitle}</h1>*/}
            {/*    ))}*/}
            {/*</div>*/}
            <div id='homeContainer'>
                <div id='noteContainer'>
                    <h2 id="notesTitle">Notes</h2>
                    {/*run through the notes retrieved*/}
                    {notes.map((note, index) => (
                        <NoteItem onClick={() => openNote(note.noteTitle, note.noteDescription)} noteTitle={note.noteTitle} noteDescription={note.noteDescription}></NoteItem>
                    ))}
                </div>
                <div id="noteContent">
                    <label>Note Title</label>
                    <input id='noteTitle' type='text' value={title}></input>
                    <label>Note Content</label>
                    <textarea id="noteContentText" value={description}></textarea>
                </div>
            </div>
        </div>
    );
}

export default Home;
