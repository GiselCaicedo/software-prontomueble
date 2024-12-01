import { NextResponse } from 'next/server';
import { InventoryService } from '@/services/database';

export async function GET() {
  try {
    const inventoryService = new InventoryService();
    const materiales = await inventoryService.getMateriales();
    return NextResponse.json(materiales);
  } catch (error) {
    console.error('Error fetching materiales:', error);
    return NextResponse.json(
      { error: 'Error al obtener materiales' }, 
      { status: 500 }
    );
  }
}