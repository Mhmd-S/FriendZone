import { useState, useEffect, useRef } from 'react';
import MessageList from './ChatList';
import useAuth from '../authentication/useAuth';
import * as chatAPI from '../api/chatAPI';
import Spinner from './Spinner';
import SearchBar from './SearchBar';
import DefaultProfilePicture from './DefaultProfilePicture';
import { Link } from 'react-router-dom';
import { socket } from '../api/socket';

const Chat = () => {

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [recipient, setRecipient] = useState(null); 
  const [chats, setChats] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [stopFetching, setStopFetching] = useState(false);

  const [chatPage, setChatPage] = useState(1);
  const [stopChatFetching ,setStopChatFetching] = useState(false);
  const [isNew, setIsNew] = useState(false); // new chat

  const { user } = useAuth();

  let containerRef = useRef(null);

  useEffect(()=>{
    fetchChats();
  }, [])

  useEffect(() => {
    socket.connect();

    const onDisconnect= () => {
      console.log('Disconnected');
    }

    const onMessage = (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    }

    socket.on('disconnect', onDisconnect);
    socket.on('message', onMessage);

    return () => {
      socket.off('disconnect', onDisconnect);
      socket.off('message', onMessage);
    };
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
        console.log(entry.isIntersecting);
        if (entry.isIntersecting) {
          setIsLoading(true);
          fetchChats()
            .finally(() => setIsLoading(false));
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

  useEffect(()=>{
    if (recipient){
      fetchChat();
    }
  }, [recipient]);

  const fetchChat = async() => {
    if (stopChatFetching) {
      return;
    }
    
    setIsLoading(true);
    const res = await chatAPI.getChat(recipient._id, chatPage);

    if (res.status === 'error') {
      setChats([<div key={'problemEcnounterdKey'}>A problem was encounterd. Try again later</div>]);
      setIsLoading(false);
      return;
    }

    if (res.data.length === 0 && page === 1) {
      setIsLoading(false);
      setStopChatFetching(true);
      setIsNew(true);
      return;
    }

    if (res.data.length === 0 && page > 1) {
      setIsLoading(false);
      stopChatFetching(true);
      return;
    }
    
    if (res.status === 'success') {
      setMessages(res.data, ...messages.reverse());
      setChatPage(page + 1);
      setIsLoading(false); 
      }
  }


  const fetchChats = async() => {
    
    if (stopFetching) {
      return;
    }
    
    setIsLoading(true);
    const res = await chatAPI.getChats(page);

    if (res.status === 'error') {
      setChats([<div key={'problemEcnounterdKey'}>A problem was encounterd. Try again later</div>]);
      console.log('80')
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
        return (
          <div key={chat._id}>
            <div>{chat.participants[0] === user._id ? chat.participants[1] : chat.participants[0] }</div>
          </div>
        );
      });
      
      setPage(page + 1)
      setChats([...chats,...results]); 
      setIsLoading(false); 
      }
    };

    const sendMessage = () => {
      // Send the message to the server
      socket.emit('message', {
        recipientId: recipient._id, 
        message: messageInput,
        newChat: isNew,
      });
  
      // Add the sent message to the local state
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'You', message: messageInput },
      ]);
  
      // Clear the message input
      setMessageInput('');
    }

  return (
    <div className='w-full h-full text-white relative'>
      <div className='w-full h-full'>
        
        <h3 className='flex w-full h-[10%] sticky border-b-2 border-b-[#464b5f] px-4 py-2 items-center bg-[#282c37] rounded-t-lg'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#787ad9" className="w-8 h-8 pr-2">
            <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
          </svg>
          <span className='text-xl text-white'>Chat</span>
        </h3>
        
        <SearchBar chatMode={true} setRecipient={setRecipient} />

        <div className='w-full h-[80%] bg-[#282c37] flex flex-col items-center overflow-y-scroll scrollbar:bg-blue-500 rounded-xl scrollbar scrollbar-thumb-blue-500 scrollbar-track-gray-200'>
          {chats.length <= 0 ? <div className='text-center h-full flex flex-col justify-center items-center'>No chats found</div>
           :
           <>
             {chats}
             {isLoading ? 
               <Spinner size={12} /> 
             :
               <div ref={containerRef} className='border-[1px] border-transparent'></div>
             }
           </>
          }
        </div>
      </div>
      {recipient && (
        <div className='w-full h-full absolute left-0 top-0 bg-[#282c37]'>
          
          <Link to={'/profile/' + recipient.username} className='w-full h-[10%] bg-[#60698459] my-2 px-2 rounded-md flex items-center'>
            {recipient.profilePicture ? <img className='w-12 h-12 rounded-full' src={recipient.profilePicture} alt='Profile Picture' /> : <DefaultProfilePicture size={12} />} 
            <p className='pl-2 text-white'>{recipient.username}</p>
          </Link>
          
          <div className='w-full h-[80%] flex flex-col overflow-y-scroll scrollbar:bg-blue-500 rounded-xl scrollbar scrollbar-thumb-blue-500 scrollbar-track-gray-200'>
            {<MessageList messages={messages}/>}
          </div>
          
          <div className='w-full h-[10%] flex items-center'>
            <input type="text" placeholder='Type your message' value={messageInput} onChange={(e) => setMessageInput(e.target.value)} className='rounded-md bg-transparent resize-none w-[90%] outline-none p-1'/>
              <button onClick={sendMessage} className='w-[10%]'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 p-2 hover:bg-[#99acc633] rounded-md">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
          </div>
        
        </div>
      )
      }
    </div>
     );
  };

export default Chat;
