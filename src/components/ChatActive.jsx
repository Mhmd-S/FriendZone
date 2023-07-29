import React, { useEffect, useState } from 'react';
import * as chatAPI from '../api/chatAPI';
import DefaultProfilePicture from './DefaultProfilePicture';
import useAuth from '../authentication/useAuth';
import { Link } from 'react-router-dom';
import { socket } from '../api/socket';


// CLean and fix
const ChatActive = ({ chatId, recipient, setRecipient, setChatId }) => {

  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [stopFetching, setStopFetching] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    const onMessage = (data) => {
      // Receive message from socket
      setMessages((prevMessages) => [...prevMessages, data]);
      socket.on('send-message', onMessage);
    };
  }, [])

  const fetchChat = async() => {
    if (stopFetching || !recipient || !chatId) {
      return;
    }
    
    setIsLoading(true);
    const res = await chatAPI.getChat(recipient._id, chatPage);

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
      const messages = res.data.map((message) => {

        if (message.sender === user._id) {
          return (
            <div key={message._id} className='bg-slate-500'>
              <div>{message.sender}</div>
              <div>{message.content}</div>
              <div>{message.createdAt}</div>
            </div>
          );
        } else {
          return (
            <div key={message._id} className='bg-blue-300'>
              <div>{message.sender}</div>
              <div>{message.content}</div>
              <div>{message.createdAt}</div>
            </div>
          );
        }
      });

      setMessages(res.data, ...messages.reverse());
      setPage(page + 1);
      setIsLoading(false); 
      }
  }

  const sendMessage = () => {
    // Send the message to the server
    socket.emit('send-message', {
      recipientId: recipient._id, 
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

  return (
    <div>
      {chatId || recipient ? <>
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
      
      <ul>
        {messages}
      </ul>

      <div className='w-full  bg-[#60698459] flex justify-evenly items-center px-2'>
            <input type="text" placeholder='Type your message' value={messageInput} onChange={(e) => setMessageInput(e.target.value)} className='h-3/5 bg-[#282c37] rounded-3xl resize-none w-[85%] outline-none px-2'/>
            <button onClick={sendMessage} className='w-[10%]'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 p-2 hover:bg-[#99acc633] rounded-md">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
          </> 
          : 
          <div className='hidden w-full h-full lg:flex justify-center items-center'>
            <p className='text-2xl text-white'>Select a chat to start messaging</p>
          </div>}
    </div>
  );
};

export default ChatActive;
