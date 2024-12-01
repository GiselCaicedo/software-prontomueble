import { ProvidersService } from '@/services/providers';
import { FurnitureService } from '@/services/furniture';
import { Button } from "@/components/ui/button";
import { ProviderForm } from '@/components/forms/ProviderForm';

export default async function ProvidersPage() {
  const providersService = new ProvidersService();
  const furnitureService = new FurnitureService();

  async function handleCreateProvider(formData: FormData) {
    'use server';
    const providersService = new ProvidersService();
    
    const data = {
      nombreEmpresa: formData.get('nombreEmpresa') as string,
      direccionPrincipal: formData.get('direccionPrincipal') as string,
      direccionComplemento: formData.get('direccionComplemento') as string,
      codigoPostal: parseInt(formData.get('codigoPostal') as string),
      contactoNombre: formData.get('contactoNombre') as string,
      contactoApellido: formData.get('contactoApellido') as string,
      contactoTelefono: formData.get('contactoTelefono') as string,
      contactoEmail: formData.get('contactoEmail') as string,
      idMuebles: JSON.parse(formData.get('idMuebles') as string)
    };
    
    await providersService.createProvider(data);
  }

  try {
    // Obtener los datos de los proveedores y muebles
    const [providers, furniture] = await Promise.all([
      providersService.getAllProviders(),
      furnitureService.getAllFurniture()
    ]);

    return (
      <div className="p-6 space-y-6">
        {/* Encabezado */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Inventario de Proveedores
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Total de proveedores: {providers.length}
            </p>
          </div>
          <ProviderForm onSubmit={handleCreateProvider} initialFurniture={furniture} />
        </div>

        {/* Barra de búsqueda */}
      

        {/* Tabla de proveedores */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-purple-50">
                  {[
                    'Nombre empresa',
                    'Dirección',
                    'Contacto',
                    'Teléfono',
                    'Email',
                    'Tipo de Mueble'
                  ].map((header) => (
                    <th 
                      key={header}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b border-r border-purple-100 first:rounded-tl-lg last:rounded-tr-lg"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {providers.length > 0 ? (
                  providers.map((provider, index) => (
                    <tr 
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 border-b border-r border-gray-100">
                        {provider["Nombre Proveedor"]}
                      </td>
                      <td className="px-6 py-4 border-b border-r border-gray-100">
                        {provider["Dirección"]}, {provider["complemento"]}
                        <br />
                        <span className="text-gray-500 text-sm">
                          CP: {provider["Código Postal"]}
                        </span>
                      </td>
                      <td className="px-6 py-4 border-b border-r border-gray-100">
                        {provider["Nombre Contacto"]} {provider["Apellido Contacto"]}
                      </td>
                      <td className="px-6 py-4 border-b border-r border-gray-100">
                        {provider["Telefono de Contacto"]}
                      </td>
                      <td className="px-6 py-4 border-b border-r border-gray-100">
                        {provider["Email de Contacto"]}
                      </td>
                      <td className="px-6 py-4 border-b border-r border-gray-100">
                        {provider["Tipo de Mueble proporcionado"]}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td 
                      colSpan={6} 
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No hay proveedores registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paginación */}
        <div className="flex justify-between items-center pt-4">
          <span className="text-sm text-gray-600">
            Mostrando {providers.length > 0 ? `1-${providers.length}` : '0'} de {providers.length} proveedores
          </span>
          <div className="flex gap-2">
            <Button variant="outline" disabled>
              Anterior
            </Button>
            <Button variant="outline" disabled>
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error al cargar datos:', error);
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 font-medium">Error al cargar los datos</div>
        <p className="text-gray-600 mt-2">Por favor, intenta de nuevo más tarde</p>
      </div>
    );
  }
}