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
    const [selectedNoteID, setSelectedNoteID] = useState(null);

    const deleteNote = async (id) => {
    try{
        //send delete request using the id to api
        const response = await axios.delete(`http://localhost:3000/deleteNote/${id}`);
        //if request 200 then remove from frontend
        if(response.status === 200){
            setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
            console.log(`note with id: ${id} deleted successfully`)
        }
    }catch(error){
        console.error(`error deleting note: ${error}`);
        }
    };

    const getNotes = async () => {
        try{
            //TODO update this so it works dynamically instead of being hardcoded
            const response = await axios.get(`http://localhost:3000/notes/1`);
            console.log("Response from the db: ", response.data)
            const modifiedNotes = response.data.notes.map( note => {
                const words = note.noteDescription.split(" ");
                // Creating the short description for the note
                const shortenedDescription = words.slice(0, 5).join(" ").concat("...");
                console.log("this is short desc",shortenedDescription);
                //add shortened description to the note objects
                return {...note, shortDescription: shortenedDescription};
            });
            setNotes(modifiedNotes);
        }catch(error){
            console.error(error);
            return [];
        }
    }

    const updateNote = async (id, updatedTitle, updatedDescription) => {
        if(!id) return;
        try{
            await axios.put(`http://localhost:3000/updateNote/${id}`, {
            noteTitle: updatedTitle,
            noteDescription: updatedDescription
        });

            //update local note
            // Update local state immediately
            setNotes((prevNotes) =>
                prevNotes.map((note) =>
                    note.id === id ? { ...note, noteTitle: updatedTitle, noteDescription: updatedDescription } : note
                )
            );

            console.log(`Successfully updated note: ${id}`)
        }catch(error){
            console.error(`Error updating note: ${error}`)
        }
    };

    //function to fill the details of the note box
    const openNote = (id, noteTitle, noteContent) => {
        //set the content in the input boxes
        setSelectedNoteID(id);
        setTitle(noteTitle);
        setDescription(noteContent);
    }
    useEffect(() =>{
        getNotes();
    }, [])

    //get notes should be used on mount of the app
    useEffect(() => {
        //when the app is mounted get the notes from the db
        if(selectedNoteID){
            const selectedNote = notes.find((note) => note.id === selectedNoteID);
            if (selectedNote && selectedNote.noteTitle === title && selectedNote.noteDescription === description) {
                return; // Do nothing if there are no changes
            }
            const timer = setTimeout(() =>{
                updateNote(selectedNoteID, title, description);
            }, 1000);
            return() => clearTimeout(timer);
        }
    },[title,description, selectedNoteID]);
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
                    <div id="addNoteContainer">
                        <h2 id="notesTitle">Notes</h2>
                        <button>Add</button>
                    </div>
                    {/*run through the notes retrieved*/}
                    {notes.map((note, index) => (
                        <div key={note.id} id="noteItemContainer">
                            <button id="btnDelete" onClick={() => deleteNote(note.id)}>X</button>
                            <NoteItem onClick={() => openNote(note.id, note.noteTitle, note.noteDescription)} noteTitle={note.noteTitle} noteDescription={note.shortDescription}></NoteItem>
                        </div>
                    ))}
                </div>
                <div id="noteContent">
                    <label>Note Title</label>
                    <input id='noteTitle' type='text' value={title} onChange={(e) => setTitle(e.target.value)}></input>
                    <label>Note Content</label>
                    <textarea id="noteContentText" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                </div>
            </div>
        </div>
    );
}

export default Home;
