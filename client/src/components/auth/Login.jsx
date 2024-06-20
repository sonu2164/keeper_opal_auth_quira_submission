// Login.js

import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosConfig';
import { toast } from 'react-toastify';
import './Login.css'; // Import your CSS file

const Login = ({ setIsAuthenticated, setShowRegister }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            email,
            password,
        };

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const body = JSON.stringify(userData);
            const res = await axios.post('/user/login', body, config);

            const { token } = res.data;
            localStorage.setItem('token', token);
            setIsAuthenticated(true);

            // Show success toast
            toast.success('Login successful');
        } catch (err) {
            console.error(err.response.data);
            // Show error toast
            toast.error('Login failed. Please check your credentials.');
        }
    };

    const handleClick = () => {
        setShowRegister((prev) => !prev);
    }

    return (
        <div className="login-container">
            <h1>Sign In</h1>
            <form onSubmit={(e) => onSubmit(e)}>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={(e) => onChange(e)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={(e) => onChange(e)}
                        minLength="6"
                    />
                </div>
                <div className="form-group">
                    <input type="submit" value="Login" />
                </div>
            </form>
            <div>Not registered ? <span onClick={handleClick} className='register-link'>Register</span></div>

        </div>
    );
};

export default Login;
