import { sequelize } from '../config/database.js';

export const addEmailVerification = async () => {
    try {
        await sequelize.query(`
            ALTER TABLE Usuarios 
            ADD COLUMN email_verificado BOOLEAN DEFAULT false,
            ADD COLUMN token_verificacion VARCHAR(255);
        `);
        console.log('✅ Columnas de verificación de email agregadas correctamente');
    } catch (error) {
        console.error('❌ Error al agregar columnas de verificación:', error.message);
        throw error;
    }
};