import { Clock, Trophy, Star, Users, UserPlus } from "lucide-react";
import { CompetitionConfig } from "@/types/driverOrderCompetition";

interface OverviewCardsProps {
  config?: CompetitionConfig;
}

export function OverviewCards({ config }: OverviewCardsProps) {
  const metrics = [
    { icon: Clock, label: "Timeout", value: `${config?.challenges_timeout || 8} seconds` },
    { icon: Trophy, label: "Ranking Weight", value: `${config?.rank_weight || 0}%` },
    { icon: Star, label: "Rating Weight", value: `${config?.rating_weight || 0}%` },
    { icon: Users, label: "Follower Weight", value: `${config?.followers_weight || 0}%` },
    { icon: UserPlus, label: "Maximum Drivers to Join", value: `${config?.max_users_to_join || 5}` },
  ];

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