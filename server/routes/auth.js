import express from 'express';
import { verificarToken, esAdmin } from '../middleware/auth.middleware.js';
import {
  login,
  registro,
  verificarUsuario,
  cambiarRol,
  listarUsuarios,
  toggleUsuario,
  cambiarRolUsuario
} from '../controllers/auth.controller.js';

const router = express.Router();

// Rutas públicas
router.post('/login', login);
router.post('/registro', registro);

// Rutas protegidas
router.get('/verificar', verificarToken, verificarUsuario);
router.post('/switch-role', verificarToken, cambiarRol);

// Rutas admin
router.get('/usuarios', verificarToken, esAdmin, listarUsuarios);
router.put('/usuarios/:id/toggle', verificarToken, esAdmin, toggleUsuario);
router.put('/usuarios/:id/rol', verificarToken, esAdmin, cambiarRolUsuario);

export default router;