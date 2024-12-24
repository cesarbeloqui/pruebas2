import { customToast } from '../../components/ui/toast';

export const setupSocketEvents = (socket, setIsConnected) => {
    socket.on('connect', handleConnect(setIsConnected));
    socket.on('connect_error', handleConnectError(setIsConnected));
    socket.on('disconnect', handleDisconnect(setIsConnected));
    socket.on('error', handleError);
    socket.on('notificacion', handleNotification);
};

const handleConnect = (setIsConnected) => () => {
    console.log('Conectado al servidor de WebSocket');
    setIsConnected(true);
    customToast.success('Conexión establecida');
};

const handleConnectError = (setIsConnected) => (error) => {
    console.error('Error de conexión:', error.message);
    customToast.error('Error de conexión con el servidor');
    setIsConnected(false);
};

const handleDisconnect = (setIsConnected) => () => {
    console.log('Desconectado del servidor');
    setIsConnected(false);
    customToast.error('Conexión perdida');
};

const handleError = (error) => {
    console.error('Error en el socket:', error);
    customToast.error('Error en la conexión');
};

const handleNotification = (mensaje) => {
    customToast.notification(mensaje);
};