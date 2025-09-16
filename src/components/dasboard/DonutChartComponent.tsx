
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { DonutChartData } from '@/types';

const COLORS = ['#3B82F6', '#E5E7EB'];

interface DonutChartComponentProps {
    data: DonutChartData;
    isLoading: boolean;
}

const DonutChartComponent: React.FC<DonutChartComponentProps> = ({ data, isLoading }) => {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  const percentage = total > 0 ? ((data[0]?.value / total) * 100).toFixed(0) : 0;

  if (isLoading) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm h-full flex flex-col">
            <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse mb-4"></div>
            <div className="flex-grow flex items-center justify-center">
                <div className="w-48 h-48 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-2 mt-4">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>
        </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm h-full flex flex-col">
      <h3 className="font-semibold text-lg text-gray-800 mb-4">Volume livré vs manquant</h3>
      <div className="flex-grow flex items-center justify-center -mt-4">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              cornerRadius={10}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <foreignObject x="50%" y="50%" width="100" height="100" style={{ transform: 'translate(-50px, -35px)' }}>
                <div className="text-center">
                    <div className="text-4xl font-bold text-gray-800">{percentage}%</div>
                    <div className="text-sm text-gray-500">Livré</div>
                </div>
            </foreignObject>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col gap-2 mt-4 text-sm">
          <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <span className="text-gray-500">Volume livré</span>
              </div>
              <span className="font-semibold text-gray-800">{(data[0]?.value || 0).toLocaleString('fr-FR')} L</span>
          </div>
          <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gray-200"></span>
                  <span className="text-gray-500">Volume manquant</span>
              </div>
              <span className="font-semibold text-gray-800">{(data[1]?.value || 0).toLocaleString('fr-FR')} L</span>
          </div>
      </div>
    </div>
  );
};

export default DonutChartComponent;