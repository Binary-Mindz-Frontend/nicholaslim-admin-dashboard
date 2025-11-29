import { Clock, Trophy, Star, Users } from "lucide-react";

const metrics = [
  { icon: Clock, label: "Timeout", value: "8 seconds" },
  { icon: Trophy, label: "Ranking Weight", value: "80%" },
  { icon: Star, label: "Rating Weight", value: "30%" },
  { icon: Users, label: "Follower Weight", value: "70%" },
  { icon: Users, label: "Maximum Drivers to Join", value: "5" },
];

export function OverviewCards() {
  return (
    <section className="mb-8">
      <h2 className="mb-4 text-xl font-semibold text-slate-900">Overview</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {metrics.map((item, i) => (
          <div
            key={i}
            className="rounded-lg border border-slate-200 bg-white p-6 text-center"
          >
            <div className="mb-3 inline-flex rounded-full bg-slate-100 p-3">
              <item.icon className="h-6 w-6 text-slate-600" />
            </div>
            <p className="text-xs text-slate-600">{item.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
