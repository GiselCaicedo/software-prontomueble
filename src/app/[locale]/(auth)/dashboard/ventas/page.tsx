'use client';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface Cliente {
  Documento: number;  // Cambiar a mayúsculas
  Nombre: string;    // Cambiar a mayúsculas
  Apellido: string;  // Cambiar a mayúsculas
  "Número de Telefono": string;
  Dirección: string;
  Complemento: string;
  "Código Postal": number;
  Email: string;
}

interface Producto {
  id_mueble: number;
  nombre_mueble: string;
  precio_neto: number;
  stock: number;
}

interface SaleItem {
  id_mueble: number;
  cantidad: number;
  precio_unitario: number;
}

interface Sale {
  cod_venta: number;
  fecha_venta: string;
  cliente: {
    nombre: string;
    apellido: string;
    email: string;
  };
  vendedor: {
    nombre: string;
    apellido: string;
  };
  precio_total: number;
}

interface Stats {
  total_ventas: number;
  ingresos_totales: number;
  promedio_venta: number;
}

export default function SalesPage() {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [clienteId, setClienteId] = useState('');
  const [items, setItems] = useState<SaleItem[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [currentItem, setCurrentItem] = useState<SaleItem>({
    id_mueble: 0,
    cantidad: 1,
    precio_unitario: 0
  });

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setIsLoadingData(true);
        const [salesData, statsData, clientesData, productosData] = await Promise.all([
          fetch('/api/ventas/get').then(res => res.json()),
          fetch('/api/ventas/getSales').then(res => res.json()),
          fetch('/api/ventas/getClientes').then(res => res.json()),
          fetch('/api/ventas/getMuebles').then(res => res.json())
        ]);
        setSales(salesData);
        setStats(statsData);
        setClientes(clientesData);
        setProductos(productosData);
        console.log(clientesData)
      } catch (err) {
        setError('Error al cargar los datos');
        console.error('Error al cargar datos:', err);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadAllData();
  }, []);

  const addItem = () => {
    if (currentItem.id_mueble && currentItem.cantidad > 0) {
      const producto = productos.find(p => p.id_mueble === currentItem.id_mueble);
      if (!producto) {
        alert('Producto no encontrado');
        return;
      }
      if (producto.stock < currentItem.cantidad) {
        alert(`Stock insuficiente. Stock disponible: ${producto.stock}`);
        return;
      }
      setItems([...items, currentItem]);
      setCurrentItem({
        id_mueble: 0,
        cantidad: 1,
        precio_unitario: 0
      });
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.precio_unitario * item.cantidad), 0);
  };

  // Modifica el handleSubmit para incluir todos los datos necesarios
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (isLoading) return;

  setIsLoading(true);
  setError(null);

  try {
    const ventaData = {
      id_cliente: parseInt(clienteId),
      id_vendedor: 1, // Añade el ID del vendedor - ajusta según tu necesidad
      precio_total: calculateTotal(),
      items: items.map(({ id_mueble, cantidad }) => ({
        id_mueble,
        cantidad
      }))
    };

    console.log('Enviando datos:', ventaData); // Para debug

    const response = await fetch('/api/ventas/nuevo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ventaData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al crear la venta');
    }

    const data = await response.json();
    console.log('Respuesta:', data); // Para debug

    setShowModal(false);
    setItems([]);
    setClienteId('');
    setCurrentItem({
      id_mueble: 0,
      cantidad: 1,
      precio_unitario: 0
    });
    
    // Recargar datos
    const [newSalesData, newStatsData] = await Promise.all([
      fetch('/api/ventas/get').then(res => res.json()),
      fetch('/api/ventas/getSales').then(res => res.json())
    ]);
    
    setSales(newSalesData);
    setStats(newStatsData);
    
    alert('Venta creada exitosamente');
  } catch (error: any) {
    console.error('Error detallado:', error); // Para debug
    alert(error.message || 'Error al crear la venta');
  } finally {
    setIsLoading(false);
  }
};

  if (isLoadingData) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-600">Cargando datos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 font-medium">Error al cargar las ventas</div>
        <p className="text-gray-600 mt-2">Por favor, intenta de nuevo más tarde</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with statistics */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Ventas</h1>
          <Button 
            variant="default" 
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => setShowModal(true)}
          >
            Nueva Venta
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Ventas totales (30 días)</p>
            <p className="text-2xl font-semibold">{stats?.total_ventas}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Ingresos totales</p>
            <p className="text-2xl font-semibold">${Number(stats?.ingresos_totales).toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Promedio por venta</p>
            <p className="text-2xl font-semibold">${Number(stats?.promedio_venta).toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Sales table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Código</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Fecha</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Cliente</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Vendedor</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sales.map((sale) => (
              <tr key={sale.cod_venta} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-500">#{sale.cod_venta}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(sale.fecha_venta).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {sale.cliente.nombre} {sale.cliente.apellido}
                  <div className="text-gray-500 text-xs">{sale.cliente.email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {sale.vendedor.nombre} {sale.vendedor.apellido}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  ${Number(sale.precio_total).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Nueva Venta */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Nueva Venta</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cliente
                    </label>
                    <select
                      value={clienteId}
                      onChange={(e) => setClienteId(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Seleccionar cliente</option>
                      {clientes.map((cliente) => (
                        <option 
                          key={cliente.Documento} 
                          value={cliente.Documento} // Usar Documento como ID
                        >
                          {cliente.Nombre} {cliente.Apellido}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Productos
                    </label>
                    <div className="flex gap-4 mb-4">
                      <select
                        value={currentItem.id_mueble}
                        onChange={(e) => {
                          const producto = productos.find(p => p.id_mueble === parseInt(e.target.value));
                          setCurrentItem({
                            ...currentItem,
                            id_mueble: parseInt(e.target.value),
                            precio_unitario: producto?.precio_neto || 0
                          });
                        }}
                        className="flex-1 p-2 border border-gray-300 rounded-md"
                      >
                        <option value="0">Seleccionar producto</option>
                        {productos.map((producto) => (
                          <option 
                            key={producto.id_mueble} 
                            value={producto.id_mueble}
                            disabled={producto.stock <= 0}
                          >
                            {producto.nombre_mueble} - Stock: {producto.stock} - ${producto.precio_neto}
                          </option>
                        ))}
                      </select>
                      
                      <input
                        type="number"
                        min="1"
                        value={currentItem.cantidad}
                        onChange={(e) => setCurrentItem({
                          ...currentItem,
                          cantidad: parseInt(e.target.value)
                        })}
                        className="w-32 p-2 border border-gray-300 rounded-md"
                        placeholder="Cantidad"
                      />
                      
                      <Button 
                        type="button"
                        onClick={addItem}
                        variant="outline"
                      >
                        Agregar
                      </Button>
                    </div>

                    {items.length > 0 && (
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2">Producto</th>
                            <th className="text-left py-2">Cantidad</th>
                            <th className="text-left py-2">Precio</th>
                            <th className="text-left py-2">Subtotal</th>
                            <th className="py-2"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, index) => {
                            const producto = productos.find(p => p.id_mueble === item.id_mueble);
                            return (
                              <tr key={index} className="border-b border-gray-200">
                                <td className="py-2">{producto?.nombre_mueble || `Producto ${item.id_mueble}`}</td>
                                <td className="py-2">{item.cantidad}</td>
                                <td className="py-2">${item.precio_unitario}</td>
                                <td className="py-2">${item.precio_unitario * item.cantidad}</td>
                                <td className="py-2">
                                  <button
                                    type="button"
                                    onClick={() => removeItem(index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    Eliminar
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                          <tr className="font-bold">
                            <td colSpan={3} className="py-2 text-right">Total:</td>
                            <td className="py-2">${calculateTotal()}</td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowModal(false);
                      setItems([]);
                      setClienteId('');
                      setCurrentItem({
                        id_mueble: 0,
                        cantidad: 1,
                        precio_unitario: 0
                      });
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || items.length === 0 || !clienteId}
                    variant="default"
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {isLoading ? 'Guardando...' : 'Guardar Venta'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          Mostrando {sales.length} ventas
        </span>
        <div className="flex gap-4">
          <Button 
            variant="outline"
            className="bg-red-50 hover:bg-red-100 border-red-200"
            disabled
          >
            Anterior
          </Button>
          <Button 
            variant="outline"
            className="bg-red-50 hover:bg-red-100 border-red-200"
            disabled
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}