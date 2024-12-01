import { SalesService } from '@/services/sales';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const salesService = new SalesService();
    const sales = await salesService.getAllSales();
    return NextResponse.json(sales);
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    return NextResponse.json({ error: 'Error al obtener ventas' }, { status: 500 });
  }
}