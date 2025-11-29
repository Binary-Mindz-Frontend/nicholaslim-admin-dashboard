import { Switch } from "@/components/ui/switch"; // shadcn/ui Switch
import { useState } from "react";

interface StatusSwitchProps {
  status: "Active" | "Inactive";
  onChange?: (newStatus: "Active" | "Inactive") => void;
}

export const StatusSwitch: React.FC<StatusSwitchProps> = ({ status, onChange }) => {
  const [checked, setChecked] = useState(status === "Active");

  const handleToggle = (value: boolean) => {
    setChecked(value);
    onChange?.(value ? "Active" : "Inactive");
  };

  // custom track color based on state
  const trackClass = checked ? "bg-green-500 cursor-pointer" : "bg-yellow-300 cursor-pointer";

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={checked}
        onCheckedChange={handleToggle}
        className={trackClass} 
      />
      <span className={`text-xs font-semibold ${checked ? "text-green-700" : "text-gray-500"}`}>
        {checked ? "Active" : "Inactive"}
      </span>
    </div>
  );
};
