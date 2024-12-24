import Usuario from '../models/Usuario.js';
import { generarToken, formatearUsuario } from '../utils/jwt.utils.js';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario || !usuario.activo) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas o usuario inactivo' });
        }

        const passwordValido = await usuario.validarPassword(password);
        if (!passwordValido) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        const token = generarToken(usuario);

        res.json({
            mensaje: 'Inicio de sesión exitoso',
            token,
            usuario: formatearUsuario(usuario)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al iniciar sesión' });
    }
};

export const registro = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ mensaje: 'El email ya está registrado' });
        }

        const usuario = await Usuario.create({
            nombre,
            email,
            password,
            rol: rol || 'usuario'
        });

        res.status(201).json({
            mensaje: 'Usuario registrado exitosamente',
            usuario: formatearUsuario(usuario)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al registrar usuario' });
    }
};

export const verificarUsuario = async (req, res) => {
    res.json({
        usuario: formatearUsuario(req.usuario)
    });
};

export const cambiarRol = async (req, res) => {
    try {
        const usuario = req.usuario;
        const nuevoRol = usuario.rol === 'admin' ? 'usuario' : 'admin';

        await usuario.update({ rol: nuevoRol });
        const token = generarToken(usuario);

        res.json({
            mensaje: 'Rol actualizado exitosamente',
            token,
            usuario: formatearUsuario(usuario)
        });
    } catch (error) {
        console.error('Error al cambiar rol:', error);
        res.status(500).json({ mensaje: 'Error al cambiar rol' });
    }
};

export const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: ['id', 'nombre', 'email', 'rol', 'activo', 'createdAt']
        });
        res.json(usuarios);
    } catch (error) {
        console.error(error);
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
        console.error(error);
        res.status(500).json({ mensaje: 'Error al cambiar estado del usuario' });
    }
};
// ... (mantener el código existente) ...

export const cambiarRolUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Verificar que no sea el último administrador si se está cambiando de admin a usuario
        if (usuario.rol === 'admin' && req.body.rol === 'usuario') {
            const adminCount = await Usuario.count({ where: { rol: 'admin', activo: true } });
            if (adminCount <= 1) {
                return res.status(400).json({ mensaje: 'No se puede cambiar el rol del último administrador' });
            }
        }

        usuario.rol = req.body.rol;
        await usuario.save();

        res.json({ mensaje: 'Rol actualizado exitosamente' });
    } catch (error) {
        console.error('Error al cambiar rol del usuario:', error);
        res.status(500).json({ mensaje: 'Error al cambiar rol del usuario' });
    }
};