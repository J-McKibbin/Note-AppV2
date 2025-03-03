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
    const [isSelected, setIsSelected] = useState(false);

    const createNote = async () => {
        try{
            //we want to add a new note to the notes array
            const newNote = {
                noteTitle: "New Note",
                noteDescription: "",
                userID: userID,
            };
            const response = await axios.post("http://localhost:3000/createNote", newNote);

            if (response.status === 201) {
                const createdNote = response.data.newNote;
                console.log(`created note:`,createdNote);
                // Add the new note to the state
                setSelectedNoteID(createdNote.id);
                setTitle(createdNote.noteTitle);
                setDescription(createdNote.noteDescription);
                setNotes((prevNotes) => [...prevNotes, createdNote]);
                console.log(notes)
            }
        }catch(error){
            console.error(`an error occurred: ${error}`);
        }
    }

    const deleteNote = async (id) => {
    try{
        //send delete request using the id to api
        const response = await axios.delete(`http://localhost:3000/deleteNote/${id}`);
        //if request 200 then remove from frontend
        if(response.status === 204){
            setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
            console.log(`note with id: ${id} deleted successfully`)

            if(notes.length === 1){
                setIsSelected(false);
                console.log(`this is notes.length`,notes.length)
            }
        }
    }catch(error){
        console.error(`error deleting note: ${error}`);
        }
    };

    const getNotes = async () => {
        try{
            const response = await axios.get(`http://localhost:3000/notes/${userID}`);
            const modifiedNotes = response.data.notes.map(note => {
                const shortenedDescription = note.noteDescription.split(" ").slice(0, 5).join(" ").concat("...");
                return { ...note, shortDescription: shortenedDescription };
            });
            setNotes(modifiedNotes);
        }catch(error){
            console.error(error);
            return [];
        }
    }

    const updateNote = async (id, updatedTitle, updatedDescription) => {
        console.log("Updating note with:", { id, updatedTitle, updatedDescription });
        if(!id) return;
        try{
            await axios.put(`http://localhost:3000/updateNote/${id}`, {
            noteTitle: updatedTitle,
            noteDescription: updatedDescription
        });
            // Update local state
            setNotes((prevNotes) =>
                prevNotes.map((note) =>
                    note.id === id ? { ...note, noteTitle: updatedTitle,
                        noteDescription: updatedDescription,
                        shortDescription: updatedDescription.split(" ").slice(0, 5).join(" ").concat("..."),
                } : note
                )
            );
            console.log(`Successfully updated note: ${id}`)
        }catch(error){
            console.error(`Error updating note: ${error}`)
        }
    };


    //function to fill the details of the note box
    const openNote = (id, noteTitle, noteContent) => {
        console.log('Opening note :',{id, noteTitle, noteContent});
        setIsSelected(true);
        //set the content in the input boxes
        setSelectedNoteID(id);
        setTitle(noteTitle);
        setDescription(noteContent);
    }

    useEffect(() =>{
        document.title = "Note app"
        getNotes();
        console.log(notes)
    }, [])

    //get notes should be used on mount of the app
    useEffect(() => {
        //when the app is mounted get the notes from the db
        if(selectedNoteID){
            console.log(selectedNoteID)
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
                        <button id="btnCreateNote" onClick={createNote}></button>
                    </div>
                    {/*run through the notes retrieved*/}
                    {notes.map((note) => (
                        <div key={note.id} className="noteItemContainer">
                            <button className="btnDelete" onClick={() => deleteNote(note.id)}>X</button>
                            <NoteItem onClick={() => openNote(note.id, note.noteTitle, note.noteDescription)} noteTitle={note.noteTitle} noteDescription={note.shortDescription}></NoteItem>
                        </div>
                    ))}
                </div>
                <div id="noteContent" >
                {isSelected ? (
                    <>
                    <label>Note Title</label>
                    <input
                        id="noteTitle"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <label>Note Content</label>
                    <textarea
                    placeholder='Note Title'
                        id="noteContentText"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    </>
                ) : (
                    <p>Select a note to edit or create a note</p>
                )}
                </div>
            </div>
        </div>
    );
}

export default Home;
