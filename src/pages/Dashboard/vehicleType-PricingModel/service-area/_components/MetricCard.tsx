import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const MetricCard = ({ title, value, icon: Icon, color, bgColor }: MetricCardProps) => {
  return (
    <Card className="w-80 h-35 border-gray-300 shadow-lg">
     <CardContent className="py-3 px-4">
       <div className="flex items-center justify-between">
        <div>
           <p className="text-xl mb-1">{title}</p>
           <p style={{ color: color }} className="text-2xl font-bold">
             {value}
           </p>
        </div>
         <div
          className="p-3 rounded-md"
          style={{ backgroundColor: bgColor, border: `1px solid ${color}` }}
        >
          <Icon size={24} color={color} />
        </div>
      </div>
    </CardContent>
  </Card>
  );
};

export default MetricCard;