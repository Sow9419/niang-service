
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BarChartData } from '@/types';

interface BarChartComponentProps {
    data: BarChartData;
    isLoading: boolean;
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({ data, isLoading }) => {
    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-sm h-full">
                <div className="flex justify-between items-center mb-4">
                    <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                </div>
                <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
        );
    }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg text-gray-800">Évolution du chiffre d'affaires encaissé</h3>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `${Number(value) / 1000}k`} />
            <Tooltip
                cursor={{fill: 'rgba(243, 244, 246, 0.5)'}}
                contentStyle={{
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
                formatter={(value) => [`${Number(value).toLocaleString('fr-FR')} CFA`, "Chiffre d'affaires"]}
            />
            <Bar dataKey="value" fill="#3B82F6" barSize={20} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartComponent;