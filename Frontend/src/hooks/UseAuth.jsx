import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";


//Use auth will allow us to create hooks for authenticating logging in and out of the app
const UseAuth = () => {
    //Storing user data (jwt token)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try{
                setLoading(true);
                console.log("Checking Auth...");
                const response = await axios.get('http://localhost:3000/home', {
                    withCredentials: true,
                });
                console.log("Logging response from home endpoint", response);
                if(response.status === 200){
                    console.log("Setting user token")
                    setUser({token: response.data.token});
                }else{
                    console.log("Redirecting user to login")
                    window.location.href='/';
                }
                //because this is undefined the user isnt being set to have content therefore
                //the home page is not accessible
            }catch(error){
                console.log("Auth failed: ", error)
            }finally {
                setLoading(false);
            }
        };
        checkAuth();
        //TODO Check what the [] is for: its saying deps
    }, []);

    //Login function
    const login = (token) => {
        console.log("Logging in function triggered")
        setUser({token});
        //set the cookie of the user using the token
        document.cookie = `authToken=${token}; path=/;`;
        // Cookies.set('authToken')
    };

    const register = (token) => {
        console.log("Registering user")
        setUser({token});
        document.cookie = `authToken=${token}; path=/;`;
    }

    //Logout function
    const logout = async () => {
        try{
            console.log("Logging out function triggered");
            //making a request to the logout endpoint
            const response = await axios.post('http://localhost:3000/logout',
                {},{withCredentials: true})
            //ensuring the cookie is removed from the user
            document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            //User set to null to ensure they cant access protected routes
            setUser(null);
            console.log("Redirecting to user login")
            window.location.href='/';
        }catch(error){
            console.error(error);
        }
    };

    return {
        user,
        loading,
        login,
        logout
    };
}
export default UseAuth;