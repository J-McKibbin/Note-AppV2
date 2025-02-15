import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import ProtectedRoute from './ProtectedRoute'

const AppRoutes = () => {
    return(
        <Routes>
            <Route path="/" element={<Login />}/>
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