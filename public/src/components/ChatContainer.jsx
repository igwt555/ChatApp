import React, { useState, useEffect, useRef } from 'react';
import { getMessagesRoute, sendMessageRoute, addChatUser } from '../utils/APIRoutes';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import './ChatContainerStyle.scss';
import ChatInput from './ChatInput';
import Logout from './Logout';

export default function ChatContainer({ currentChat, currentUser, socket }) {
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const scrollRef = useRef();
    useEffect(() => {
        if (currentChat) {
            async function fetchData() {
                const res = await axios.post(getMessagesRoute, {
                    from: currentUser._id,
                    to: currentChat._id,
                });
                setMessages(res.data);
            }
            fetchData();
        }
    }, [currentChat])
    const handleSendMsg = async (msg) => {
        await axios.post(sendMessageRoute, {
            from: currentUser._id,
            to: currentChat._id,
            message: msg,
        });
        socket.current.emit('send-msg', {
            to: currentChat._id,
            from: currentUser._id,
            message: msg,
        });

        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: msg });
        setMessages(msgs);
    };

    const handleAddUser = async () => {
        const { data } = await axios.post(addChatUser, {
            currentUser: currentUser.username,
            addUser: currentChat.username,
        });
        if (data.status === false) {
            alert("Failed to Add a new User");
        }
        if (data.status === true && data.notNew) {
            alert("Already Exists on your Contact list");
        } else {
            alert('Added successfully');
        }
    }
    useEffect(() => {
        if (socket.current) {
            socket.current.on('msg-recieve', (msg) => {
                setArrivalMessage({ fromSelf: false, message: msg });
            })
        }
    }, []);

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behaviour: 'smooth' });
    }, [messages]);
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
                    <div className='btn-pack'>
                        <button className='add-user-btn' onClick={handleAddUser}>Add</button>
                        <Logout />
                    </div>

                </div>
                <div className="chat-messages">
                    {
                        messages.map((message) => {
                            return (
                                <div ref={scrollRef} key={uuidv4}>
                                    <div className={`message ${message.fromSelf ? 'sended' : 'received'}`}>
                                        <div className="msg-content">
                                            <p>
                                                {message.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <ChatInput handleSendMsg={handleSendMsg} />
            </div>
            }
        </>
    )
}