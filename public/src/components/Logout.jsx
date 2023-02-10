import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BiPowerOff } from 'react-icons/bi';
import './LogoutStyle.scss';

export default function Logout() {
    const navigate = useNavigate();
    const handleClick = async () => {
        localStorage.clear();
        navigate('/login');
    }
    return <div className='btn-div' onClick={handleClick}>
        <BiPowerOff />
    </div>
}
