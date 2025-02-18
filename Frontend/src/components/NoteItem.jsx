//This will be a list that will access the notes and display them from a list
import './componentStyles/NoteListStyles.css'

import React from 'react';

//This component will provide the note title and description
function NoteItem() {
    return (
        <ul id='noteItem'>
            <li>
                <h4 id="noteTitle">Note Title</h4>
                <p id="noteDescription">Note Description eokrgnfnperfnerpgeprogeporg eefewfgergerg</p>
            </li>
        </ul>
    )
}

export default NoteItem;