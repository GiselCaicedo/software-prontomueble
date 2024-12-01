import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  
  ssl: { rejectUnauthorized: false }, 
});

type SaleDetail = {
  cantidad: number;
  precio_unitario: number;
  nombre_mueble: string;
};

type Sale = {
  cod_venta: number;
  fecha_venta: Date;
  precio_total: number;
  vendedor: {
    nombre: string;
    apellido: string;
  };
  cliente: {
    nombre: string;
    apellido: string;
    email: string;
  };
  detalles: SaleDetail[];
};

type CreateSaleData = {
  id_cliente: number;
  id_vendedor: number;
  precio_total: number;
  items: {
    id_mueble: number;
    cantidad: number;
  }[];
};

export class SalesService {
  async crearVenta(data: CreateSaleData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insertar la venta
      const ventaQuery = `
        INSERT INTO venta (
          fecha_venta,
          id_vendedor,
          id_cliente,
          precio_total
        ) VALUES (
          CURRENT_TIMESTAMP,
          $1,
          $2,
          $3
        ) RETURNING cod_venta
      `;
      const ventaResult = await client.query(ventaQuery, [
        data.id_vendedor,
        data.id_cliente,
        data.precio_total,
      ]);
      const cod_venta = ventaResult.rows[0].cod_venta;

      // Insertar los detalles de la venta y actualizar el inventario
      for (const item of data.items) {
        const stockQuery = `
          SELECT stock 
          FROM inventario 
          WHERE cod_mueble_stock = $1
        `;
        const stockResult = await client.query(stockQuery, [item.id_mueble]);
        if (stockResult.rows.length === 0 || stockResult.rows[0].stock < item.cantidad) {
          throw new Error(`Stock insuficiente para el mueble ${item.id_mueble}`);
        }

        // Insertar detalle de la venta
        await client.query(
          `
          INSERT INTO detalle_venta (
            id_venta,
            id_mueble,
            cantidad
          ) VALUES ($1, $2, $3)
          `,
          [cod_venta, item.id_mueble, item.cantidad],
        );

        // Actualizar inventario
        await client.query(
          `
          UPDATE inventario 
          SET stock = stock - $1 
          WHERE cod_mueble_stock = $2
          `,
          [item.cantidad, item.id_mueble],
        );
      }

      await client.query('COMMIT');
      return { success: true, cod_venta, ...data };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error en la transacción:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getAllSales(): Promise<Sale[]> {
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          v.cod_venta,
          v.fecha_venta,
          v.precio_total,
          vp.nombre AS vendedor_nombre,
          vp.apellido AS vendedor_apellido,
          c.nombre AS cliente_nombre,
          c.apellido AS cliente_apellido,
          c.email AS cliente_email
        FROM venta v
        JOIN vendedor_pm vp ON v.id_vendedor = vp.id_vendedor
        JOIN cliente c ON v.id_cliente = c.id_cliente
        ORDER BY v.fecha_venta DESC
      `;
      const result = await client.query(query);

      return await Promise.all(
        result.rows.map(async (row) => {
          const detallesQuery = `
            SELECT 
              dv.cantidad,
              m.precio_neto AS precio_unitario,
              m.nombre_mueble
            FROM detalle_venta dv
            JOIN mueble m ON dv.id_mueble = m.id_mueble
            WHERE dv.id_venta = $1
          `;
          const detallesResult = await client.query(detallesQuery, [row.cod_venta]);

          return {
            cod_venta: row.cod_venta,
            fecha_venta: row.fecha_venta,
            precio_total: row.precio_total,
            vendedor: {
              nombre: row.vendedor_nombre,
              apellido: row.vendedor_apellido,
            },
            cliente: {
              nombre: row.cliente_nombre,
              apellido: row.cliente_apellido,
              email: row.cliente_email,
            },
            detalles: detallesResult.rows,
          };
        }),
      );
    } catch (error) {
      console.error('Error al obtener ventas:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getSalesStats() {
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          COUNT(*) AS total_ventas,
          SUM(precio_total) AS ingresos_totales,
          AVG(precio_total) AS promedio_venta
        FROM venta
        WHERE fecha_venta >= CURRENT_DATE - INTERVAL '30 days'
      `;
      const result = await client.query(query);
      return result.rows[0];
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getCategorias() {
    const client = await pool.connect();
    try {
      const query = `SELECT * FROM tipo_mueble`;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getClientes() {
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

  async getMuebles() {
    const client = await pool.connect();
    try {
      const query = `SELECT * FROM mueble`;
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
