import { sequelize } from '../config/database.js';
import Usuario from '../models/Usuario.js';

export async function cambiarRolUsuario(email, nuevoRol) {
    const transaction = await sequelize.transaction();

    try {
        const usuario = await Usuario.findOne({
            where: { email },
            transaction
        });

        if (!usuario) {
            throw new Error(`No se encontró ningún usuario con el email ${email}`);
        }

        usuario.rol = nuevoRol;
        await usuario.save({ transaction });

        await transaction.commit();
        return usuario;
    } catch (error) {
        await transaction.rollback();
        throw new Error(`Error al cambiar rol: ${error.message}`);
    }
}