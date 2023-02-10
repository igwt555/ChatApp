import React from 'react';
import { sendMessageRoute } from '../utils/APIRoutes';
import axios from 'axios';
import './ChatContainerStyle.scss';
import ChatInput from './ChatInput';
import Logout from './Logout';
import Messages from './Messages';

export default function ChatContainer({ currentChat, currentUser }) {
    const handleSendMsg = async (msg) => {
        await axios.post(sendMessageRoute, {
            from: currentUser._id,
            to: currentChat._id,
            message: msg,
        })
    };
    return (
        <>
            {currentChat && <div className="chat-container">
                <div className="chat-header">
                    <div className="user-details">
                        <div className="avatar">
                            <img
                                src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                                alt='avatar'
                            />
                        </div>
                        <div className="username">
                            <h3>{currentChat.username}</h3>
                        </div>
                    </div>
                    <Logout /> 
                </div>
                <Messages />
                <ChatInput handleSendMsg={handleSendMsg} />
            </div>
            }
        </>
    )
}