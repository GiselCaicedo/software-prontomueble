import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  
  ssl: { rejectUnauthorized: false }, 
});


type Provider = {
  'Nombre Proveedor': string;
  'Dirección': string;
  'complemento': string;
  'Código Postal': number;
  'Nombre Contacto': string;
  'Apellido Contacto': string;
  'Telefono de Contacto': string;
  'Email de Contacto': string;
  'Tipo de Mueble proporcionado': string;
};

type NewProviderData = {
  nombreEmpresa: string;
  direccionPrincipal: string;
  direccionComplemento: string;
  codigoPostal: number;
  contactoNombre: string;
  contactoApellido: string;
  contactoTelefono: string;
  contactoEmail: string;
  idMuebles: number[];
};
export class ProvidersService {
  async createProvider(data: NewProviderData) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const directionResult = await client.query(
        `
        INSERT INTO direccion (principal, complemento, codigo_postal)
        VALUES ($1, $2, $3)
        RETURNING cod_direccion
        `,
        [data.direccionPrincipal, data.direccionComplemento, data.codigoPostal], // Coma añadida aquí
      );

      const codDireccion = directionResult.rows[0].cod_direccion;

      const contactResult = await client.query(
        `
        INSERT INTO contacto_proveedor (nombre, apellido, num_telefono, cod_direccion, email)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id_contacto_proveedor
        `,
        [
          data.contactoNombre,
          data.contactoApellido,
          data.contactoTelefono,
          codDireccion,
          data.contactoEmail, // Coma añadida aquí
        ],
      );

      const idContactoProveedor = contactResult.rows[0].id_contacto_proveedor;

      const providerResult = await client.query(
        `
        INSERT INTO empresa_proveedor (nombre_ep, cod_direccion, id_contacto_proveedor)
        VALUES ($1, $2, $3)
        RETURNING id_empresa_proveedor
        `,
        [data.nombreEmpresa, codDireccion, idContactoProveedor], // Coma añadida aquí
      );

      const idEmpresa = providerResult.rows[0].id_empresa_proveedor;

      for (const idMueble of data.idMuebles) {
        await client.query(
          `
          INSERT INTO muebles_empresa (id_empresa, id_mueble)
          VALUES ($1, $2)
          `,
          [idEmpresa, idMueble], // Coma añadida aquí
        );
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getAllProviders(): Promise<Provider[]> {
    const client = await pool.connect();

    try {
      const query = 'SELECT * FROM vista_informacion_proveedores';
      const result = await client.query(query);

      return result.rows;
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async searchProviders(searchTerm: string): Promise<Provider[]> {
    const client = await pool.connect();

    try {
      const query = `
        SELECT * FROM vista_informacion_proveedores
        WHERE 
          "Nombre Proveedor" ILIKE $1 OR
          "Nombre Contacto" ILIKE $1 OR
          "Apellido Contacto" ILIKE $1 OR
          "Email de Contacto" ILIKE $1 OR
          "Tipo de Mueble proporcionado" ILIKE $1
      `;

      const result = await client.query(query, [`%${searchTerm}%`]);

      return result.rows;
    } catch (error) {
      console.error('Error al buscar proveedores:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}
