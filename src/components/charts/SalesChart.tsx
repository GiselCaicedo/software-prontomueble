// src/components/charts/SalesChart.tsx
'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SalesChartProps {
  data: Array<{
    mes: string;
    ingresos: number;
  }>;
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="ingresos" stroke="#8884d8" name="Ingresos" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
