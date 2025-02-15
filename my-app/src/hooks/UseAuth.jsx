import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';


//Use auth will allow us to create hooks for authenticating logging in and out of the app
const UseAuth = () => {
    //Storing user data (jwt token)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try{
                const response = await axios.get('http://localhost:3000/home', {
                    withCredentials: true,
                });
                console.log("Logging response", response);
                if(response.status === 200){
                    setUser({token: response.data.token});
                }else{
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

    const login = (token) => {
        //set the cookie of the user using the token
        setUser({token});
        document.cookie = `authToken=${token}; path=/;`;
    };

    const logout = async () => {
        try{
            console.log("Logging out");
            //make the request to the backend
            const response = await axios.post('http://localhost:3000/logout',
                {},{withCredentials: true})
            document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            setUser(null);
            console.log("You should now be redirected...")
            window.location.href='/';
        }catch(error){
            console.error(error);
        }
        document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        setUser(null)
    };

    return {
        user,
        loading,
        login,
        logout
    };
}
export default UseAuth;