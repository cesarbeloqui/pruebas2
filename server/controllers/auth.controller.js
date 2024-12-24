import Usuario from '../models/Usuario.js';
import { generarToken, formatearUsuario } from '../utils/jwt.utils.js';
import { emitUserUpdate } from '../services/socketService.js';

export const toggleUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        if (usuario.rol === 'admin') {
            const adminCount = await Usuario.count({ where: { rol: 'admin', activo: true } });
            if (adminCount <= 1) {
                return res.status(400).json({ mensaje: 'No se puede desactivar al último administrador' });
            }
        }

        usuario.activo = !usuario.activo;
        await usuario.save();

        // Emitir evento de actualización
        emitUserUpdate('estado', usuario);

        res.json({ mensaje: `Usuario ${usuario.activo ? 'activado' : 'desactivado'} exitosamente` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al cambiar estado del usuario' });
    }
};

export const cambiarRolUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        if (usuario.rol === 'admin' && req.body.rol === 'usuario') {
            const adminCount = await Usuario.count({ where: { rol: 'admin', activo: true } });
            if (adminCount <= 1) {
                return res.status(400).json({ mensaje: 'No se puede cambiar el rol del último administrador' });
            }
        }

        usuario.rol = req.body.rol;
        await usuario.save();

        // Emitir evento de actualización
        emitUserUpdate('rol', usuario);

        res.json({ mensaje: 'Rol actualizado exitosamente' });
    } catch (error) {
        console.error('Error al cambiar rol del usuario:', error);
        res.status(500).json({ mensaje: 'Error al cambiar rol del usuario' });
    }
};