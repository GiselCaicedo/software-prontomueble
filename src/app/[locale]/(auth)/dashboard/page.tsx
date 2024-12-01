'use client'

import React, { useState, useEffect } from 'react';

interface Product {
  nombre_mueble: string;
  alto: number;
  ancho: number;
  profundidad: number;
  diagonal: number;
  precio_neto: number;
  stock: number;
  id_material: number;
  id_color: number;
  id_tipo_mueble: number;
  imagen: string;
}

interface Category {
  id_tipo_mueble: number;
  tipo_mueble: string;
  imagen: string;
}

interface Material {
  id_material: number;
  nombre_material: string;
}

interface Color {
  id_color: number;
  nombre_color: string;
}

const initialProductData: Product = {
  nombre_mueble: '',
  alto: 0,
  ancho: 0,
  profundidad: 0,
  diagonal: 0,
  precio_neto: 0,
  stock: 0,
  id_material: 0,
  id_color: 0,
  id_tipo_mueble: 0,
  imagen: '' 
};

const conditions = [
  { id: 'nuevo', name: 'Nuevo', icon: '🆕' },
  { id: 'usado', name: 'Usado', icon: '👍' },
  { id: 'con', name: 'Con', icon: '✨' },
];

const ProductForm = () => {
  const [step, setStep] = useState(1);
  const [productData, setProductData] = useState<Product>(initialProductData);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [isSelectOpen, setIsSelectOpen] = useState({ material: false, color: false });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch furniture types
        const typesResponse = await fetch('/api/ventas/tipos-mueble');
        if (!typesResponse.ok) throw new Error('Error al cargar tipos de mueble');
        const typesData = await typesResponse.json();
        setCategories(Array.isArray(typesData) ? typesData : []);

        // Fetch materials
        const materialsResponse = await fetch('/api/ventas/materiales');
        if (!materialsResponse.ok) throw new Error('Error al cargar materiales');
        const materialsData = await materialsResponse.json();
        setMaterials(Array.isArray(materialsData) ? materialsData : []);

        // Fetch colors
        const colorsResponse = await fetch('/api/ventas/colores');
        if (!colorsResponse.ok) throw new Error('Error al cargar colores');
        const colorsData = await colorsResponse.json();
        setColors(Array.isArray(colorsData) ? colorsData : []);

      } catch (error: any) {
        setError('Error al cargar los datos necesarios. Por favor, intente más tarde.');
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const validateProductData = (data: Product): string | null => {
    if (!data.nombre_mueble?.trim()) return 'El nombre del mueble es requerido';
    if (data.alto <= 0) return 'El alto debe ser mayor a 0';
    if (data.ancho <= 0) return 'El ancho debe ser mayor a 0';
    if (data.profundidad <= 0) return 'La profundidad debe ser mayor a 0';
    if (data.diagonal <= 0) return 'La diagonal debe ser mayor a 0';
    if (data.precio_neto <= 0) return 'El precio neto debe ser mayor a 0';
    if (data.stock < 0) return 'El stock no puede ser negativo';
    if (data.id_material <= 0) return 'Debe seleccionar un material válido';
    if (data.id_color <= 0) return 'Debe seleccionar un color válido';
    if (data.id_tipo_mueble <= 0) return 'Debe seleccionar un tipo de mueble válido';
    return null;
  };

  const handleProductSubmit = async () => {
    try {
      setError(null);
      setSuccess(null);
      setIsLoading(true);

      const validationError = validateProductData(productData);
      if (validationError) {
        setError(validationError);
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/productos/nuevo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear el producto');
      }

      setSuccess('Producto creado exitosamente');
      setProductData(initialProductData);
      setStep(1);
    } catch (error: any) {
      setError(error.message);
      console.error('Error detallado:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const CustomSelect = ({ 
    value, 
    onChange, 
    options, 
    placeholder, 
    isOpen, 
    onToggle 
  }: { 
    value: number, 
    onChange: (value: number) => void, 
    options: Array<{id: number, name: string}>, 
    placeholder: string,
    isOpen: boolean,
    onToggle: () => void
  }) => (
    <div className="relative">
      <div 
        className="w-full px-3 py-2 border rounded-md cursor-pointer bg-white hover:border-gray-400 transition-colors"
        onClick={onToggle}
      >
        {value === 0 ? placeholder : options.find(opt => opt.id === value)?.name}
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.id}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => {
                onChange(option.id);
                onToggle();
              }}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
  console.log(categories)
  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Vender producto</h2>
      <p className="text-gray-600">Selecciona la categoría</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id_tipo_mueble}
            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => {
              setProductData(prev => ({
                ...prev,
                id_tipo_mueble: category.id_tipo_mueble
              }));
              setStep(2);
            }}
          >
            <div className="aspect-video relative mb-2">
              <img
                src={category.imagen}
                alt={category.tipo_mueble}
                className="object-cover rounded-md w-full h-full"
              />
            </div>
            <p className="text-center font-medium">{category.tipo_mueble}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Condición del producto</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {conditions.map((condition) => (
          <div
            key={condition.id}
            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 bg-pink-50 transition-colors"
            onClick={() => setStep(3)}
          >
            <div className="text-center">
              <span className="text-2xl">{condition.icon}</span>
              <p className="mt-2 font-medium">{condition.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Información del producto</h2>
      
      {error && (
        <div className="p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 text-green-700 bg-green-100 rounded-md">
          {success}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Nombre del producto"
            value={productData.nombre_mueble}
            onChange={(e) =>
              setProductData({ ...productData, nombre_mueble: e.target.value })
            }
          />
        </div>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ancho (cm)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Ancho"
              value={productData.ancho || ''}
              onChange={(e) =>
                setProductData({ ...productData, ancho: parseFloat(e.target.value) || 0 })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Alto (cm)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Alto"
              value={productData.alto || ''}
              onChange={(e) =>
                setProductData({ ...productData, alto: parseFloat(e.target.value) || 0 })
              }
            />
          </div>
        </div>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Profundidad (cm)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Profundidad"
              value={productData.profundidad || ''}
              onChange={(e) =>
                setProductData({ ...productData, profundidad: parseFloat(e.target.value) || 0 })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Diagonal (cm)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Diagonal"
              value={productData.diagonal || ''}
              onChange={(e) =>
                setProductData({ ...productData, diagonal: parseFloat(e.target.value) || 0 })
              }
            />
          </div>
        </div>
  
        <div>
          <label className="block text-sm font-medium mb-1">Precio Neto</label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Precio Neto"
            value={productData.precio_neto || ''}
            onChange={(e) =>
              setProductData({ ...productData, precio_neto: parseFloat(e.target.value) || 0 })
            }
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium mb-1">Stock</label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Stock"
            value={productData.stock || ''}
            onChange={(e) =>
              setProductData({ ...productData, stock: parseInt(e.target.value) || 0 })
            }
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium mb-1">Material</label>
          <CustomSelect
            value={productData.id_material}
            onChange={(value) => setProductData({ ...productData, id_material: value })}
            options={materials.map(m => ({ id: m.id_material, name: m.nombre_material }))}
            placeholder="Selecciona un material"
            isOpen={isSelectOpen.material}
            onToggle={() => setIsSelectOpen(prev => ({ ...prev, material: !prev.material }))}
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium mb-1">Color</label>
          <CustomSelect
            value={productData.id_color}
            onChange={(value) => setProductData({ ...productData, id_color: value })}
            options={colors.map(c => ({ id: c.id_color, name: c.nombre_color }))}
            placeholder="Selecciona un color"
            isOpen={isSelectOpen.color}
            onToggle={() => setIsSelectOpen(prev => ({ ...prev, color: !prev.color }))}
          />
        </div>
  
        <button
          onClick={handleProductSubmit}
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 
            ${isLoading 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-pink-100 text-pink-900 hover:bg-pink-200'}`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin h-5 w-5 border-2 border-pink-900 border-t-transparent rounded-full mr-2"></div>
              Publicando...
            </div>
          ) : (
            'Publicar'
          )}
        </button>
  
        <button
          onClick={() => setStep(step - 1)}
          className="w-full mt-2 py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Volver
        </button>
      </div>
    </div>
  );
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-100 border-t-pink-900"></div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Barra de progreso */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {['Categoría', 'Condición', 'Detalles'].map((label, index) => (
            <div
              key={label}
              className={`text-sm ${index + 1 <= step ? 'text-pink-900' : 'text-gray-400'}`}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-pink-500 rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      {isLoading && <LoadingSpinner />}
      
      {error && error.includes('Error al cargar datos') && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              ⚠️
            </div>
            <div className="ml-3">
              <p className="text-yellow-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {!isLoading && (
        <>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </>
      )}

      {/* Paginación */}
      <div className="mt-8 flex justify-center gap-2">
        {[1, 2, 3].map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => pageNum <= step && setStep(pageNum)}
            className={`w-3 h-3 rounded-full transition-colors
              ${pageNum === step 
                ? 'bg-pink-500' 
                : pageNum < step 
                  ? 'bg-pink-200' 
                  : 'bg-gray-200'}`}
            disabled={pageNum > step}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductForm;