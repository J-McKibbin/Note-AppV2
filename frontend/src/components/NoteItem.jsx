//This will be a list that will access the notes and display them from a list
import './componentStyles/NoteListStyles.css'

import React from 'react';

//This component will provide the note title and description
function NoteItem(props) {
    return (
        <ul id='noteItem' onClick={props.onClick}>
            <li>
                <h4 id="noteTitle">{props.noteTitle}</h4>
                <p id="noteDescription">{props.noteDescription}</p>
            </li>
        </ul>
    )
}

export default NoteItem;