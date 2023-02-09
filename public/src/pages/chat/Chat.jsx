import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.scss';
import { allUsersRoute } from '../../utils/APIRoutes';
import Contacts from '../../components/Contacts';

function Chat() {
    const [contacts, setContacts] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [currentChat, setCurrentChat] = useState(undefined);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            if (!localStorage.getItem('chat-app-user')) {
                navigate('/login');
            } else {
                setCurrentUser(await JSON.parse(localStorage.getItem('chat-app-user')));
            }
        }
        fetchData();
    }, [navigate]);

    useEffect(() => {
        async function fetchData() {
            if(currentUser) {
                if (currentUser.isAvatarImageSet) {
                    const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
                    setContacts(data.data);
                } else {
                    navigate('/setAvatar');
                }
            }
        }
        fetchData();
    }, [currentUser, navigate]);
    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    }
    return (
        <div className='container'>
            <div className='content'>
                <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange}/>
            </div>
        </div>
    )
}

export default Chat;