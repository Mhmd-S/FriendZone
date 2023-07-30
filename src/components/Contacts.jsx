import React, { useEffect, useState, useRef } from 'react';
import * as chatAPI from '../api/chatAPI';
import useAuth from '../authentication/useAuth';
import DefaultProfilePicture from './DefaultProfilePicture';
import SearchBar from './SearchBar';
import Spinner from './Spinner';
import { socket } from '../api/socket';

const Contacts = ({ setChatId, setRecipient, chatId, recipient }) => {
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

            const { chatId, sender, recipient, message, timestamp } = data;
            console.log('Message recieved')

            let chatsTemp = [...chats];
            let chatFound;
            let ind; 

            chatFound = chats.find((chat, index)=>{
                if (chat._id === chatId) {
                    ind = index;
                    return true;
                }
            })

            console.log(data);
            if (chatFound) {
                console.log('Contact found')
                chatFound.lastMessage = message;
                chatFound.updatedAt = timestamp;
                
                chatsTemp.splice(ind, 1);
                chatsTemp.unshift(chatFound);
                
                setChats(chatsTemp);

            } else {
                console.log('Contact not found')
                const newChat = {
                    _id: chatId,
                    participants: [sender, recipient],
                    lastMessage: {
                        content: message,
                        updatedAt: timestamp,
                    },
                };
               
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
                if (entry.isIntersecting) {
                    fetchChats()
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
            setPage(page + 1);
            setChats([...chats,...res.data]);
            setIsLoading(false);
        }
    };

    const populateChats = () => {
         const chatsEle = chats.map((chat) => {
                const contactInfo = chat.participants[0]._id === user._id ? chat.participants[1] : chat.participants[0];
                

                return (
                    <div
                        key={chat._id}
                        className='w-full h-[15%] grid grid-cols-[17.5%_67.5%_15%] items-center justify-between border-b-2 border-b-[#464b5f] cursor-pointer hover:bg-[#464b5f] hover:bg-opacity-10'
                        onClick={() => {
                            setRecipient(contactInfo);
                            setChatId(chat._id);
                        }}
                    >
                        <div className='w-full h-full flex justify-center items-center'>
                        {contactInfo.profilePicture ? (
                            <img
                                src={contactInfo.profilePicture}
                                alt='Profile'
                                className='w-12 h-12 rounded-full'
                            />
                        ) : (
                            <DefaultProfilePicture size={10}/>
                        )}
                        </div>
                        <div className='h-full w-full  grid grid-rows-[40%_60%] pt-2 px-1'>
                            <div className='w-full overflow-hidden'>{contactInfo.username}</div>
                            <div className='text-[#71768b] w-full overflow-hidden md:text-sm'>
                                {chat.lastMessage.content}
                            </div>
                            
                        </div>
                        <div className='text-[0.85rem] h-full pt-2 md:text-[0.7rem]'>{convertDate(chat.lastMessage.updatedAt)}</div>
                    </div>
                );
            });
            return chatsEle;
    }

    const convertDate = (date) => {
        const dateObj = new Date(date);
        const now = new Date(); // Get the current date and time
    
        let dateStr;
        let timeStr;
    
        // Check if the date is today, then display the time
        if (
            dateObj.getDate() === now.getDate() &&
            dateObj.getMonth() === now.getMonth() &&
            dateObj.getFullYear() === now.getFullYear()
        ) {
            dateStr = '';
            timeStr = dateObj.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            });
        } else if (Math.abs(now - dateObj) < 7 * 24 * 60 * 60 * 1000) {
            // Check if the date is within the last 7 days (604800000 milliseconds)
            dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
            timeStr = '';
        } else {
            dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            timeStr = '';
        }
    
        return `${dateStr} ${timeStr}`.trim();
    };
    

    return (
        <div className={(chatId && recipient) && 'hidden ' + 'w-full h-full'}>
            <SearchBar chatMode={true} setRecipient={setRecipient} />
            <div className='w-full h-[80%] bg-[#282c37] flex flex-col items-center overflow-y-scroll scrollbar:bg-blue-500 rounded-xl scrollbar scrollbar-thumb-blue-500 scrollbar-track-gray-200'>
                {chats.length <= 0 ? (
                    <div className='text-center h-full flex flex-col justify-center items-center'>No chats found</div>
                ) : (
                    <>
                        {populateChats()}
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
