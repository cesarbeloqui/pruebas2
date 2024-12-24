import { sequelize } from '../config/database.js';

export const addEmailVerification = async () => {
    try {
        // Check if columns exist before adding them
        const [emailVerifiedResults] = await sequelize.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'Usuarios' 
            AND COLUMN_NAME = 'email_verificado'
        `);

        const [tokenResults] = await sequelize.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'Usuarios' 
            AND COLUMN_NAME = 'token_verificacion'
        `);

        // Add columns only if they don't exist
        if (emailVerifiedResults.length === 0) {
            await sequelize.query(`
                ALTER TABLE Usuarios 
                ADD COLUMN email_verificado BOOLEAN DEFAULT false;
            `);
            console.log('✅ Columna email_verificado agregada correctamente');
        } else {
            console.log('ℹ️ La columna email_verificado ya existe');
        }

        if (tokenResults.length === 0) {
            await sequelize.query(`
                ALTER TABLE Usuarios 
                ADD COLUMN token_verificacion VARCHAR(255);
            `);
            console.log('✅ Columna token_verificacion agregada correctamente');
        } else {
            console.log('ℹ️ La columna token_verificacion ya existe');
        }

    } catch (error) {
        console.error('❌ Error al verificar/agregar columnas de verificación:', error.message);
        throw error;
    }
};