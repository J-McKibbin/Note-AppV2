import React, {useState} from 'react';
import axios from "axios";
import {Link, useNavigate} from 'react-router-dom';
import useAuth from "../hooks/UseAuth.jsx";
import './PageStyles/Login&RegisterStyles.css'
import BtnAuth from "../components/BtnAuth";


function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    // const {login} = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const handleLogin = async () => {
        setError(null);
        console.log("Login attempt with:" ,{email, password});
        try{
            const response = await axios.post('http://localhost:3000/login',{
                email,
                password,
            }, {withCredentials: true});
            console.log(response);

            if(response.data.token){
                const token = response.data.token;
                console.log("heres the token: " ,token);

                //use the login hook to pass the token
                // login(token);
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
            <h1>Login</h1>
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
                <BtnAuth onClick={handleLogin} type='submit'>
                    Login
                </BtnAuth>
                <p>{error}</p>
            </form>
            <Link to='/register'>Register Here</Link>
        </div>
    )
}

export default Login;