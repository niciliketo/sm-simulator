import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HappinessChartProps {
  data: { tick: number; averageHappiness: number }[];
}

export const HappinessChart: React.FC<HappinessChartProps> = ({ data }) => {
  return (
    <div className="w-full h-40 bg-slate-900/50 p-2 rounded border border-slate-700">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey="tick" hide />
          <YAxis domain={[0, 1]} hide />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
            itemStyle={{ color: '#10b981' }}
          />
          <Line 
            type="monotone" 
            dataKey="averageHappiness" 
            stroke="#10b981" 
            strokeWidth={2} 
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
