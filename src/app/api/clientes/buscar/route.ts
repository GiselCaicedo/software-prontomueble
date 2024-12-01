import { NextResponse } from 'next/server';
import { ClientsService } from '@/services/clientes';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get('term');

    if (!term) {
      return NextResponse.json(
        { error: 'Término de búsqueda requerido' },
        { status: 400 }
      );
    }

    const clientsService = new ClientsService();
    const clients = await clientsService.searchClients(term);
    return NextResponse.json(clients);

  } catch (error) {
    console.error('Error al buscar clientes:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
