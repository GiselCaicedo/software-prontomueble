// app/api/inventory.ts
import { NextResponse } from 'next/server';
import { InventoryService } from '@/services/database';

export async function GET() {
  try {
    const inventoryService = new InventoryService();
    const [items, materials, colors, furnitureTypes] = await Promise.all([
      inventoryService.getAllInventory(),
      inventoryService.getMateriales(),
      inventoryService.getColores(),
      inventoryService.getTiposMueble()
    ]);

    return NextResponse.json({
      inventoryItems: items,
      materials,
      colors,
      furnitureTypes
    });
  } catch (error) {
    console.error('Error fetching inventory data:', error);
    return NextResponse.json(
      { error: 'Error fetching inventory data' },
      { status: 500 }
    );
  }
}