import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

export const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: ['id', 'nombre', 'email', 'rol', 'activo', 'createdAt']
        });
        res.json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ mensaje: 'Error al obtener usuarios' });
    }
};

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

        res.json({ mensaje: `Usuario ${usuario.activo ? 'activado' : 'desactivado'} exitosamente` });
    } catch (error) {
        console.error('Error al cambiar estado del usuario:', error);
        res.status(500).json({ mensaje: 'Error al cambiar estado del usuario' });
    }
};

export const switchRole = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ mensaje: 'Token no proporcionado' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta');
        const usuario = await Usuario.findByPk(decoded.id);

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        if (usuario.rol !== 'admin') {
            return res.status(403).json({ mensaje: 'No tienes permisos para cambiar de rol' });
        }

        const rolActual = decoded.rol || usuario.rol;
        const nuevoRol = rolActual === 'admin' ? 'usuario' : 'admin';

        const nuevoToken = jwt.sign(
            {
                id: usuario.id,
                rol: nuevoRol
            },
            process.env.JWT_SECRET || 'tu_clave_secreta',
            { expiresIn: '24h' }
        );

        res.json({
            mensaje: 'Rol cambiado exitosamente',
            token: nuevoToken,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: nuevoRol
            }
        });
    } catch (error) {
        console.error('Error al cambiar rol:', error);
        res.status(500).json({ mensaje: 'Error al cambiar rol' });
    }
};