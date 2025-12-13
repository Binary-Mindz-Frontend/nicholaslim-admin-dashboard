import { Eye, Zap, TrendingUp } from "lucide-react";
import { StatCard } from "./StatCard";

interface AdData {
  impressions: string;
  impressionsChange: string;
  clicks: string;
  clicksChange: string;
  ctr: string;
  ctrChange: string;
}

const adData: { [key: string]: AdData } = {
  USER: {
    impressions: "1,53,000",
    impressionsChange: "+12%",
    clicks: "22,225",
    clicksChange: "+8%",
    ctr: "6.12%",
    ctrChange: "+3.2%",
  },
  RAIDER: {
    impressions: "85,500",
    impressionsChange: "+5%",
    clicks: "11,800",
    clicksChange: "+2.5%",
    ctr: "7.15%",
    ctrChange: "+1.5%",
  },
};

export default function AdvertiseManagementTop({
  activeTab,
}: {
  activeTab: "USER" | "RAIDER";
}) {
  const currentData = adData[activeTab];

  return (
    <div className="p-8  ">
      <div className="flex flex-wrap gap-6 max-w-4xl m-auto">
        <StatCard
          title="Total Impression"
          value={currentData?.impressions}
          change={currentData?.impressionsChange}
          icon={<Eye className="w-5 h-5" />}
          color="text-yellow-600"
        />

        <StatCard
          title="Total Clicks"
          value={currentData?.clicks}
          change={currentData?.clicksChange}
          icon={<Zap className="w-5 h-5" />}
          color="text-yellow-600"
        />

        <StatCard
          title="Click Through Rate"
          value={currentData?.ctr}
          change={currentData?.ctrChange}
          icon={<TrendingUp className="w-5 h-5" />}
          color="text-yellow-600"
        />
      </div>
    </div>
  );
}
