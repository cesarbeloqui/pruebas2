import Usuario from '../models/Usuario.js';
import { generarToken, formatearUsuario } from '../utils/jwt.utils.js';
import { emitUserUpdate } from '../services/socketService.js';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario || !(await usuario.validarPassword(password))) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        if (!usuario.activo) {
            return res.status(403).json({ mensaje: 'Usuario desactivado' });
        }

        const token = generarToken(usuario);
        res.json({
            token,
            usuario: formatearUsuario(usuario)
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ mensaje: 'Error al iniciar sesión' });
    }
};

export const registro = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        const usuario = await Usuario.create({ nombre, email, password });
        const token = generarToken(usuario);
        res.status(201).json({
            token,
            usuario: formatearUsuario(usuario)
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ mensaje: 'El email ya está registrado' });
        }
        console.error('Error en registro:', error);
        res.status(500).json({ mensaje: 'Error al registrar usuario' });
    }
};

export const verificarUsuario = async (req, res) => {
    try {
        res.json({
            usuario: formatearUsuario(req.usuario)
        });
    } catch (error) {
        console.error('Error al verificar usuario:', error);
        res.status(500).json({ mensaje: 'Error al verificar usuario' });
    }
};

export const listarUsuarios = async (req, res) => {
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