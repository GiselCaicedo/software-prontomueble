// ./src/types/providers.ts
export type Product = {
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
};

export type Category = {
  id_tipo_mueble: number;
  tipo_mueble: string;
  imagen: string;
};

export type Material = {
  id_material: number;
  nombre_material: string;
};

export type Color = {
  id_color: number;
  nombre_color: string;
};
