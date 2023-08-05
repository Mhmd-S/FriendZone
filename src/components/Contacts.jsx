import  { useEffect, useState, useRef } from 'react';
import * as chatAPI from '../api/chatAPI';
import useAuth from '../authentication/useAuth';
import DefaultProfilePicture from './DefaultProfilePicture';
import SearchBar from './SearchBar';
import Spinner from './Spinner';
import { socket } from '../api/socket';

const Contacts = ({ setChatId, handleSetRecipient, chatId, recipient }) => {
    const [chats, setChats] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [stopFetching, setStopFetching] = useState(false);
    const [error, setError ] = useState(null);

    const {user} = useAuth();

    const containerRef = useRef(null);

    useEffect(()=>{
        fetchChats();
    })

    useEffect(() => {

        socket.on('sent-message', (data) => {
            const { chatId, sender, recipient, message, timestamp } = data;
            
            setChats(prevChats => {
                const chatIndex = prevChats.findIndex(chat => chat._id === chatId);
                
                if (chatIndex !== -1) {
                // Chat exists, update the last message
                const updatedChat = {
                    ...prevChats[chatIndex],
                    lastMessage: {
                    content: message,
                    updatedAt: timestamp,
                    }
                };
                
                // Move the updated chat to the beginning of the array
                prevChats.splice(chatIndex, 1);
                prevChats.unshift(updatedChat);
                
                return [...prevChats];
                } else {
                // Chat doesn't exist, create a new chat
                const newChat = {
                    _id: chatId,
                    participants: [sender, recipient],
                    lastMessage: {
                    content: message,
                    updatedAt: timestamp,
                    },
                };
                
                return [newChat, ...prevChats];
                }
            });
        })

        socket.on('receive-message', (data) => {
          const { chatId, sender, recipient, message, timestamp } = data;
          
          setChats(prevChats => {
            const chatIndex = prevChats.findIndex(chat => chat._id === chatId);
            
            if (chatIndex !== -1) {
              // Chat exists, update the last message
              const updatedChat = {
                ...prevChats[chatIndex],
                lastMessage: {
                  content: message,
                  updatedAt: timestamp,
                }
              };
              
              // Move the updated chat to the beginning of the array
              prevChats.splice(chatIndex, 1);
              prevChats.unshift(updatedChat);
              
              return [...prevChats];
            } else {
              // Chat doesn't exist, create a new chat
              const newChat = {
                _id: chatId,
                participants: [sender, recipient],
                lastMessage: {
                  content: message,
                  updatedAt: timestamp,
                },
              };
              
              return [newChat, ...prevChats];
            }
          });
        });
      
        return () => {
          socket.off('receive-message');
          socket.off('sent-message')
        }
      }, []);
      


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
    }, []);

    const fetchChats = async () => {
        if (stopFetching) {
            return;
        }

        setIsLoading(true);
        const res = await chatAPI.getChats(page);

        if (res.status === 'error') {
            setError(
                <div className='p-2 text-center h-full flex flex-col justify-center items-center'>A problem was encountered. Try again later</div>,
            );
            setIsLoading(false);
            return;
        }

        if (res.status === 'success') {
            setError(null);

            if (res.data.length === 0) {
                setIsLoading(false);
                setStopFetching(true);
                return;
            }
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
                        className='w-full h-[15%] grid grid-cols-[17.5%_65%_17.5%] grid-rows-1 items-center justify-between border-b-2 border-b-[#464b5f] cursor-pointer hover:bg-[#464b5f] hover:bg-opacity-10'
                        onClick={() => {
                            handleSetRecipient(contactInfo);
                            setChatId(chat._id);
                        }}
                    >
                        <div className='h-full flex justify-center items-start pt-4'>
                        {contactInfo.profilePicture ? (
                            <img
                                src={contactInfo.profilePicture}
                                alt='Profile'
                                className='w-10 h-10 rounded-full'
                            />
                        ) : (
                            <DefaultProfilePicture size={10}/>
                        )}
                        </div>
                        <div className='h-full  grid grid-rows-[40%_60%] pt-2 px-1'>
                            <div className='overflow-hidden truncate'>{contactInfo.username}</div>
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
            dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            timeStr = '';
        } else {
            dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            timeStr = '';
        }
    
        return `${dateStr} ${timeStr}`.trim();
    };
    

    return (
        <div className={(recipient ? 'md:grid md:grid-rows-[10%_90%] md:grid-cols-1 hidden ' : 'grid grid-rows-[10%_90%] grid-cols-1 ') + 'w-full h-full md:border-r-2 md:border-[#464b5f] pt-2'}>
            <SearchBar chatMode={true} handleSetRecipient={handleSetRecipient} />
            <div className='w-full bg-[#282c37] flex flex-col items-center overflow-y-scroll overflow-x-hidden border-t-2 border-t-[#464b5f] md:border-t-2 md:border-[#464b5f] scrollbar:bg-blue-500 scrollbar scrollbar-thumb-blue-500 scrollbar-track-gray-200'>
                {chats.length <= 0 ? (
                    <div className='p-2 text-center h-full w-full flex flex-col justify-center items-center text-[#ffffff3f]'>No chats found. Serach foar a user to start messaging</div>
                ) : (
                    <>
                        {error ? error : populateChats()}
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
