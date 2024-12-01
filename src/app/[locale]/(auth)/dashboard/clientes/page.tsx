'use client'

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface Cliente {
  Documento: number;
  Nombre: string;
  Apellido: string;
  'Número de Telefono': string;
  Dirección: string;
  Complemento: string;
  'Código Postal': number;
  Email: string;
}

interface ApiResponse {
  success: boolean;
  data?: Cliente[];
  error?: string;
}

const initialFormData = {
  documento: 0,
  nombre: '',
  apellido: '',
  numero_telefono: '',
  direccion: '',
  complemento: '',
  codigo_postal: 0,
  email: ''
};

const ClientesPage = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newClient, setNewClient] = useState(initialFormData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchClientes = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/clientes/get', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Error desconocido al cargar los clientes');
      }

      setClientes(data.data || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar los clientes';
      setError(`Error: ${errorMessage}. Por favor, intente nuevamente.`);
      console.error('Error en fetchClientes:', error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClient(prev => ({
      ...prev,
      [name]: ['documento', 'codigo_postal'].includes(name) ? parseInt(value) || 0 : value
    }));
  };

  const validateForm = () => {
    if (!newClient.documento || newClient.documento <= 0) {
      toast.error('El documento debe ser un número válido');
      return false;
    }
    if (!newClient.nombre.trim()) {
      toast.error('El nombre es requerido');
      return false;
    }
    if (!newClient.apellido.trim()) {
      toast.error('El apellido es requerido');
      return false;
    }
    if (!newClient.email.includes('@')) {
      toast.error('El email debe ser válido');
      return false;
    }
    if (newClient.numero_telefono.length < 8) {
      toast.error('El número de teléfono debe tener al menos 8 dígitos');
      return false;
    }
    if (!newClient.direccion.trim()) {
      toast.error('La dirección es requerida');
      return false;
    }
    if (!newClient.codigo_postal || newClient.codigo_postal <= 0) {
      toast.error('El código postal debe ser un número válido');
      return false;
    }
    return true;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validateForm()) return;
  
    setIsSubmitting(true);
    setError(null);
  
    try {
      const response = await fetch('/api/clientes/nuevo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(newClient),
      });
  
      const data = await response.json();
  
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al crear el cliente');
      }
  
      await fetchClientes();
      setShowModal(false);
      setNewClient(initialFormData);
      toast.success('Cliente creado exitosamente');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(`Error al crear el cliente: ${errorMessage}`);
      console.error('Error en handleSubmit:', error);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchClientes();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/clientes/buscar?term=${encodeURIComponent(searchTerm)}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error en la búsqueda');
      }

      const data: ApiResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Error en la búsqueda');
      }

      setClientes(data.data || []);
      setCurrentPage(1);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(`Error en la búsqueda: ${errorMessage}`);
      console.error('Error en handleSearch:', error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(clientes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClientes = clientes.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Gestión de Clientes
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Total de clientes: {clientes.length}
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Buscar clientes..."
              className="w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              🔍
            </button>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
          >
            Agregar Cliente
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Agregar Nuevo Cliente</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Documento
                  </label>
                  <input
                    type="number"
                    name="documento"
                    value={newClient.documento}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={newClient.nombre}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={newClient.apellido}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    name="numero_telefono"
                    value={newClient.numero_telefono}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código Postal
                  </label>
                  <input
                    type="number"
                    name="codigo_postal"
                    value={newClient.codigo_postal}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={newClient.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={newClient.direccion}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Complemento
                  </label>
                  <input
                    type="text"
                    name="complemento"
                    value={newClient.complemento}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clients Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-purple-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b border-r border-purple-100 first:rounded-tl-lg">Documento</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b border-r border-purple-100">Nombre</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b border-r border-purple-100">Apellido</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b border-r border-purple-100">Teléfono</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b border-r border-purple-100">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b border-r border-purple-100">Dirección</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b border-r border-purple-100">Complemento</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b border-purple-100 last:rounded-tr-lg">Código Postal</th>
              </tr>
            </thead>
            <tbody>
              {currentClientes.length > 0 ? (
                currentClientes.map((cliente) => (
                  <tr key={cliente.Documento}>
                  <td className="px-6 py-4 border-b border-r border-gray-100">{cliente.Documento}</td>
                  <td className="px-6 py-4 border-b border-r border-gray-100">{cliente.Nombre}</td>
                  <td className="px-6 py-4 border-b border-r border-gray-100">{cliente.Apellido}</td>
                  <td className="px-6 py-4 border-b border-r border-gray-100">{cliente['Número de Telefono']}</td>
                  <td className="px-6 py-4 border-b border-r border-gray-100">{cliente.Email}</td>
                  <td className="px-6 py-4 border-b border-r border-gray-100">{cliente.Dirección}</td>
                  <td className="px-6 py-4 border-b border-r border-gray-100">{cliente.Complemento}</td>
                  <td className="px-6 py-4 border-b border-gray-100">{cliente['Código Postal']}</td>
                </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? 'No se encontraron resultados' : 'No hay clientes registrados'}
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
          Mostrando {currentClientes.length > 0 ? `${startIndex + 1}-${Math.min(endIndex, clientes.length)}` : '0'} de {clientes.length} clientes
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          {totalPages > 1 && (
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 border rounded-lg ${
                    currentPage === page
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientesPage;