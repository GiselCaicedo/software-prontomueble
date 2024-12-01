import { SalesService } from '@/services/sales';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const salesService = new SalesService();
    const stats = await salesService.getSalesStats();
    return NextResponse.json({
      total_ventas: parseInt(stats.total_ventas),
      ingresos_totales: parseFloat(stats.ingresos_totales),
      promedio_venta: parseFloat(stats.promedio_venta)
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 });
  }
}