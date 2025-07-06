// client/src/App.js

import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Protected from './Protected';
import './App.css';

function App() {
    return (
        <div className="app-container">
            <nav className="navbar">
                <Link className="nav-link" to="/register">Register</Link>
                <Link className="nav-link" to="/login">Login</Link>
                <Link className="nav-link" to="/protected">Protected</Link>
            </nav>
            <div className="content">
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/protected" element={<Protected />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
