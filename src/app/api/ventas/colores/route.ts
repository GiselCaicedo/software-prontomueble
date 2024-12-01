import { NextResponse } from 'next/server';
import { InventoryService } from '@/services/database';

export async function GET() {
  try {
    const inventoryService = new InventoryService();
    const colores = await inventoryService.getColores();
    return NextResponse.json(colores);
  } catch (error) {
    console.error('Error fetching colores:', error);
    return NextResponse.json(
      { error: 'Error al obtener colores' }, 
      { status: 500 }
    );
  }
}
