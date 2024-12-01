"use client";

import React, { useState } from 'react';

interface Material {
  id_material: number;
  nombre_material: string;
}

interface Color {
  id_color: number;
  nombre_color: string;
}

interface TipoMueble {
  id_tipo_mueble: number;
  tipo_mueble: string;
}

interface NewProductFormProps {
  materiales: Material[];
  colores: Color[];
  tiposMueble: TipoMueble[];
}

const NewProductForm = ({
  materiales,
  colores,
  tiposMueble
}: NewProductFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre_mueble: '',
    alto: '',
    ancho: '',
    profundidad: '',
    diagonal: '',
    precio_neto: '',
    id_material: '',
    id_color: '',
    id_tipo_mueble: '',
    stock: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

  
    try {
      const dataToSubmit = {
        nombre_mueble: formData.nombre_mueble,
        alto: Number(formData.alto),
        ancho: Number(formData.ancho),
        profundidad: Number(formData.profundidad),
        diagonal: Number(formData.diagonal),
        precio_neto: Number(formData.precio_neto),
        stock: Number(formData.stock),
        id_material: Number(formData.id_material),
        id_color: Number(formData.id_color),
        id_tipo_mueble: Number(formData.id_tipo_mueble)
      };
  
      // Usar URL absoluta
      const apiUrl = `${window.location.origin}/api/productos/nuevo`;
      console.log('🎯 URL completa:', apiUrl);
      console.log('📦 Datos a enviar:', dataToSubmit);
  
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Agregar headers adicionales para debug
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin', // Importante para cookies/sesión
        body: JSON.stringify(dataToSubmit)
      });
      
      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers));
  
      if (!response.ok) {
        const text = await response.text();
        console.log('❌ Error response:', text);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('✅ Success:', result);
  
      if (result.success) {
        setFormData({
          nombre_mueble: '',
          alto: '',
          ancho: '',
          profundidad: '',
          diagonal: '',
          precio_neto: '',
          id_material: '',
          id_color: '',
          id_tipo_mueble: '',
          stock: ''
        });
        
        setIsOpen(false);
        window.location.reload();
      } else {
        throw new Error(result.message || 'Error desconocido al crear el producto');
      }
    } catch (err: any) {
      console.error('❌ Error completo:', err);
  
    }
  };
  
  return (
    <div>
      {/* Botón para abrir el modal */}
      {/* <button
        onClick={() => setIsOpen(true)}
        className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        <span>+</span>
        Nuevo Producto
      </button> */}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800">Añadir Nuevo Producto</h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Nombre y Tipo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Mueble
                  </label>
                  <input
                    type="text"
                    name="nombre_mueble"
                    value={formData.nombre_mueble}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Mueble
                  </label>
                  <select
                    name="id_tipo_mueble"
                    value={formData.id_tipo_mueble}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    required
                  >
                    <option value="">Seleccionar tipo</option>
                    {tiposMueble.map((tipo) => (
                      <option key={tipo.id_tipo_mueble} value={tipo.id_tipo_mueble}>
                        {tipo.tipo_mueble}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dimensiones */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alto (cm)
                  </label>
                  <input
                    type="number"
                    name="alto"
                    value={formData.alto}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ancho (cm)
                  </label>
                  <input
                    type="number"
                    name="ancho"
                    value={formData.ancho}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profundidad (cm)
                  </label>
                  <input
                    type="number"
                    name="profundidad"
                    value={formData.profundidad}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    required
                  />
                </div>
              </div>

              {/* Material, Color y Diagonal */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Material
                  </label>
                  <select
                    name="id_material"
                    value={formData.id_material}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    required
                  >
                    <option value="">Seleccionar material</option>
                    {materiales.map((material) => (
                      <option key={material.id_material} value={material.id_material}>
                        {material.nombre_material}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <select
                    name="id_color"
                    value={formData.id_color}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    required
                  >
                    <option value="">Seleccionar color</option>
                    {colores.map((color) => (
                      <option key={color.id_color} value={color.id_color}>
                        {color.nombre_color}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diagonal (cm)
                  </label>
                  <input
                    type="number"
                    name="diagonal"
                    value={formData.diagonal}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    required
                  />
                </div>
              </div>

              {/* Precio y Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio Neto
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="precio_neto"
                    value={formData.precio_neto}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Inicial
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    required
                  />
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewProductForm;