import React from 'react';
import Robot from '../assets/robot.gif';
import './WelcomeStyle.scss';

export default function Welcome({ currentUser }) {
    return (
        <div className="welcome-container">
            <img src={Robot} alt='Robot' />
            <h1>
                Welcome, <span>{currentUser.username}!</span>
            </h1>
            <h3>Please select a user to start chatting</h3>
        </div>
    )
}