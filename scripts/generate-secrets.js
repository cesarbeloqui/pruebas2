import crypto from 'crypto';

// Generar claves seguras
const jwtSecret = crypto.randomBytes(64).toString('hex');
const jwtResetSecret = crypto.randomBytes(64).toString('hex');

console.log('\n=== Claves JWT Generadas ===\n');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`JWT_RESET_SECRET=${jwtResetSecret}\n`);