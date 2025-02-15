import {useState} from 'react';
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import useAuth from "../hooks/UseAuth.jsx";


function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    // const {login} = useAuth();

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
            <h2>Login</h2>
            <input
                type='text'
                placeholder='Email'
                value={email}
                onChange = {(e) => setEmail(e.target.value)}/>
            <input
                type='password'
                placeholder='Password'
                value={password}
                onChange = {(e) => setPassword(e.target.value)}/>
            <button onClick={handleLogin}>Login</button>
            {error && <p>{error}</p>}
            <p>{error}</p>
        </div>
    )
}

export default Login;