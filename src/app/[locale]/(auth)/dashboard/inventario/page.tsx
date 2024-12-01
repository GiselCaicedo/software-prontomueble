import { InventoryService } from '@/services/database';
import { Button } from "@/components/ui/button";
import NewProductForm from '@/components/forms/NewProductForm';

export default async function InventoryPage() {
  const inventoryService = new InventoryService();
  
  try {
    const [inventoryItems, stats, materiales, colores, tiposMueble] = await Promise.all([
      inventoryService.getAllInventory(),
      inventoryService.getInventoryStats(),
      inventoryService.getMateriales(),
      inventoryService.getColores(),
      inventoryService.getTiposMueble()
    ]);

    return (
      <div className="p-6 space-y-6">
        {/* Header section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Inventario de Productos
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Total de productos: {stats.total_productos} | Valor promedio: ${Number(stats.precio_promedio).toFixed(2)}
            </p>
          </div>
          <NewProductForm 
            materiales={materiales}
            colores={colores}
            tiposMueble={tiposMueble}
          />
        </div>

        {/* Search and filters */}
    

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-pink-50">
                  {[
                    'Tipo', 
                    'Nombre',
                    'Materiales', 
                    'Color', 
                    'Alto', 
                    'Ancho', 
                    'Profundidad', 
                    'Precio', 
                    'Stock'
                  ].map((header) => (
                    <th 
                      key={header}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b border-r border-pink-100 first:rounded-tl-lg last:rounded-tr-lg"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inventoryItems.length > 0 ? (
                  inventoryItems.map((item, index) => (
                    <tr 
                      key={item["Cód"] || index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 border-b border-r border-gray-100">{item["Tipo"]}</td>
                      <td className="px-6 py-4 border-b border-r border-gray-100">{item["Nombre"]}</td>
                      <td className="px-6 py-4 border-b border-r border-gray-100">{item["Materiales"]}</td>
                      <td className="px-6 py-4 border-b border-r border-gray-100">{item["Color"]}</td>
                      <td className="px-6 py-4 border-b border-r border-gray-100">{item["Alto"]}</td>
                      <td className="px-6 py-4 border-b border-r border-gray-100">{item["Ancho"]}</td>
                      <td className="px-6 py-4 border-b border-r border-gray-100">{item["Profundidad"]}</td>
                      <td className="px-6 py-4 border-b border-r border-gray-100">
                        ${Number(item["Precio"]).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 border-b border-r border-gray-100">{item["Stock"]}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td 
                      colSpan={9} 
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No hay productos en el inventario
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center pt-4">
          <span className="text-sm text-gray-600">
            Mostrando {inventoryItems.length > 0 ? `1-${inventoryItems.length}` : '0'} de {inventoryItems.length} productos
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
    console.error('Error al cargar el inventario:', error);
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 font-medium">Error al cargar el inventario</div>
        <p className="text-gray-600 mt-2">Por favor, intenta de nuevo más tarde</p>
      </div>
    );
  }
}