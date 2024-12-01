// src/app/api/ventas/nuevo/route.ts
import { NextResponse } from 'next/server';
import { SalesService } from '@/services/sales';

const salesService = new SalesService();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validar datos requeridos
    if (!data.id_cliente || !data.items || !data.items.length) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      );
    }

    // Si no se proporciona id_vendedor, usar un valor por defecto (ajusta según tu necesidad)
    if (!data.id_vendedor) {
      data.id_vendedor = 1; // O el ID que corresponda
    }

    const result = await salesService.crearVenta(data);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error al crear venta:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear la venta' },
      { status: 500 }
    );
  }
}