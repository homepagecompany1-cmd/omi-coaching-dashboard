'use client';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface Point {
  date: string;
  calmness: number;
  futureFocus: number;
  consistency: number;
  elation: number;
}

function labelOf(d: string) {
  const dt = new Date(d);
  return `${dt.getMonth() + 1}/${dt.getDate()}`;
}

export function TrendChart({ data }: { data: Point[] }) {
  const chartData = data.map((p) => ({ ...p, label: labelOf(p.date) }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,46,74,0.08)" />
          <XAxis
            dataKey="label"
            stroke="#1a2e4a"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: 'rgba(26,46,74,0.2)' }}
          />
          <YAxis
            domain={[0, 100]}
            stroke="#1a2e4a"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: 'rgba(26,46,74,0.2)' }}
          />
          <Tooltip
            contentStyle={{
              background: '#1a2e4a',
              border: '1px solid #d4a574',
              borderRadius: 8,
              color: '#fff',
              fontSize: 12,
            }}
            labelStyle={{ color: '#e6c49a' }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            iconType="circle"
          />
          <Line
            type="monotone"
            dataKey="calmness"
            name="穏やかさ"
            stroke="#d4a574"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#d4a574' }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="futureFocus"
            name="未来志向"
            stroke="#1a2e4a"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#1a2e4a' }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="consistency"
            name="一貫性"
            stroke="#e85d3a"
            strokeWidth={2}
            dot={{ r: 3, fill: '#e85d3a' }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="elation"
            name="高揚"
            stroke="#2a4266"
            strokeWidth={2}
            strokeDasharray="4 3"
            dot={{ r: 3, fill: '#2a4266' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
