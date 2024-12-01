'use client';

import { useState } from 'react';

interface Furniture {
  id_tipo_mueble: number;  
  tipo_mueble: string;    
}

interface ProviderFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  initialFurniture: Furniture[];
}

export function ProviderForm({ onSubmit, initialFurniture }: ProviderFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);
      
      const selectedFurniture = initialFurniture
        .filter((_, index) => formData.get(`mueble-${index}`))
        .map(furniture => furniture.id_tipo_mueble);
      
      formData.append('idMuebles', JSON.stringify(selectedFurniture));

      await onSubmit(formData);
      setOpen(false);
      event.currentTarget.reset();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al crear el proveedor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
      >
        Agregar Proveedor
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Nuevo Proveedor</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Información de la empresa */}
                <div className="space-y-2">
                  <label htmlFor="nombreEmpresa" className="block text-sm font-medium text-gray-700">
                    Nombre de la Empresa
                  </label>
                  <input
                    id="nombreEmpresa"
                    name="nombreEmpresa"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Dirección */}
                <div className="space-y-2">
                  <label htmlFor="direccionPrincipal" className="block text-sm font-medium text-gray-700">
                    Dirección Principal
                  </label>
                  <input
                    id="direccionPrincipal"
                    name="direccionPrincipal"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="direccionComplemento" className="block text-sm font-medium text-gray-700">
                    Complemento
                  </label>
                  <input
                    id="direccionComplemento"
                    name="direccionComplemento"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="codigoPostal" className="block text-sm font-medium text-gray-700">
                    Código Postal
                  </label>
                  <input
                    id="codigoPostal"
                    name="codigoPostal"
                    type="number"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Información de contacto */}
                <div className="space-y-2">
                  <label htmlFor="contactoNombre" className="block text-sm font-medium text-gray-700">
                    Nombre de Contacto
                  </label>
                  <input
                    id="contactoNombre"
                    name="contactoNombre"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contactoApellido" className="block text-sm font-medium text-gray-700">
                    Apellido de Contacto
                  </label>
                  <input
                    id="contactoApellido"
                    name="contactoApellido"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contactoTelefono" className="block text-sm font-medium text-gray-700">
                    Teléfono de Contacto
                  </label>
                  <input
                    id="contactoTelefono"
                    name="contactoTelefono"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contactoEmail" className="block text-sm font-medium text-gray-700">
                    Email de Contacto
                  </label>
                  <input
                    id="contactoEmail"
                    name="contactoEmail"
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Tipos de muebles */}
              <div className="space-y-2">
                <span className="block text-sm font-medium text-gray-700">Tipos de Muebles</span>
                <div className="grid grid-cols-2 gap-2">
                {initialFurniture.map((furniture, index) => (
                    <div key={furniture.id_tipo_mueble} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`mueble-${index}`}
                        name={`mueble-${index}`}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <label htmlFor={`mueble-${index}`} className="text-sm text-gray-700">
                        {furniture.tipo_mueble}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}