import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'tu_clave_secreta';

export const generarToken = (usuario) => {
    return jwt.sign(
        { id: usuario.id },
        SECRET,
        { expiresIn: '24h' }
    );
};

export const formatearUsuario = (usuario) => {
    return {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
    };
};