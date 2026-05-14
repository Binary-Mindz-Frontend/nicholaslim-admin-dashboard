import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useState, useEffect } from "react";

interface ZoneStat {
  zoneId: number;
  zoneName: string;
  totalOrder: number;
}

interface OrdersByAreaProps {
  zoneStats: ZoneStat[];
}

// Function to generate a random color
const generateRandomColor = (): string => {
  // Generate a random hex color
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
};

// Function to generate colors with good contrast
const generateColorPalette = (count: number): string[] => {
  const colors: string[] = [];
  const hueStep = 360 / count;
  
  for (let i = 0; i < count; i++) {
    const hue = (hueStep * i) % 360;
    colors.push(`hsl(${hue}, 70%, 60%)`);
  }
  
  return colors;
};

export default function OrdersByArea({ zoneStats }: OrdersByAreaProps) {
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    if (zoneStats && zoneStats.length > 0) {
      const generatedColors = generateColorPalette(zoneStats.length);
      setColors(generatedColors);
    }
  }, [zoneStats]);

  if (!zoneStats || zoneStats.length === 0) {
    return (
      <div className="w-full bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-1">Orders by Area</h3>
        <p className="text-sm text-gray-500 mb-4">Geographic distribution</p>
        <div className="w-full h-[280px] flex items-center justify-center text-gray-500">
          No zone data available
        </div>
      </div>
    );
  }

  // Calculate percentages
  const totalOrders = zoneStats.reduce((sum, zone) => sum + zone.totalOrder, 0);

  // Format data for chart
  const chartData = zoneStats.map((zone, index) => ({
    ...zone,
    color: colors[index] || generateRandomColor(),
    percentage: totalOrders > 0 ? ((zone.totalOrder / totalOrders) * 100).toFixed(1) : 0,
  }));

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-1">Orders by Area</h3>
      <p className="text-sm text-gray-500 mb-4">Geographic distribution</p>

      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="totalOrder"
              nameKey="zoneName"
              innerRadius={0}
              outerRadius={90}
              label={({ zoneName, totalOrder, percentage }: any) => 
                `${zoneName}: ${totalOrder} (${percentage}%)`
              }
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name, props) => [
                `${value} orders (${props.payload.percentage}%)`,
                name
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}