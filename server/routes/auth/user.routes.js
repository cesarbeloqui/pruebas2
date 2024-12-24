import express from 'express';
import { verificarToken, esAdmin } from '../../middleware/auth.middleware.js';
import {
    listarUsuarios,
    toggleUsuario,
    cambiarRolUsuario
} from '../../controllers/auth.controller.js';

const router = express.Router();

// Todas las rutas requieren autenticación y rol de admin
router.use(verificarToken, esAdmin);

router.get('/', listarUsuarios);
router.put('/:id/toggle', toggleUsuario);
router.put('/:id/rol', cambiarRolUsuario);

export default router;