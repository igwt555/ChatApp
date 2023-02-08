import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios';

import 'react-toastify/dist/ReactToastify.css';
import './style.scss';
import Logo from '../../assets/logo.svg';
import { loginRoute } from '../../utils/APIRoutes';

function Login() {
    const [values, setValues] = useState({
        username: '',
        password: '',
    });
    const toastOptions = {
        position: 'bottom-right',
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
    };

    useEffect(() => {
        if (localStorage.getItem('chat-app-user')) {
            navigate('/');
        }
    }, [])

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (handleValidation()) {
            const { username, password } = values;
            const { data } = await axios.post(loginRoute, {
                username,
                password,
            });
            if (data.status === false) {
                toast.error(data.msg, toastOptions);
            }
            if (data.status === true) {
                localStorage.setItem('chat-app-user', JSON.stringify(data.user));
                navigate('/');
            }
        }

    }
    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    }
    const onRegisterClick = (e) => {
        e.preventDefault();
        navigate('/register');
    }

    const handleValidation = () => {
        const { username, password } = values;
        if (username.length === 0) {
            toast.error('User name and password is required', toastOptions);
            return false;
        } else if (password.length === 0) {
            toast.error('User name and password is required', toastOptions);
            return false;
        } else {
            return true;
        }
    }

    return (
        <>
            <div className='FormContainer'>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className='brand'>
                        <img src={Logo} alt='Logo' />
                        <h1>Come here</h1>
                    </div>
                    <input
                        type='text'
                        placeholder='User Name'
                        name='username'
                        onChange={(e) => handleChange(e)}
                        min='3'
                    />
                    <input
                        type='password'
                        placeholder='Password'
                        name='password'
                        onChange={(e) => handleChange(e)}
                    />
                    <button type='submit'>Login</button>
                    <span>Don't you have an account ? <button onClick={(e) => onRegisterClick(e)}>Register</button></span>
                </form>
            </div>
            <ToastContainer />
        </>
    )
}


export default Login;