import { useState, useEffect } from 'react';
import Spinner from './Spinner';
import { socket } from '../api/socket';
import Contacts from './Contacts';
import ChatActive from './ChatActive';

const Chat = () => {
  const [chatId, setChatId] = useState(null);
  const [recipient, setRecipient] = useState(null);

  useEffect(() => {
    socket.connect();

    const onDisconnect = () => {
      // Disconnect from socket
      console.log('Disconnected');
    };

    const onChatId = (data) => {
      // Receive chatId from socket
      setChatId(data);
    };

    socket.on('disconnect', onDisconnect);
    socket.on('chatId', onChatId);

    return () => {
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <div className='h-full w-full bg-[#282c37] rounded-lg flex flex-col'>
      <h3 className={(chatId && recipient) ? 'hidden ' : 'flex ' + 'w-full h-[10%] sticky border-b-2 border-b-[#464b5f] px-4 py-2 items-center bg-[#282c37] rounded-t-lg'}>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='#787ad9' className='w-8 h-8 pr-2'>
            <path
                fillRule='evenodd'
                d='M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z'
                clipRule='evenodd'
            />
        </svg>
        <span className='text-xl text-white'>Chat</span>
      </h3>
      <div className='w-full h-full text-white md:grid md:h-[90%] md:grid-cols-[40%_60%]'>
        <Contacts 
          setRecipient={setRecipient} 
          setChatId={setChatId} 
          chatId={chatId}
          recipient={recipient
          }/>
        <ChatActive
          chatId={chatId}
          recipient={recipient}
          setRecipient={setRecipient}
          setChatId={setChatId}
        />
      </div>
    </div>
  );
};

export default Chat;
