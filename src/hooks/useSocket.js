import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { customToast } from '../components/ui/toast';

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

            const newSocket = io('http://localhost:3000', {
                auth: { token },
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000
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

const setupSocketEvents = (socket, setIsConnected) => {
    socket.on('connect', () => {
        console.log('Conectado al servidor de WebSocket');
        setIsConnected(true);
        customToast.success('Conexión establecida');
    });

    socket.on('connect_error', (error) => {
        console.error('Error de conexión:', error.message);
        customToast.error('Error de conexión con el servidor');
        setIsConnected(false);
    });

    socket.on('disconnect', () => {
        console.log('Desconectado del servidor');
        setIsConnected(false);
        customToast.error('Conexión perdida');
    });

    socket.on('error', (error) => {
        console.error('Error en el socket:', error);
        customToast.error('Error en la conexión');
    });

    socket.on('notificacion', (mensaje) => {
        customToast.notification(mensaje);
    });
};