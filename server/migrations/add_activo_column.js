import { sequelize } from '../config/database.js';

const addActivoColumn = async () => {
    try {
        // Check if column exists before adding it
        const [results] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'Usuarios' 
      AND COLUMN_NAME = 'activo'
    `);

        if (results.length === 0) {
            await sequelize.query(`
        ALTER TABLE Usuarios 
        ADD COLUMN activo BOOLEAN DEFAULT true 
        AFTER rol;
      `);
            console.log('✅ Columna activo agregada correctamente');
        } else {
            console.log('ℹ️ La columna activo ya existe');
        }
    } catch (error) {
        console.error('❌ Error al verificar/agregar columna activo:', error.message);
        throw error;
    }
};

export { addActivoColumn };