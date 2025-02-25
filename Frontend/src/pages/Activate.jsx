import React from "react";
import {useEffect} from "react";
import {Link, useParams} from "react-router-dom";
import axios from "axios";

function Activate() {

    const {token} = useParams();

    useEffect(() => {
        const activate = async () =>{
            try{
                await axios.get(`http://localhost:3000/activate/${token}`)
            }catch(error){
                console.error(`An error occurred: ${error}`);
            }
        }
        activate();
    }, [])

    return (

        <div>
            <h1>Your token is activated</h1>
            <Link to='/' id="loginLink">Login here</Link>
        </div>
    )

}

export default Activate;