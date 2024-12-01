// src/services/formServices.ts
import { InventoryService } from './database';

const inventoryService = new InventoryService();

export type FormDataResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export const formServices = {
  getMateriales: async () => {
    try {
      const materiales = await inventoryService.getMateriales();
      return { success: true, data: materiales };
    } catch (error) {
      console.error('Error al obtener materiales:', error);
      return {
        success: false,
        error: 'Error al cargar los materiales',
      };
    }
  },

  getColores: async () => {
    try {
      const colores = await inventoryService.getColores();
      return { success: true, data: colores };
    } catch (error) {
      console.error('Error al obtener colores:', error);
      return {
        success: false,
        error: 'Error al cargar los colores',
      };
    }
  },

  getTiposMueble: async () => {
    try {
      const tipos = await inventoryService.getTiposMueble();
      return { success: true, data: tipos };
    } catch (error) {
      console.error('Error al obtener tipos de mueble:', error);
      return {
        success: false,
        error: 'Error al cargar los tipos de mueble',
      };
    }
  },

  createProduct: async (data: {
    nombre_mueble: string;
    alto: number;
    ancho: number;
    profundidad: number;
    diagonal: number;
    precio_neto: number;
    id_material: number;
    id_color: number;
    id_tipo_mueble: number;
    stock: number;
  }) => {
    try {
      const newProductId = await inventoryService.createProduct(data);
      return {
        success: true,
        data: { id: newProductId },
      };
    } catch (error) {
      console.error('Error al crear producto:', error);
      return {
        success: false,
        error: 'Error al crear el producto',
      };
    }
  },
};
