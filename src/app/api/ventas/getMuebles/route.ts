import { SalesService } from '@/services/sales';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const salesService = new SalesService();
    const muebles = await salesService.getMuebles();
    return NextResponse.json(muebles);
  } catch (error) {
    console.error('Error al obtener muebles:', error);
    return NextResponse.json({ error: 'Error al obtener muebles' }, { status: 500 });
  }
}