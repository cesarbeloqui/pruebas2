import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { sequelize, testConnection } from './config/database.js';
import authRoutes from './routes/auth.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);

// Middleware de autenticación para Socket.IO
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Autenticación requerida'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta');
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error('Token inválido'));
  }
});

// Manejo de conexiones Socket.IO
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.userId);

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.userId);
  });
});

// Inicialización del servidor
const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
  try {
    // Verificar la conexión a la base de datos
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.log('🚨 El servidor continuará ejecutándose sin conexión a la base de datos.');
    }

    // Sincronizar modelos solo si hay conexión
    if (dbConnected) {
      await sequelize.sync();
      console.log('✅ Modelos sincronizados con la base de datos.');
    }

    // Iniciar el servidor HTTP
    httpServer.listen(PORT, () => {
      console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

iniciarServidor();