import express from 'express';
import { login, registro, verificarUsuario } from '../../controllers/auth.controller.js';
import { verificarToken } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Rutas públicas
router.post('/login', login);
router.post('/registro', registro);

// Ruta protegida
router.get('/verificar', verificarToken, verificarUsuario);

export default router;