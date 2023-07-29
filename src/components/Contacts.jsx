import React, { useEffect, useState, useRef } from 'react';
import * as chatAPI from '../api/chatAPI';
import useAuth from '../authentication/useAuth';
import DefaultProfilePicture from './DefaultProfilePicture';
import SearchBar from './SearchBar';
import Spinner from './Spinner';
import { socket } from '../api/socket';

const Contacts = ({ setChatId, setRecipient }) => {
    const [chats, setChats] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [stopFetching, setStopFetching] = useState(false);

    const {user} = useAuth();

    const containerRef = useRef(null);

    useEffect(() => {
        fetchChats();
    }, []);

    useEffect(()=>{
        socket.on('receive-message', (data) => {
            const { chatId, sender, message, timestamp } = data;

            let chatsTemp = chats;
            let newChat;
            let ind; 

            newChat = chats.find((chat, index)=>{
                if (chat.id === chatId) {
                    ind = index;
                    return true;
                }
            })

            
            chatsTemp.splice(ind, 1);
            chatsTemp.unshift(newChat);

            if (newChat) {
                setChats(newChat);
            } else {
                console.log('Working fine')
                newChat = (
                    <div
                    key={chatId}
                    className='w-full'
                    onClick={() => {
                        setRecipient(sender);
                        setChatId(chatId);
                    }}>
                        <>
                            {sender.profilePicture ? (
                                <img
                                    src={sender.profilePicture}
                                    alt='Profile'
                                    className='w-12 h-12 rounded-full'
                                />
                            ) : (
                                <DefaultProfilePicture />
                            )}
                        </>
                        <div>{sender.username}</div>
                        <div>{message}</div>
                        <div>{timestamp}</div>
                    </div>
                )
                setChats([newChat, ...chats]);
            }
        })

        return () => {
            socket.off('message');
        }
    }, [])


    useEffect(() => {
        
        const container = containerRef.current;

        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                console.log(entry.isIntersecting);
                if (entry.isIntersecting) {
                    setIsLoading(true);
                    fetchChats().finally(() => setIsLoading(false));
                }
            },
            options
        );

        if (container) {
            observer.observe(container);
        }

        return () => {
            observer.disconnect();
        };
    }, [chats]);

    const fetchChats = async () => {
        if (stopFetching) {
            return;
        }

        setIsLoading(true);
        const res = await chatAPI.getChats(page);

        if (res.status === 'error') {
            setChats([
                <div key={'problemEncounteredKey'}>A problem was encountered. Try again later</div>,
            ]);
            console.log('80');
            setIsLoading(false);
            return;
        }

        if (res.data.length === 0 && page === 1) {
            setIsLoading(false);
            return;
        }

        if (res.data.length === 0 && page > 1) {
            setIsLoading(false);
            setStopFetching(true);
            return;
        }

        if (res.status === 'success') {
            const results = res.data.map((chat) => {
                const contactInfo = chat.participants[0]._id === user._id ? chat.participants[1] : chat.participants[0];

                return (
                    <div
                        key={chat._id}
                        className='w-full'
                        onClick={() => {
                            setRecipient(contactInfo);
                            setChatId(chat._id);
                        }}
                    >
                        <>
                            {contactInfo.profilePicture ? (
                                <img
                                    src={contactInfo.profilePicture}
                                    alt='Profile'
                                    className='w-12 h-12 rounded-full'
                                />
                            ) : (
                                <DefaultProfilePicture />
                            )}
                        </>
                        <div>{contactInfo.username}</div>
                        <div>{chat.lastMessage.content}</div>
                        <div>{chat.lastMessage.createdAt}</div>
                    </div>
                );
            });

            setPage(page + 1);
            setChats([...chats, ...results]);
            setIsLoading(false);
        }
    };

    return (
        <div className='w-full h-full'>
            <h3 className='flex w-full h-[10%] sticky border-b-2 border-b-[#464b5f] px-4 py-2 items-center bg-[#282c37] rounded-t-lg'>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='#787ad9' className='w-8 h-8 pr-2'>
                    <path
                        fillRule='evenodd'
                        d='M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z'
                        clipRule='evenodd'
                    />
                </svg>
                <span className='text-xl text-white'>Chat</span>
            </h3>

            <SearchBar chatMode={true} setRecipient={setRecipient} />

            <div className='w-full h-[80%] bg-[#282c37] flex flex-col items-center overflow-y-scroll scrollbar:bg-blue-500 rounded-xl scrollbar scrollbar-thumb-blue-500 scrollbar-track-gray-200'>
                {chats.length <= 0 ? (
                    <div className='text-center h-full flex flex-col justify-center items-center'>No chats found</div>
                ) : (
                    <>
                        {chats}
                        {isLoading ? (
                            <Spinner size={12} />
                        ) : (
                            <div ref={containerRef} className='border-[1px] border-transparent'></div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Contacts;
