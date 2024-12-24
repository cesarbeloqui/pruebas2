import express from 'express';
import authRoutes from './auth.routes.js';
import passwordRoutes from './password.routes.js';
import userRoutes from './user.routes.js';

const router = express.Router();

// Rutas de autenticación básica (login, registro)
router.use('/', authRoutes);

// Rutas de gestión de contraseña
router.use('/', passwordRoutes);

// Rutas de gestión de usuarios (protegidas)
router.use('/usuarios', userRoutes);

export default router;