import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
const COLORS = ['#16a34a', '#2563eb', '#f59e0b', '#ef4444'];
export default function GradePie({ data }) {
  const chartData = [
    { name: 'Giỏi', value: data?.Gioi || 0 },
    { name: 'Khá', value: data?.Kha || 0 },
    { name: 'Trung bình', value: data?.TB || 0 },
    { name: 'Yếu', value: data?.Yeu || 0 },
  ];
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={100}>
            {chartData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip /><Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}