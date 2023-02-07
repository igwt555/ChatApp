import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify'
import axios from 'axios';

import 'react-toastify/dist/ReactToastify.css';
import './style.scss';
import Logo from '../../assets/logo.svg';
import { registerRoute } from '../../utils/APIRoutes';

function Register() {
	const [values, setValues] = useState({
		username: '',
		email: '',
		password: '',
		confirmPwd: '',
	});
	const toastOptions = {
		position: 'bottom-right',
		autoClose: 8000,
		pauseOnHover: true,
		draggable: true,
		theme: 'dark',
	};
	const navigate = useNavigate();
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		if(handleValidation()) {
			const {username, email, password, confirmPwd} = values;
			const {data} = await axios.post(registerRoute, {
				username,
				email,
				password,
			})
		}
	}
	const handleChange = (e) => {
		setValues({ ...values, [e.target.name]: e.target.value });
	}
	const onLoginClick = (e) => {
		e.preventDefault();
		navigate('/login');
	}

	const handleValidation = () => {
		const {username, email, password, confirmPwd} = values;
		if(password !== confirmPwd) {
			toast.error('Password and Confirm Password should be same.', toastOptions);
			return false;
		} else if (username.length < 3) {
			toast.error('Username should be more than 3 characters', toastOptions);
			return false;
		} else if (password.length < 8) {
			toast.error('Password should be more than 8 characters', toastOptions);
			return false;
		} else if (email === '') {
			toast.error('Email is required', toastOptions);
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
					/>
					<input
						type='email'
						placeholder='Email'
						name='email'
						onChange={(e) => handleChange(e)}
					/>
					<input
						type='password'
						placeholder='Password'
						name='password'
						onChange={(e) => handleChange(e)}
					/>
					<input
						type='password'
						placeholder='Confirm Password'
						name='confirmPwd'
						onChange={(e) => handleChange(e)}
					/>
					<button type='submit'>Create New User</button>
					<span>Already have an account ? <button onClick={(e) => onLoginClick(e)}>Login</button></span>
				</form>
			</div>
			<ToastContainer />
		</>
	)
}


export default Register;