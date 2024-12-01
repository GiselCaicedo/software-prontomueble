import { NextResponse } from 'next/server';
import { InventoryService } from '@/services/database';

export async function GET() {
  try {
    const inventoryService = new InventoryService();
    const tipos = await inventoryService.getTiposMueble();
    return NextResponse.json(tipos);
  } catch (error) {
    console.error('Error fetching tipos de mueble:', error);
    return NextResponse.json(
      { error: 'Error al obtener tipos de mueble' }, 
      { status: 500 }
    );
  }
}