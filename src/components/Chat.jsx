import { useState, useEffect } from 'react';
import Spinner from './Spinner';
import { socket } from '../api/socket';
import Contacts from './Contacts';
import ChatActive from './ChatActive';

const Chat = () => {
  const [chatId, setChatId] = useState(null);
  const [recipient, setRecipient] = useState(null);
  const [newMessages, setNewMessages] = useState(null);

  useEffect(() => {
    socket.connect();

    const onDisconnect = () => {
      // Disconnect from socket
      console.log('Disconnected');
    };

    const onMessage = (data) => {
      // Receive message from socket
      setNewMessages((prevMessages) => [...prevMessages, data]);
    };

    const onChatId = (data) => {
      // Receive chatId from socket
      setChatId(data);
    };

    socket.on('disconnect', onDisconnect);
    socket.on('message', onMessage);
    socket.on('chatId', onChatId);

    return () => {
      socket.off('disconnect', onDisconnect);
      socket.off('message', onMessage);
    };
  }, []);

  return (
    <div className='w-full h-full text-white relative'>
      <div className='w-full h-full'> 
        { !chatId ?
        <Contacts setRecipient={setRecipient} setChatId={setChatId} newMessages={newMessages} />
        :
        <ChatActive
          chatId={chatId}
          recipient={recipient}
          setRecipient={setRecipient}
          setChatId={setChatId}
          newMessages={newMessages}
          setNewMessages={setNewMessages}
        />
          }
      </div>
    </div>
  );
};

export default Chat;
