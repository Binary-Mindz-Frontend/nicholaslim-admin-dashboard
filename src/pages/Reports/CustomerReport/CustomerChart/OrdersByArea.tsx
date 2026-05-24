import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useState, useEffect } from "react";

interface ZoneStat {
  zoneId: number;
  zoneName: string;
  totalOrder: number;
}

interface OrdersByAreaProps {
  zoneStats: ZoneStat[];
}

const generateRandomColor = (): string => {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
};

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

  // Handle empty or missing arrays entirely
  if (!zoneStats || zoneStats.length === 0) {
    return (
      <div className="w-full bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-1">Orders by Area</h3>
        <p className="text-sm text-gray-500 mb-4">Geographic distribution</p>
        <div className="w-full h-[280px] flex items-center justify-center text-gray-500 font-medium bg-gray-50 rounded-lg border border-dashed border-gray-200">
          No zone data available
        </div>
      </div>
    );
  }

  const totalOrders = zoneStats.reduce((sum, zone) => sum + zone.totalOrder, 0);
  const isAllZero = totalOrders === 0;

  // Format data for chart
  const chartData = zoneStats.map((zone, index) => {
    const actualPercentage =
      totalOrders > 0
        ? ((zone.totalOrder / totalOrders) * 100).toFixed(1)
        : "0.0";

    return {
      ...zone,
      chartValue: isAllZero ? 1 : zone.totalOrder,
      color: isAllZero
        ? `hsl(${(360 / zoneStats.length) * index}, 30%, 80%)`
        : colors[index] || generateRandomColor(),
      percentage: actualPercentage,
    };
  });

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-1">Orders by Area</h3>
      <p className="text-sm text-gray-500 mb-4">Geographic distribution</p>

      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="chartValue" // Bind rendering to the visual placeholder value
              nameKey="zoneName"
              innerRadius={60} // Optional: Looks cleaner as a Donut chart when empty
              outerRadius={90}
              label={({ zoneName, totalOrder, percentage }: any) =>
                `${zoneName}: ${totalOrder} (${percentage}%)`
              }
              labelLine={true}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(_value, name, props) => [
                `${props.payload.totalOrder} orders (${props.payload.percentage}%)`,
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
