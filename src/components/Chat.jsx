import { useState, useEffect } from 'react';
import useAuth from '../authentication/useAuth';
import { socket } from '../api/socket';
import Contacts from './Contacts';
import ChatActive from './ChatActive';

const Chat = () => {
  const [chatId, setChatId] = useState(null);
  const [recipient, setRecipient] = useState(null);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      return;
    }
    socket.connect();

    const onDisconnect = () => {
      // Disconnect from socket
      console.log('Disconnected');
    };

    const onError = () => {
      // Display error message
      setError("Couldn't perform the action");
      setTimeout(() => setError(null), 4000);
    }


    const onChatId = (data) => {
      // Receive chatId from socket
      setChatId(data);
    };

    socket.on('error', onError);
    socket.on('disconnect', onDisconnect);
    socket.on('chatId', onChatId);

    return () => {
      socket.off('disconnect', onDisconnect);
      socket.off('error', onError);
    };
  }, []);

  const handleSetRecipient = (recipientObj) => {
    if (recipientObj === null || recipientObj?._id == user._id ) {
      setRecipient(null);
    }else {
      setRecipient(recipientObj);
    }
  }

  return (
    <div className={(recipient ? 'md:grid md:grid-rows-[10%_90%] md:grid-flow-cols-1 flex flex-col' :  'grid grid-rows-[10%_90%] grid-cols-1') + ' h-full w-full bg-[#282c37] rounded-lg'}>
      
      <h3 className={' flex w-full sticky border-b-2 border-b-[#464b5f] px-4 py-2 items-center bg-[#282c37] rounded-t-lg'}>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='#787ad9' className='w-8 h-8 pr-2'>
            <path
                fillRule='evenodd'
                d='M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z'
                clipRule='evenodd'
            />
        </svg>
        <span className='text-xl text-white'>Chat</span>
      </h3>
      
      { 
        user ?
          <div className=' text-white h-full w-full flex flex-col md:grid md:grid-cols-[40%_60%] md:grid-rows-1'>
              <Contacts 
                handleSetRecipient={handleSetRecipient} 
                setChatId={setChatId} 
                chatId={chatId}
                recipient={recipient
                }/>
              {(recipient) &&
              <ChatActive
                chatId={chatId}
                recipient={recipient}
                handleSetRecipient={handleSetRecipient}
                setChatId={setChatId}
              />
                }
            </div>
        : 
          <div className='flex justify-center items-center w-full h-full'>
              <span className='text-2xl text-[#ffffff3f]'>Please login to chat</span>
          </div>
        }
              { error &&
      <div className='flex justify-center items-center p-4 bg-red-700 absolute top-[15%] left-[15%]'>
        <span className='text-2xl text-red-600'>{error}</span>
      </div>
      }

    </div>
  );
};

export default Chat;
