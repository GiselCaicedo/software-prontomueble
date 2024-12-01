import { SalesService } from '@/services/sales';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const salesService = new SalesService();
    const clientes = await salesService.getClientes();
    return NextResponse.json(clientes);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    return NextResponse.json({ error: 'Error al obtener clientes' }, { status: 500 });
  }
}
