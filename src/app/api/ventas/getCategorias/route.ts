import { SalesService } from '@/services/sales';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const salesService = new SalesService();
    const categorias = await salesService.getCategorias();
    return NextResponse.json(categorias);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return NextResponse.json({ error: 'Error al obtener categorías' }, { status: 500 });
  }
}