import {useState} from "react";
import React from 'react';
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import './PageStyles/Login&RegisterStyles.css'
import BtnAuth from "../components/BtnAuth";

function Register (){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [error, setError] = useState("");
    const navigate = useNavigate();


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


            // change this to delay, show success message and then navigate later
            navigate('/')
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
        <div id="mainContent">
            <form onSubmit={handleSubmit} id='registerForm'>
            <h1 id="pageTitle">Notes App <img id="titleImg" src="/icons8-write-100.png"/></h1>
            <h1 id="formTitle">Register</h1>
                <input
                    id="emailInput"
                    type="email"
                    placeholder='Email'
                    required
                    value={email}
                    onChange = {(e) => setEmail(e.target.value)}/>
                <input
                    id="usernameInput"
                    type='text'
                    placeholder='Username'
                    required
                    value={username}
                    onChange = {(e) => setUsername(e.target.value)}/>
                <input
                    id="passwordInput"
                    type='password'
                    placeholder='Password'
                    required
                    value={password}
                    onChange = {(e) => setPassword(e.target.value)}/>
                <input
                    id="passwordConfirmInput"
                    type='password'
                    placeholder='Confirm Password'
                    required
                    value={passwordConfirmation}
                    onChange = {(e) => setPasswordConfirmation(e.target.value)}/>
                <BtnAuth type="submit" btnID='registerButton'>
                    Register
                </BtnAuth>
                {error && <p id="errorMessage">{error}</p>}
                <p id="linkMessage">Have an account? <Link to='/' id="loginLink">Login here</Link></p>
            </form>
        </div>
    )
}

export default Register;