import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import ProtectedRoute from './ProtectedRoute'
import Register from "../pages/Register.jsx";
import Activate from "../pages/Activate.jsx";

const AppRoutes = () => {
    return(
        <Routes>
            <Route path="/" element={<Login />}/>
            <Route path={'/register'} element={<Register />}/>
            <Route path="/activate/:token" element={<Activate />}/>
            <Route
                path="/home"
                element={
                <ProtectedRoute>
                    <Home />
                </ProtectedRoute>
            }/>
        </Routes>
    )
}
export default AppRoutes;