import React, { useEffect, useState } from 'react';
import Logo from '../assets/logo.svg';
import './ContactsStyle.scss';

export default function Contacts({ contacts, currentUser, changeChat }) {
    const [currentUserName, setCurrentUserName] = useState(undefined);
    const [currentUserImage, setCurrentUserImage] = useState(undefined);
    const [currentSelected, setCurrentSelected] = useState(undefined);
    const [searchName, setSearchName] = useState('');
    useEffect(() => {
        if (currentUser) {
            setCurrentUserImage(currentUser.avatarImage);
            setCurrentUserName(currentUser.username);
        }
    }, [currentUser]);

    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index);
        changeChat(contact);
    }

    const handleSearch = () => {
        if(!searchName) {
            alert('Please input usernmae to search');
        }
        else {
            alert(searchName);
        }
    }

    return (
        <>
            {
                currentUserImage && currentUserName && (
                    <div className='contact-container'>
                        <div className='brand'>
                            <img src={Logo} alt='logo' />
                            <h3>snappy</h3>
                        </div>
                        <div className="search-user">
                            <input
                                type='text'
                                placeholder='Search user'
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                            />
                            <button className="search-btn" onClick={handleSearch}>
                                Search
                            </button>
                        </div>
                        <div className='contacts'>
                            {
                                contacts.map((contact, index) => {
                                    return (
                                        <div
                                            className={`contact ${index === currentSelected ? 'selected' : ''
                                                }`}
                                            key={index}
                                            onClick={() => changeCurrentChat(index, contact)}
                                        >
                                            <div className='avatar'>
                                                <img
                                                    src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                                                    alt=''
                                                />
                                            </div>
                                            <div className='username'>
                                                <h3>{contact.username}</h3>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="current-user">
                            <div className='avatar'>
                                <img
                                    src={`data:image/svg+xml;base64,${currentUserImage}`}
                                    alt=''
                                />
                            </div>
                            <div className='username'>
                                <h2>{currentUserName}</h2>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}