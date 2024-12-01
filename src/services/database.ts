import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  
  ssl: { rejectUnauthorized: false }, 
});

// Interface actualizada para coincidir con la vista
type InventoryItem = {
  Cód: string;
  Tipo: string;
  Nombre: string;
  Materiales: string;
  Color: string;
  Alto: number;
  Ancho: number;
  Profundidad: number;
  Precio: number;
  Stock: number;
  Cod: number;
};

type CreateProductData = {
  nombre_mueble: string;
  alto: number;
  ancho: number;
  profundidad: number;
  diagonal: number;
  precio_neto: number;
  id_material: number;
  id_color: number;
  id_tipo_mueble: number;
  stock: number;
};

export class InventoryService {
  async getAllInventory(): Promise<InventoryItem[]> {
    const client = await pool.connect();
    try {
      const query = 'SELECT * FROM vista_informacion_muebles';
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error al obtener inventario:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async searchInventory(searchTerm: string): Promise<InventoryItem[]> {
    const client = await pool.connect();
    try {
      const query = `
        SELECT * FROM vista_informacion_muebles
        WHERE 
          "Tipo" ILIKE $1 OR
          "Nombre" ILIKE $1 OR
          "Materiales" ILIKE $1 OR
          "Color" ILIKE $1
      `;
      const result = await client.query(query, [`%${searchTerm}%`]);
      return result.rows;
    } catch (error) {
      console.error('Error al buscar en inventario:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async updateStock(muebleId: number, newStock: number): Promise<void> {
    const client = await pool.connect();
    try {
      const query = `
        UPDATE inventario
        SET stock = $2
        WHERE cod_mueble_stock = $1
      `;
      await client.query(query, [muebleId, newStock]);
    } catch (error) {
      console.error('Error al actualizar stock:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getProductDetails(muebleId: number): Promise<InventoryItem | null> {
    const client = await pool.connect();
    try {
      const query = `
        SELECT * FROM vista_informacion_muebles
        WHERE "Cód" = $1
      `;
      const result = await client.query(query, [muebleId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error al obtener detalles del producto:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getInventoryStats() {
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          COUNT(DISTINCT "Cód") AS total_productos,
          SUM("Stock") AS total_stock,
          AVG("Precio") AS precio_promedio
        FROM vista_informacion_muebles
      `;
      const result = await client.query(query);
      return {
        total_productos: Number.parseInt(result.rows[0].total_productos, 10),
        total_stock: Number.parseInt(result.rows[0].total_stock, 10),
        precio_promedio: Number.parseFloat(result.rows[0].precio_promedio),
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getMateriales() {
    const client = await pool.connect();
    try {
      const query = `
        SELECT id_material, nombre_material 
        FROM material 
        ORDER BY nombre_material ASC
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error en getMateriales:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getColores() {
    const client = await pool.connect();
    try {
      const query = `
        SELECT id_color, nombre_color 
        FROM color 
        ORDER BY nombre_color ASC
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error en getColores:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getTiposMueble() {
    const client = await pool.connect();
    try {
      const query = `
        SELECT id_tipo_mueble, tipo_mueble, imagen
        FROM tipo_mueble 
        ORDER BY tipo_mueble ASC
      `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error en getTiposMueble:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async createProduct(data: CreateProductData): Promise<number> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const insertMuebleQuery = `
        INSERT INTO mueble (
          nombre_mueble,
          alto,
          ancho,
          profundidad,
          diagonal,
          precio_neto,
          id_tipo_mueble
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id_mueble
      `;

      const muebleValues = [
        data.nombre_mueble,
        data.alto,
        data.ancho,
        data.profundidad,
        data.diagonal,
        data.precio_neto,
        data.id_tipo_mueble,
      ];

      const muebleResult = await client.query(insertMuebleQuery, muebleValues);
      const muebleId = muebleResult.rows[0].id_mueble;

      const insertDetallesQuery = `
        INSERT INTO detalles_mueble (
          id_mueble,
          id_material,
          id_color
        ) VALUES ($1, $2, $3)
      `;
      await client.query(insertDetallesQuery, [muebleId, data.id_material, data.id_color]);

      const insertInventarioQuery = `
        INSERT INTO inventario (
          cod_mueble_stock,
          stock
        ) VALUES ($1, $2)
      `;
      await client.query(insertInventarioQuery, [muebleId, data.stock]);
      await client.query('COMMIT');

      return muebleId;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error en createProduct:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}
