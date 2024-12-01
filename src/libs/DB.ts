import { Client } from 'pg';

// Creamos una función que nos dará acceso a la base de datos
export async function getDatabase() {
  // Creamos un nuevo cliente de PostgreSQL con los datos de conexión
  const client = new Client({
    connectionString: process.env.DATABASE_URL,  
    ssl: { rejectUnauthorized: false }  
  });
  // Nos conectamos a la base de datos
  await client.connect();

  return client;
}
