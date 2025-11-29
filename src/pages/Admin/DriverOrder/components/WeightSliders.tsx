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
}

export function WeightSliders({
  weights,
  onChange,
  onSave,
}: WeightSlidersProps) {
  const sliders = [
    { label: "Driver Ranking Weight", key: "ranking" as const },
    { label: "Customer Rating Weight", key: "rating" as const },
    { label: "Follower Weight", key: "follower" as const },
  ];

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
              onChange={(e) => onChange(key, Number(e.target.value))}
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

      <div className="flex justify-center">
        <Button
          onClick={onSave}
          className="bg-blue-600 px-10 text-white hover:bg-blue-700 cursor-pointer"
        >
          Save Change
        </Button>
      </div>
    </section>
  );
}
