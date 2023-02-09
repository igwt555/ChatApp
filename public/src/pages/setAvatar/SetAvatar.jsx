import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios';
import { Buffer } from 'buffer';

import 'react-toastify/dist/ReactToastify.css';
import './style.scss';
import loader from '../../assets/loader.gif';
import { setAvatarRoute } from '../../utils/APIRoutes';

export default function SetAvatar() {
    const api = 'https://api.multiavatar.com/45678945';
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);

    const toastOptions = {
        position: 'bottom-right',
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
    };

    useEffect(() => {
        async function fetchData() {
            if (!localStorage.getItem('chat-app-user')) {
                navigate('/login');
            }
        }
        fetchData();
    })

    const setProfilePicture = async () => {
        if (selectedAvatar === undefined) {
            toast.error('Please choose an avatar', toastOptions);
        } else {
            const user = await JSON.parse(localStorage.getItem('chat-app-user'));
            const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
                image: avatars[selectedAvatar],
            });
            console.log(data);
            if (data.isSet) {
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem('chat-app-user', JSON.stringify(user));
                navigate('/');
            } else {
                toast.error('Error setting Avatar, Please try again', toastOptions);
            }
        }
    };

    useEffect(() => {
        async function fetchData() {
            const data = [];
            for (let i = 0; i < 4; i++) {
                const image = await axios.get(
                    `${api}/${Math.round(Math.random() * 1000)}`
                );
                const buffer = new Buffer(image.data);
                data.push(buffer.toString('base64'));
            }
            setAvatars(data);
            setIsLoading(false);
        }
        fetchData();
    }, []);

    return (
        <>
            {
                isLoading ? <div className='container'>
                    <img src={loader} alt='lading' className='loader' />
                </div> : (
                    <div className='container'>
                        <div className='title-container'>
                            <h1>Pick an avatar as your profile picture</h1>
                        </div>
                        <div className='avatars'>
                            {
                                avatars.map((avatar, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={`avatar ${selectedAvatar === index ? 'selected' : ''
                                                }`}
                                        >
                                            <img src={`data:image/svg+xml;base64,${avatar}`}
                                                alt='avatar'
                                                onClick={() => setSelectedAvatar(index)}
                                            />
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <button className='submit-btn' onClick={setProfilePicture}>Set as Profile Picture</button>
                    </div>
                )
            }
            <ToastContainer />
        </>
    )
}