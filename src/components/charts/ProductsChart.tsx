
// src/components/charts/ProductsChart.tsx
'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProductsChartProps {
  data: Array<{
    nombre_mueble: string;
    cantidad_vendida: number;
  }>;
}

export function ProductsChart({ data }: ProductsChartProps) {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nombre_mueble" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="cantidad_vendida" fill="#82ca9d" name="Cantidad" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
