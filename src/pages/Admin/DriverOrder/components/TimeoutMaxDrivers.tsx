// components/driver-competition/TimeoutMaxDrivers.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TimeoutMaxDriversProps {
  timeout: number;
  maxDrivers: number;
  onTimeoutChange: (v: number) => void;
  onMaxDriversChange: (v: number) => void;
}

export function TimeoutMaxDrivers({
  timeout,
  maxDrivers,
  onTimeoutChange,
  onMaxDriversChange,
}: TimeoutMaxDriversProps) {
  return (
    <div className="mb-8 ">
      <div className="flex items-center mb-4 justify-between rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-700">
            Challenge Timeout:
          </span>
          <Input
            type="number"
            value={timeout}
            onChange={(e) => onTimeoutChange(Number(e.target.value) || 0)}
            className="h-9 w-16 text-center text-sm"
          />
          <span className="text-sm text-slate-600">Seconds</span>
        </div>
        <Button
          size="sm"
          className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
        >
          Save Change
        </Button>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-700">
            Maximum to Join:
          </span>
          <Input
            type="number"
            value={maxDrivers}
            onChange={(e) => onMaxDriversChange(Number(e.target.value) || 0)}
            className="h-9 w-16 text-center text-sm"
          />
          <span className="text-sm text-slate-600">Drivers</span>
        </div>
        <Button
          size="sm"
          className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
        >
          Save Change
        </Button>
      </div>
    </div>
  );
}
