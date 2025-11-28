"use client";

import { CirclePercent, ClockFading, DollarSign} from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: string | number;
    percentage: string;
    icon: ReactNode;
    isPositive?: boolean;
}

// card
const StatCard = ({
    title,
    value,
    percentage,
    icon,
    isPositive = true,
}: StatCardProps) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border p-4 w-full sm:w-[220px] flex flex-col gap-1">
            <h3 className="text-black text-base sm:text-xl font-semibold">{title}</h3>
            <div className="flex items-center justify-between">
                <div className="text-base sm:text-xl font-bold mt-1">${value}</div>
                <div className="p-2 rounded-md bg-yellow-50 border border-yellow-200">
                    {icon}
                </div>
            </div>

            <div
                className={cn(
                    "text-sm font-medium",
                    isPositive ? "text-green-600" : "text-red-600"
                )}
            >
                {percentage}
            </div>
        </div>
    );
};

//Dashboard
export default function DashboardStats() {
    const statsData = [
        {
            title: "Total Revenue",
            value: "40,000",
            percentage: "+12%",
            icon: <DollarSign className="h-5 w-5 text-yellow-600" />,
            isPositive: true,
        },
        {
            title: "Net Commission",
            value: "35,000",
            percentage: "+8%",
            icon: <CirclePercent className="h-5 w-5 text-yellow-600" />,
            isPositive: true,
        },
        {
            title: "Refunds",
            value: "12,000",
            percentage: "-3.2%",
            icon: <ClockFading className="h-5 w-5 text-yellow-600" />,
            isPositive: false,
        },
    ];

    return (
        <div className="flex flex-wrap md:justify-center gap-4">
            {statsData.map((item, index) => (
                <StatCard
                    key={index}
                    title={item.title}
                    value={item.value}
                    percentage={item.percentage}
                    icon={item.icon}
                    isPositive={item.isPositive}
                />
            ))}
        </div>
    );
}
