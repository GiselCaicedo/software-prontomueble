import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  
  ssl: { rejectUnauthorized: false }, 
});

type SaleStats = {
  total_ventas: number;
  ingresos_totales: number;
  promedio_venta: number;
  productos_vendidos: number;
};

type TopProduct = {
  nombre_mueble: string;
  cantidad_vendida: number;
  ingresos_totales: number;
};

type TopSeller = {
  nombre: string;
  apellido: string;
  ventas_totales: number;
  monto_total: number;
};

type MonthlySales = {
  mes: string;
  total_ventas: number;
  ingresos: number;
};


export class ReportsService {

  async getGeneralStats(): Promise<SaleStats> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT 
          COUNT(DISTINCT v.cod_venta) AS total_ventas,
          SUM(v.precio_total) AS ingresos_totales,
          AVG(v.precio_total) AS promedio_venta,
          SUM(dv.cantidad) AS productos_vendidos
        FROM venta v
        JOIN detalle_venta dv ON v.cod_venta = dv.id_venta
        WHERE v.fecha_venta >= CURRENT_DATE - INTERVAL '30 days'
      `);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async getTopProducts(limit: number = 5): Promise<TopProduct[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `
        SELECT 
          m.nombre_mueble,
          SUM(dv.cantidad) AS cantidad_vendida,
          SUM(dv.cantidad * m.precio_neto) AS ingresos_totales
        FROM detalle_venta dv
        JOIN mueble m ON dv.id_mueble = m.id_mueble
        GROUP BY m.id_mueble, m.nombre_mueble
        ORDER BY cantidad_vendida DESC
        LIMIT $1
        `,
        [limit],
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  async getTopSellers(limit: number = 5): Promise<TopSeller[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `
        SELECT 
          vp.nombre,
          vp.apellido,
          COUNT(v.cod_venta) AS ventas_totales,
          SUM(v.precio_total) AS monto_total
        FROM vendedor_pm vp
        JOIN venta v ON vp.id_vendedor = v.id_vendedor
        GROUP BY vp.id_vendedor, vp.nombre, vp.apellido
        ORDER BY ventas_totales DESC
        LIMIT $1
        `,
        [limit],
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  async getMonthlySales(): Promise<MonthlySales[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT 
          TO_CHAR(fecha_venta, 'YYYY-MM') AS mes,
          COUNT(*) AS total_ventas,
          SUM(precio_total) AS ingresos
        FROM venta
        WHERE fecha_venta >= CURRENT_DATE - INTERVAL '12 months'
        GROUP BY mes
        ORDER BY mes DESC
      `);
      return result.rows;
    } finally {
      client.release();
    }
  }
}
