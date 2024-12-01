import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  
  ssl: { rejectUnauthorized: false }, 
});

type Cliente = {
  id_cliente: number;
  nombre: string;
  apellido: string;
  rut: string;
  telefono: string;
  correo: string;
  direccion: string;
  fecha_registro: string;
};


export class ClientsService {
  async createClient(clientData: any) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const direccionResult = await client.query(
        `
          INSERT INTO direccion (
            principal,
            complemento,
            codigo_postal
          ) VALUES ($1, $2, $3)
          RETURNING cod_direccion
        `,
        [
          clientData.direccion,
          clientData.complemento,
          clientData.codigo_postal,
        ],
      );

      const result = await client.query(
        `
          INSERT INTO cliente (
            id_cliente,
            nombre,
            apellido,
            num_telefono,
            email,
            cod_direccion,
            fecha_inscripcion,
            antiguedad
          ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE, FALSE)
          RETURNING id_cliente
        `,
        [
          clientData.documento,
          clientData.nombre,
          clientData.apellido,
          clientData.numero_telefono,
          clientData.email,
          direccionResult.rows[0].cod_direccion,
        ],
      );

      await client.query('COMMIT');

      return {
        success: true,
        data: {
          documento: result.rows[0].id_cliente,
          ...clientData,
          fecha_inscripcion: new Date().toISOString().split('T')[0],
          antiguedad: false,
        },
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error en createClient:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getAllClients(): Promise<Cliente[]> {
    const client = await pool.connect();

    try {
      const query = `SELECT * FROM vista_informacion_clientes`;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async searchClients(searchTerm: string): Promise<Cliente[]> {
    const client = await pool.connect();

    try {
      const query = `
        SELECT * FROM vista_informacion_clientes
        WHERE 
          nombre ILIKE $1 OR
          apellido ILIKE $1 OR
          rut ILIKE $1 OR
          correo ILIKE $1 OR
          telefono ILIKE $1 OR
          direccion ILIKE $1
      `;
      const result = await client.query(query, [`%${searchTerm}%`]);
      return result.rows;
    } catch (error) {
      console.error('Error al buscar clientes:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}
