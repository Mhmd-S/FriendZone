import io from 'socket.io-client';

export const socket = io('http://127.0.0.1:3000', {autoConnect: false, withCredentials: true});

