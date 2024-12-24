import express from 'express';
import { verificarToken, esAdmin } from '../middleware/auth.middleware.js';
import {
  login,
  registro,
  verificarUsuario,
  toggleUsuario,
  cambiarRolUsuario,
  listarUsuarios
} from '../controllers/auth.controller.js';

const router = express.Router();

// Rutas públicas
router.post('/login', login);
router.post('/registro', registro);

// Rutas protegidas
router.get('/verificar', verificarToken, verificarUsuario);

// Rutas admin
router.get('/usuarios', verificarToken, esAdmin, listarUsuarios);
router.put('/usuarios/:id/toggle', verificarToken, esAdmin, toggleUsuario);
router.put('/usuarios/:id/rol', verificarToken, esAdmin, cambiarRolUsuario);

export default router;