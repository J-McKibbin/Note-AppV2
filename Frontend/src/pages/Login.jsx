import React, {useState} from 'react';
import axios from "axios";
import {Link, useNavigate} from 'react-router-dom';
import './PageStyles/Login&RegisterStyles.css'
import './PageStyles/LoginStyles.css'
import BtnAuth from "../components/BtnAuth";
import Cookies from 'js-cookie'


function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    // const {login} = useAuth();


    const handleSubmit = async (e) => {
        setError(null);
        e.preventDefault();
        console.log("Login attempt with:" ,{email, password});
        try{
            const response = await axios.post('http://localhost:3000/login',{
                email,
                password,
            }, {withCredentials: true});
            //
            //TODO Below is the userid retrieved from the axios response
            //we need to find a way to store this
            console.log("user id: ",response.data.userID);
            const userID = response.data.userID;
            const username = response.data.username;
            //setting the username and userId into cookies
            Cookies.set("username", username);
            Cookies.set('userID', userID);


            if(response.data.token){
                const token = response.data.token;
                console.log("heres the token: " ,token);
                //navigate to home
                navigate('/Home');
            }else{
                setError('Invalid credentials');
            }
        }catch(error){
            console.log("Login error: ", error);
            setError(error.response.data.error || "An unexpected error occurred");
        }
    }
    return(
        <div>
            <h1 id="pageTitle">Login</h1>
            <form onSubmit={handleSubmit} id='loginForm'>
                <input
                    type='text'
                    placeholder='Email'
                    value={email}
                    required
                    onChange = {(e) => setEmail(e.target.value)}/>
                <input
                    type='password'
                    placeholder='Password'
                    required
                    value={password}
                    onChange = {(e) => setPassword(e.target.value)}/>
                <BtnAuth type='submit'>
                    Login
                </BtnAuth>
                <p id="errorMessage">{error}</p>
                <Link to='/register' id="registerLink">Register Here</Link>
            </form>
        </div>
    )
}

export default Login;