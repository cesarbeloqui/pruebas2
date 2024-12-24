import dotenv from 'dotenv';
import { sequelize } from '../config/database.js';
import { cambiarRolUsuario } from '../utils/roleUtils.js';

dotenv.config();

async function main() {
    const email = process.argv[2];

    if (!email) {
        console.error('❌ Error: Debes proporcionar un email');
        console.log('Uso: node cambiarRolAdmin.js <email>');
        process.exit(1);
    }

    try {
        // Verificar conexión a la base de datos
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida');

        // Intentar cambiar el rol
        const usuario = await cambiarRolUsuario(email, 'admin');
        console.log(`✅ Usuario ${usuario.email} actualizado a rol admin exitosamente`);

        // Cerrar la conexión
        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);

        if (sequelize) {
            await sequelize.close();
        }

        process.exit(1);
    }
}

main();