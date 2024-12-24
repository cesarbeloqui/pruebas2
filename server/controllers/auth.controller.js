import Usuario from '../models/Usuario.js';
import { generarToken, formatearUsuario } from '../utils/jwt.utils.js';
import { emitUserUpdate } from '../services/socketService.js';
import { sendVerificationEmail } from '../services/email.service.js';
import crypto from 'crypto';


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario || !(await usuario.validarPassword(password))) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        if (!usuario.email_verificado) {
            return res.status(403).json({
                mensaje: 'Por favor verifica tu correo electrónico para acceder',
                needsVerification: true
            });
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
        const token_verificacion = crypto.randomBytes(32).toString('hex');

        const usuario = await Usuario.create({
            nombre,
            email,
            password,
            token_verificacion,
            email_verificado: false
        });

        try {
            await sendVerificationEmail(email, token_verificacion);
            res.status(201).json({
                mensaje: 'Usuario registrado. Por favor verifica tu correo electrónico.'
            });
        } catch (emailError) {
            // Si falla el envío del correo, eliminamos el usuario creado
            await usuario.destroy();
            throw new Error('Error al enviar el correo de verificación');
        }
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ mensaje: 'El email ya está registrado' });
        }
        console.error('Error en registro:', error);
        res.status(500).json({ mensaje: error.message });
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

export const reenviarVerificacion = async (req, res) => {
    try {
        const { email } = req.body;
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        if (usuario.email_verificado) {
            return res.status(400).json({ mensaje: 'El email ya está verificado' });
        }

        const token_verificacion = crypto.randomBytes(32).toString('hex');
        usuario.token_verificacion = token_verificacion;
        await usuario.save();

        await sendVerificationEmail(email, token_verificacion);
        res.json({ mensaje: 'Correo de verificación reenviado' });
    } catch (error) {
        console.error('Error al reenviar verificación:', error);
        res.status(500).json({ mensaje: 'Error al reenviar el correo de verificación' });
    }
};
export const verificarEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const usuario = await Usuario.findOne({ where: { token_verificacion: token } });

        if (!usuario) {
            return res.status(400).json({ mensaje: 'Token de verificación inválido' });
        }

        usuario.email_verificado = true;
        usuario.token_verificacion = null;
        await usuario.save();

        res.json({ mensaje: 'Email verificado exitosamente' });
    } catch (error) {
        console.error('Error al verificar email:', error);
        res.status(500).json({ mensaje: 'Error al verificar email' });
    }
};
