import { NextResponse } from 'next/server';
import { ClientsService } from '@/services/clientes';

export async function GET() {
  try {
    const clientsService = new ClientsService();
    const clients = await clientsService.getAllClients();
    
    return NextResponse.json({
      success: true,
      data: clients
    });
  } catch (error) {
    console.error('Error en la ruta API de clientes:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener los clientes'
      },
      { status: 500 }
    );
  }
}