import { NextResponse } from 'next/server';
import { InventoryService } from '@/services/database';

export async function POST(request: Request) {
  console.log('🟢 API endpoint hit: POST /api/productos/nuevo');
  
  try {
    const data = await request.json();
    console.log('📦 Received data:', JSON.stringify(data, null, 2));
    
    // Validate data types
    const validationErrors = [];
    
    if (typeof data.nombre_mueble !== 'string' || !data.nombre_mueble.trim()) {
      validationErrors.push('Nombre de mueble inválido');
    }
    
    ['alto', 'ancho', 'profundidad', 'diagonal', 'precio_neto'].forEach(field => {
      if (typeof data[field] !== 'number' || data[field] <= 0) {
        validationErrors.push(`${field} debe ser un número mayor a 0`);
      }
    });
    
    ['id_material', 'id_color', 'id_tipo_mueble'].forEach(field => {
      if (!Number.isInteger(data[field]) || data[field] <= 0) {
        validationErrors.push(`${field} debe ser un número entero válido`);
      }
    });

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Errores de validación', 
          errors: validationErrors 
        },
        { status: 400 }
      );
    }

    const inventoryService = new InventoryService();
    const newProductId = await inventoryService.createProduct(data);
    
    return NextResponse.json({ 
      success: true, 
      productId: newProductId,
      message: 'Producto creado exitosamente'
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('❌ Error detallado:', {
      message: error.message,
      stack: error.stack,
      code: error.code, // PostgreSQL error code if available
      detail: error.detail // PostgreSQL error detail if available
    });
    
    // Handle specific database errors
    if (error.code === '23505') {
      return NextResponse.json(
        { success: false, message: 'El producto ya existe' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al crear el producto',
        detail: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}