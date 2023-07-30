import { useEffect, useState, useRef } from 'react';
import * as chatAPI from '../api/chatAPI';
import DefaultProfilePicture from './DefaultProfilePicture';
import useAuth from '../authentication/useAuth';
import { Link } from 'react-router-dom';
import { socket } from '../api/socket';
import Spinner from './Spinner';

const ChatActive = ({ chatId, recipient, setRecipient, setChatId }) => {

  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [stopFetching, setStopFetching] = useState(false);

  const containerRef = useRef(null);

  const { user } = useAuth();

  useEffect( ()=> {
    fetchChat();
  }, [recipient, chatId])

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
                fetchChat()
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
}, [messages]);

  const fetchChat = async() => {
    if (stopFetching || !recipient || !chatId) {
      return;
    }
    
    setIsLoading(true);
    const res = await chatAPI.getChat(recipient._id, page);

    if (res.status === 'error') {
      setMessages([<div key={'problemEcnounterdKey'}>A problem was encounterd. Try again later</div>]);
      setIsLoading(false);
      return;
    }

    if (res.data.length === 0 && page === 1) {
      setIsLoading(false);
      setStopFetching(true);
      return;
    }

    if (res.data.length === 0 && page > 1) {
      setIsLoading(false);
      stopFetching(true);
      return;
    }
    
    if (res.status === 'success') {
      console.log(res.data)
      setMessages([...res.data.messages, ...messages.reverse()]);
      setPage(page + 1);
      setIsLoading(false); 
      }
  }

  const sendMessage = () => {
    // Send the message to the server
    socket.emit('send-message', {
      recipient: recipient, 
      message: messageInput,
      chatId: chatId,
    });

    // Add the sent message to the local state
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: user._id, message: messageInput },
    ]);

    // Clear the message input
    setMessageInput('');
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
    <>
      {chatId || recipient ? 
      
      <div className='w-full h-full grid grid-rows-[10%_80%_10%] grid-cols-1'>
        <div className='w-full  bg-[#60698459] flex items-center'>
          <button className='w-fit h-full p-3 flex items-center group' onClick={ ()=> { setRecipient(null); setChatId(null) } }>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M9.53 2.47a.75.75 0 010 1.06L4.81 8.25H15a6.75 6.75 0 010 13.5h-3a.75.75 0 010-1.5h3a5.25 5.25 0 100-10.5H4.81l4.72 4.72a.75.75 0 11-1.06 1.06l-6-6a.75.75 0 010-1.06l6-6a.75.75 0 011.06 0z" clipRule="evenodd" />
            </svg>
            <span className='ml-3 group-hover:underline decoration-[#595aff] underline-offset-4 lg-hidden'>Back</span>
          </button>
          <Link to={'/profile/' + recipient.username} className='w-full h-full my-2 px-2 rounded-md flex items-center'>
            {recipient.profilePicture ? <img className='w-12 h-12 rounded-full' src={recipient.profilePicture} alt='Profile Picture' /> : <DefaultProfilePicture size={12} />} 
            <p className='pl-2 text-white'>{recipient.username}</p>
          </Link>
        </div>
        
        {isLoading ? 
        <div className='w-full'><Spinner size={12} /></div> 
        :
        <ul className=' bg-[#282c37] pl-2 max-w-full flex flex-col items-center overflow-y-scroll scrollbar:bg-blue-500 rounded-xl scrollbar scrollbar-thumb-blue-500 scrollbar-track-gray-200'>
          {(messages.length > 0 )&& messages.map((message) => {
            if (message.senderId === user._id) {
              return (
                <div key={message._id} className='bg-[#99acc6] max-w-[90%] my-1 self-end rounded-lg p-2'>
                  <div className='max-w-full break-words'>{message.content}</div>
                  <div>{convertDate(message.createdAt)}</div>
                </div>
              );
            } else {
              return (
                <div key={message._id} className='bg-[#787ad9] flex flex-col max-w-[90%]  my-1 self-start rounded-lg p-2'>
                  <div className='max-w-full break-words'>{message.content}</div>
                  <div>{convertDate(message.createdAt)}</div>
                </div>
              );
            }
            })}
        </ul>
        }

        <div className='w-full  bg-[#60698459] flex justify-evenly items-center px-2'>
          <input type="text" placeholder='Type your message' value={messageInput} onChange={(e) => setMessageInput(e.target.value)} className='h-3/5 bg-[#282c37] rounded-3xl resize-none w-[85%] outline-none px-2'/>
          <button onClick={sendMessage} className='w-[10%]'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 p-2 hover:bg-[#99acc633] rounded-md">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
      </div> 
    : 
      <div className='hidden w-full h-full lg:flex justify-center items-center'>
        <p className='text-2xl text-white'>Select a chat to start messaging</p>
      </div>
    }
  </>
  );
};

export default ChatActive;
