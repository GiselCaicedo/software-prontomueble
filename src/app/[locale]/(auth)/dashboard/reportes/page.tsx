// src/app/[locale]/(auth)/dashboard/reportes/page.tsx
import { ReportsService } from '@/services/reportes';
import { Card } from "@/components/ui/card";

export default async function ReportsPage() {
  const reportsService = new ReportsService();
  
  try {
    const [generalStats, topProducts, topSellers, monthlySales] = await Promise.all([
      reportsService.getGeneralStats(),
      reportsService.getTopProducts(),
      reportsService.getTopSellers(),
      reportsService.getMonthlySales()
    ]);

    return (
      <div className="p-6 space-y-8">
        {/* Summary Section */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Reportes y Estadísticas
          </h1>
          <p className="text-gray-600 mt-1">
            Resumen de rendimiento del último mes
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-pink-50 to-white">
            <h3 className="text-sm font-medium text-gray-600">Ventas del Mes</h3>
            <p className="text-3xl font-bold mt-2 text-pink-600">
              {generalStats.total_ventas}
            </p>
            <p className="text-sm text-gray-500 mt-1">transacciones</p>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-white">
            <h3 className="text-sm font-medium text-gray-600">Ingresos Totales</h3>
            <p className="text-3xl font-bold mt-2 text-purple-600">
              ${Number(generalStats.ingresos_totales).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">últimos 30 días</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-white">
            <h3 className="text-sm font-medium text-gray-600">Promedio por Venta</h3>
            <p className="text-3xl font-bold mt-2 text-blue-600">
              ${Number(generalStats.promedio_venta).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">por transacción</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-white">
            <h3 className="text-sm font-medium text-gray-600">Productos Vendidos</h3>
            <p className="text-3xl font-bold mt-2 text-green-600">
              {generalStats.productos_vendidos}
            </p>
            <p className="text-sm text-gray-500 mt-1">unidades</p>
          </Card>
        </div>

        {/* Performance Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products Table */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Productos Más Vendidos</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Producto</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600">Unidades</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600">Ingresos</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{product.nombre_mueble}</td>
                      <td className="py-3 px-4 text-right text-gray-600">
                        {product.cantidad_vendida}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-green-600">
                        ${Number(product.ingresos_totales).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Top Sellers Cards */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Vendedores Destacados</h2>
            <div className="space-y-3">
              {topSellers.map((seller, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-100"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {seller.nombre} {seller.apellido}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {seller.ventas_totales} ventas realizadas
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        ${Number(seller.monto_total).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Monthly Performance Table */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Rendimiento Mensual</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Mes</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">Ventas</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">Ingresos</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">Promedio</th>
                </tr>
              </thead>
              <tbody>
                {monthlySales.map((month, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{month.mes}</td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {month.total_ventas}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-green-600">
                      ${Number(month.ingresos).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      ${Number(month.ingresos / month.total_ventas).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  } catch (error) {
    console.error('Error al cargar reportes:', error);
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 font-medium">
          Error al cargar los reportes
        </div>
        <p className="text-gray-600 mt-2">
          Por favor, intenta de nuevo más tarde
        </p>
      </div>
    );
  }
}