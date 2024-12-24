import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io;

export const initializeSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"]
        }
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error('Autenticación requerida'));

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta');
            socket.userId = decoded.id;
            next();
        } catch (err) {
            next(new Error('Token inválido'));
        }
    });

    return io;
};

export const emitUserUpdate = (tipo, usuario) => {
    if (!io) throw new Error('Socket.IO no inicializado');

    io.emit('usuario_actualizado', {
        tipo,
        usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol,
            activo: usuario.activo
        }
    });
};