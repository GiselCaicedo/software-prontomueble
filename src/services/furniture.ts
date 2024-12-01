import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  
  ssl: { rejectUnauthorized: false }, 
});


type Furniture = {
  id_tipo_mueble: number;
  tipo_mueble: string;
};

export class FurnitureService {
  async getAllFurniture(): Promise<Furniture[]> {
    const client = await pool.connect();

    try {
      const query = `
        SELECT * FROM tipo_mueble;
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error al obtener muebles:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}
