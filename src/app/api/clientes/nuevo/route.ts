import { NextResponse } from 'next/server';
import { ClientsService } from '@/services/clientes';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validación básica de los campos requeridos
    const requiredFields = ['documento', 'nombre', 'apellido', 'numero_telefono', 'direccion', 'complemento', 'codigo_postal', 'email'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { 
            success: false,
            error: `El campo ${field} es requerido` 
          },
          { status: 400 }
        );
      }
    }

    const clientsService = new ClientsService();
    const newClient = await clientsService.createClient(body);
    
    return NextResponse.json({
      success: true,
      data: newClient
    });
    
  } catch (error) {
    console.error('Error al crear cliente:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}