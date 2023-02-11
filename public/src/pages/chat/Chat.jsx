import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import './style.scss';
import { allUsersRoute, host } from '../../utils/APIRoutes';
import Contacts from '../../components/Contacts';
import Welcome from '../../components/Welcome';
import ChatContainer from '../../components/ChatContainer';

function Chat() {
    const socket = useRef();
    const [contacts, setContacts] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            socket.current = io(host);
            socket.current.emit('add-user', currentUser._id);
        }
    }, [currentUser])

    useEffect(() => {
        async function fetchData() {
            if (!localStorage.getItem('chat-app-user')) {
                navigate('/login');
            } else {
                setCurrentUser(await JSON.parse(localStorage.getItem('chat-app-user')));
                setIsLoaded(true);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        async function fetchData() {
            if (currentUser) {
                if (currentUser.isAvatarImageSet) {
                    const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
                    setContacts(data.data);
                } else {
                    navigate('/setAvatar');
                }
            }
        }
        fetchData();
    }, [currentUser]);
    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    }
    return (
        <div className='container'>
            <div className='content'>
                <Contacts
                    contacts={contacts}
                    currentUser={currentUser}
                    changeChat={handleChatChange}
                />
                {
                    isLoaded && currentChat === undefined ? (
                        <Welcome currentUser={currentUser} />) : (
                        <ChatContainer
                            currentChat={currentChat}
                            currentUser={currentUser}
                            socket={socket}
                        />)
                }
            </div>
        </div>
    )
}

export default Chat;