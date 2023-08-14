import io from 'socket.io-client';

export const socket = io('https://friend-zone-2rm0.onrender.com:10000', {autoConnect: true, withCredentials: true});

