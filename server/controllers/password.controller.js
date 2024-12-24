import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Usuario from '../models/Usuario.js';
import { sendPasswordResetEmail } from '../services/email.service.js';

export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ mensaje: 'El email es requerido' });
        }

        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(404).json({ mensaje: 'No existe una cuenta con este correo' });
        }

        const resetToken = jwt.sign(
            { id: usuario.id },
            process.env.JWT_RESET_SECRET || 'reset_secret',
            { expiresIn: '1h' }
        );

        try {
            await sendPasswordResetEmail(email, resetToken);
            res.json({ mensaje: 'Se ha enviado un correo con las instrucciones' });
        } catch (emailError) {
            console.error('Error al enviar email:', emailError);
            res.status(500).json({
                mensaje: 'Error al enviar el correo de recuperación',
                error: emailError.message
            });
        }
    } catch (error) {
        console.error('Error en recuperación de contraseña:', error);
        res.status(500).json({
            mensaje: 'Error al procesar la solicitud',
            error: error.message
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                mensaje: 'Token y nueva contraseña son requeridos'
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_RESET_SECRET || 'reset_secret'
        );

        const usuario = await Usuario.findByPk(decoded.id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(newPassword, salt);
        await usuario.save();

        res.json({ mensaje: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ mensaje: 'El enlace ha expirado' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ mensaje: 'Token inválido' });
        }
        console.error('Error al restablecer contraseña:', error);
        res.status(500).json({
            mensaje: 'Error al restablecer la contraseña',
            error: error.message
        });
    }
};