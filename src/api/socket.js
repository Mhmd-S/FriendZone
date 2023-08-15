import io from 'socket.io-client';

export const socket = io('https://friendzone-backend-production.up.railway.app', {autoConnect: true, withCredentials: true});

