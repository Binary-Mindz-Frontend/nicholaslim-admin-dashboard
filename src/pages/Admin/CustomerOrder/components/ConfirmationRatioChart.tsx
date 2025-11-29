import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Genuine Orders", value: 80, color: "#10b981" },
  { name: "Manual Check", value: 15, color: "#f59e0b" },
  { name: "Suspicious Orders", value: 5, color: "#ef4444" },
];

export function ConfirmationRatioChart() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-8">
      <h2 className="mb-8 text-lg font-semibold text-slate-900">
        Order Confirmation Ratio
      </h2>

      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={90}
              outerRadius={130}
              paddingAngle={4}
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>

            <text
              x="50%"
              y="48%"
              textAnchor="middle"
              className="text-5xl font-bold fill-slate-900"
            >
              80%
            </text>
            <text
              x="50%"
              y="58%"
              textAnchor="middle"
              className="text-sm fill-slate-600"
            >
              Genuine
            </text>
          </PieChart>
        </ResponsiveContainer>

        <div className="mt-6 flex flex-wrap justify-center gap-8">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-slate-700">
                {item.name}{" "}
                <strong className="font-medium">{item.value}%</strong>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
