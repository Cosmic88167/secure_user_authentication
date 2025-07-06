// client/src/Protected.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Protected() {
    const [data, setData] = useState(null);
    const navigate = useNavigate();

    const fetchProtected = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/auth/protected', { withCredentials: true });
            setData(res.data);
        } catch (err) {
            alert('Access denied');
            navigate('/login');
        }
    };

    useEffect(() => {
        fetchProtected();
    }, []);

    return (
        <div className="form-container">
            <h2>Protected Content</h2>
            {data ? (
                <div>
                    <p>{data.message}</p>
                    <p>User ID: {data.user.id}</p>
                    <p>Role: {data.user.role}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
