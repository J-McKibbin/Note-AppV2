import {useState} from "react";
import React from 'react';
import axios from "axios";
import {Link} from "react-router-dom";
import './PageStyles/Login&RegisterStyles.css'
import BtnAuth from "../components/BtnAuth";

function Register (){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const handleRegister = () => {
        console.log("Registering user")
    }

    return(
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit} id='registerForm'>
                <input
                    type='text'
                    placeholder='Email'
                    required
                    value={email}
                    onChange = {(e) => setEmail(e.target.value)}/>
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
                    value={confirmPassword}
                    onChange = {(e) => setConfirmPassword(e.target.value)}/>
                <BtnAuth onClick={handleSubmit} type='submit'>
                    Register
                </BtnAuth>
                <p>{error}</p>
            </form>
            <Link to='/'>Login here</Link>
        </div>
    )
}

export default Register;