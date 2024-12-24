import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

export const verificarToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ mensaje: 'Token no proporcionado' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta');
        const usuario = await Usuario.findByPk(decoded.id);

        if (!usuario) {
            return res.status(401).json({ mensaje: 'Usuario no encontrado' });
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        res.status(401).json({ mensaje: 'Token inválido' });
    }
};

export const esAdmin = async (req, res, next) => {
    try {
        if (req.usuario.rol !== 'admin') {
            return res.status(403).json({ mensaje: 'Acceso denegado' });
        }
        next();
    } catch (error) {
        res.status(401).json({ mensaje: 'Error de autorización' });
    }
};