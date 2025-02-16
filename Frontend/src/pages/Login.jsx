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
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
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
                <button type='submit' onClick={handleLogin}>Login</button>
                <p>{error}</p>
            </form>
        </div>
    )
}

export default Login;