import { CheckCircle2, Clock, Star, Zap } from "lucide-react";

interface OverviewMetric {
  id: string;
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

const mockOverviewMetrics: OverviewMetric[] = [
  {
    id: "new-customers",
    label: "New Customers",
    value: "10%",
    icon: <Clock className="h-6 w-6 text-slate-600" />,
  },
  {
    id: "completed-orders",
    label: "Completed Orders",
    value: "5+ Orders (10%)",
    icon: <CheckCircle2 className="h-6 w-6 text-slate-600" />,
  },
  {
    id: "avg-rating",
    label: "Avg Customer Rating",
    value: "80%",
    icon: <Star className="h-6 w-6 text-slate-600" />,
  },
  {
    id: "auto-confirmed",
    label: "Auto Confirmed Orders",
    value: "530 Orders",
    icon: <Zap className="h-6 w-6 text-slate-600" />,
  },
];

export function OverviewCards() {
  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold text-slate-900">Overview</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mockOverviewMetrics.map((metric) => (
          <div
            key={metric.id}
            className="rounded-lg border border-slate-200 bg-white p-4"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 rounded-full bg-slate-100 p-2">
                {metric.icon}
              </div>
              <p className="text-xs text-slate-500">{metric.label}</p>
              <p className="text-2xl font-bold text-slate-900">
                {metric.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
