import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { sequelize, testConnection } from './config/database.js';
import authRoutes from './routes/auth.js';
import { initializeSocket } from './services/socketService.js';

const app = express();
const httpServer = createServer(app);

// Inicializar Socket.IO
const io = initializeSocket(httpServer);

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
  try {
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.log('🚨 El servidor continuará ejecutándose sin conexión a la base de datos.');
    }

    if (dbConnected) {
      await sequelize.sync();
      console.log('✅ Modelos sincronizados con la base de datos.');
    }

    httpServer.listen(PORT, () => {
      console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

iniciarServidor();