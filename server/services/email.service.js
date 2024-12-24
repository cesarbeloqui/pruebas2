import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

export const sendVerificationEmail = async (email, token) => {
    if (!process.env.FRONTEND_URL) {
        throw new Error('FRONTEND_URL no está configurado en las variables de entorno');
    }

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

    const mailOptions = {
        from: `"Sistema de Verificación" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verifica tu cuenta',
        html: `
            <h1>Verificación de Cuenta</h1>
            <p>Gracias por registrarte. Por favor, verifica tu cuenta haciendo click en el siguiente enlace:</p>
            <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #646cff; color: white; text-decoration: none; border-radius: 5px;">
                Verificar Cuenta
            </a>
            <p>Si no creaste esta cuenta, puedes ignorar este correo.</p>
            <p>Este enlace expirará en 24 horas.</p>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email de verificación enviado:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error al enviar email de verificación:', error);
        throw new Error(`Error al enviar el correo de verificación: ${error.message}`);
    }
};

export const sendPasswordResetEmail = async (email, resetToken) => {
    if (!process.env.FRONTEND_URL) {
        throw new Error('FRONTEND_URL no está configurado en las variables de entorno');
    }

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
        from: `"Sistema de Recuperación" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Recuperación de Contraseña',
        html: `
            <h1>Recuperación de Contraseña</h1>
            <p>Has solicitado restablecer tu contraseña.</p>
            <p>Haz click en el siguiente enlace para crear una nueva contraseña:</p>
            <a href="${resetUrl}" style="padding: 10px 20px; background-color: #646cff; color: white; text-decoration: none; border-radius: 5px;">
                Restablecer Contraseña
            </a>
            <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
            <p>Este enlace expirará en 1 hora.</p>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email enviado:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error detallado al enviar email:', error);
        throw new Error(`Error al enviar el correo: ${error.message}`);
    }
};