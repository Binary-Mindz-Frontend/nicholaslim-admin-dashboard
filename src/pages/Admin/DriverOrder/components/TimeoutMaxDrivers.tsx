import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TimeoutMaxDriversProps {
  timeout: number;
  maxDrivers: number;
  onTimeoutChange: (v: number) => void;
  onMaxDriversChange: (v: number) => void;
  onSaveTimeout: () => void;
  onSaveMaxDrivers: () => void;
  loadingTimeout?: boolean;
  loadingMaxDrivers?: boolean;
}

export function TimeoutMaxDrivers({
  timeout,
  maxDrivers,
  onTimeoutChange,
  onMaxDriversChange,
  onSaveTimeout,
  onSaveMaxDrivers,
  loadingTimeout = false,
  loadingMaxDrivers = false,
}: TimeoutMaxDriversProps) {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-700">
            Challenge Timeout:
          </span>
          <Input
            type="string"
            value={timeout}
            onChange={(e) => {
              // Convert string to number, ensure it's valid
              const val = e.target.value;
              const num = val === '' ? 1 : Math.max(1, parseInt(val) || 1);
              onTimeoutChange(num);
            }}
            className="h-9 w-16 text-center text-sm"
            disabled={loadingTimeout}
          />
          <span className="text-sm text-slate-600">Seconds</span>
        </div>
        <Button
          size="sm"
          onClick={onSaveTimeout}
          disabled={loadingTimeout}
          className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingTimeout ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            "Save Change"
          )}
        </Button>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-700">
            Maximum to Join:
          </span>
          <Input
            type="string"
            value={maxDrivers}
            onChange={(e) => {
              // Convert string to number, ensure it's valid
              const val = e.target.value;
              const num = val === '' ? 1 : Math.max(1, parseInt(val) || 1);
              onMaxDriversChange(num);
            }}
            className="h-9 w-16 text-center text-sm"
            disabled={loadingMaxDrivers}
          />
          <span className="text-sm text-slate-600">Drivers</span>
        </div>
        <Button
          size="sm"
          onClick={onSaveMaxDrivers}
          disabled={loadingMaxDrivers}
          className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingMaxDrivers ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            "Save Change"
          )}
        </Button>
      </div>
    </div>
  );
}