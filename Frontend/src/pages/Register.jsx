import {useState} from "react";
import React from 'react';
import axios from "axios";
import {Link} from "react-router-dom";
import './PageStyles/Login&RegisterStyles.css'
import BtnAuth from "../components/BtnAuth";

function Register (){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [error, setError] = useState("");


    const handleSubmit = async (e) => {
        setError(null)
        console.log("Starting register")
        e.preventDefault();
        console.log("Set error to null")
        try{
            console.log("sending axios req")
            const response = await axios.post("http://localhost:3000/register",{
                email,
                username,
                password,
                passwordConfirmation
            });
            console.log(`ere is the response ${response.data}`);
            console.log("checking if response.data exists")


            console.log(`Register response: ${response.data}`);
            //reset the register inputs
            setEmail("")
            setUsername("")
            setPassword("")
            setPasswordConfirmation("")

        }catch(err){
            console.log(`here is the error: ${err}`)
            if (err.response?.data) {
                // If the error response contains a message, display it
                setError(err.response.data.error || "An unexpected error occurred");
            } else {
                // Fallback for other errors (e.g., network errors)
                setError("An unexpected error occurred");
            }
        }
    };

    return(
        <div>
            <h1 id="pageTitle">Register</h1>
            <form onSubmit={handleSubmit} id='registerForm'>
                <input
                    type="email"
                    placeholder='Email'
                    required
                    value={email}
                    onChange = {(e) => setEmail(e.target.value)}/>
                <input
                    type='text'
                    placeholder='Username'
                    required
                    value={username}
                    onChange = {(e) => setUsername(e.target.value)}/>
                <input
                    type='password'
                    placeholder='Password'
                    required
                    value={password}
                    onChange = {(e) => setPassword(e.target.value)}/>
                <input
                    type='password'
                    placeholder='Confirm Password'
                    required
                    value={passwordConfirmation}
                    onChange = {(e) => setPasswordConfirmation(e.target.value)}/>
                <BtnAuth type="submit" >
                    Register
                </BtnAuth>
                {error && <p id="errorMessage">{error}</p>}
                <Link to='/' id="loginLink">Login here</Link>
            </form>
        </div>
    )
}

export default Register;