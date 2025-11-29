
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { name: "Telok Blangah", value: 22, color: "#4F46E5" },
  { name: "Toa Payoh", value: 19, color: "#DB2777" },
  { name: "Changi", value: 30, color: "#10B981" },
  { name: "Hougang", value: 29, color: "#FACC15" },
];

export default function OrdersByArea() {
  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-1">Orders by Area</h3>
      <p className="text-sm text-gray-500 mb-4">Geographic distribution</p>

      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={0}
              outerRadius={90}
              label={({ name, value }) => `${name} ${value}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
