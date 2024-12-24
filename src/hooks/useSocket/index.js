import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { setupSocketEvents } from './socketEvents';
import { SOCKET_CONFIG } from './socketConfig';

export const useSocket = (user) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (user) {
            const token = localStorage.getItem('token');

            if (!token) {
                console.error('No se encontró token de autenticación');
                return;
            }

            const newSocket = io(SOCKET_CONFIG.url, {
                ...SOCKET_CONFIG.options,
                auth: { token }
            });

            setupSocketEvents(newSocket, setIsConnected);
            setSocket(newSocket);

            return () => {
                newSocket.close();
                setIsConnected(false);
            };
        }
    }, [user]);

    return { socket, isConnected };
};