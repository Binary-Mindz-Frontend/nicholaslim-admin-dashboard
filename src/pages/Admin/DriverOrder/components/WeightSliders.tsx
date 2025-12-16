import { Button } from "@/components/ui/button";

interface Weights {
  ranking: number;
  rating: number;
  follower: number;
}

interface WeightSlidersProps {
  weights: Weights;
  onChange: (key: keyof Weights, value: number) => void;
  onSave: () => void;
  isLoading?: boolean;
}

export function WeightSliders({
  weights,
  onChange,
  onSave,
  isLoading = false,
}: WeightSlidersProps) {
  const sliders = [
    { label: "Driver Ranking Weight", key: "ranking" as const },
    { label: "Customer Rating Weight", key: "rating" as const },
    { label: "Follower Weight", key: "follower" as const },
  ];

  // Debug: Log weights when they change
  console.log('Current weights in WeightSliders:', weights);

  return (
    <section className="mb-8 rounded-lg border border-slate-200 bg-white p-8">
      <h2 className="mb-8 text-xl font-semibold text-slate-900">
        Competition Weight Settings
      </h2>

      {sliders.map(({ label, key }) => (
        <div key={key} className="mb-10">
          <p className="mb-3 text-sm font-medium text-slate-700">{label}</p>
          <div className="flex items-center gap-6">
            <input
              type="range"
              min="0"
              max="100"
              value={weights[key]}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                console.log(`Slider ${key} changed to:`, newValue); // Debug
                onChange(key, newValue);
              }}
              className="h-3 flex-1 appearance-none rounded-full bg-linear-to-r from-amber-400 to-amber-300 accent-amber-500 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:ring-4 [&::-webkit-slider-thumb]:ring-amber-300"
              style={{
                background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${weights[key]}%, #fde68a ${weights[key]}%, #fde68a 100%)`,
              }}
            />
            <span className="w-16 text-right text-lg font-bold text-slate-900">
              {weights[key]}%
            </span>
          </div>
        </div>
      ))}

      <div className="flex items-center justify-center mt-6">
        {/* <div className="text-sm text-slate-600">
          Total: <span className="font-semibold">{totalWeight}%</span>
          {hasChanges && (
            <span className="ml-2 text-amber-600">
              (Should total 100%)
            </span>
          )}
        </div> */}
        
        <Button
          onClick={onSave}
          disabled={isLoading}
          className="bg-[#155DFC] px-10 text-white hover:bg-[#155DFC]/80 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
    </section>
  );
}