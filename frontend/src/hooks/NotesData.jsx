import React from 'react';
import {useState} from "react";
import axios from "axios";

const NotesData = async (userID) => {
    try{
        await axios.get('http://localhost:3000/home', {

        })
    }catch(error){
        console.error(error);
    }
}

export default NotesData;