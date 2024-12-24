import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { addActivoColumn } from '../migrations/add_activo_column.js';
import { addEmailVerification } from '../migrations/add_email_verification.js'; // Añade esta línea

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');

    // Run migrations
    await addActivoColumn();
    await addEmailVerification(); // Añade esta línea

    return true;
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
    return false;
  }
};

export { sequelize, testConnection };
