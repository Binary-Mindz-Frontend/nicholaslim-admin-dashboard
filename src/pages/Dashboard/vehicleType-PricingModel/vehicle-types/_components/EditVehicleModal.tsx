import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";

interface EditVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VehicleTypeData) => void;
  initialData: VehicleTypeData | null;
}

interface VehicleTypeData {
  id: string;
  vehicle_type: string;
  base_price: number | string;
  per_km_price: number | string;
  peak_pricing: boolean;
  dimension: string;
  max_load: number | string;
  isActive: boolean;
}

enum VehicleTypeEnum {
  CAR = "CAR",
  TRUCK = "TRUCK",
  MOTORCYCLE = "MOTORCYCLE",
  BUS = "BUS",
  VAN = "VAN",
  BICYCLE = "BICYCLE",
  SUV = "SUV",
  TRACTOR = "TRACTOR",
  ELECTRIC_SCOOTER = "ELECTRIC_SCOOTER",
  OTHER = "OTHER",
}

const EditVehicleModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: EditVehicleModalProps) => {
  const [formData, setFormData] = useState<VehicleTypeData>({
    id: "",
    vehicle_type: "CAR",
    base_price: 0,
    per_km_price: 0,
    peak_pricing: true,
    dimension: "",
    max_load: 0,
    isActive: true,
  });

  const [dimensionInputs, setDimensionInputs] = useState({
    height: "",
    width: "",
  });

  // Parse dimension string into height and width
  const parseDimension = (dimension: string) => {
    const parts = dimension.split(" x ");
    if (parts.length === 2) {
      const height = parts[0].replace("ft", "").trim();
      const width = parts[1].replace("ft", "").trim();
      return { height, width };
    }
    return { height: "", width: "" };
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        base_price: initialData.base_price,
        per_km_price: initialData.per_km_price,
        max_load: initialData.max_load,
        isActive: initialData.isActive,
      });

      const { height, width } = parseDimension(initialData.dimension);
      setDimensionInputs({ height, width });
    }
  }, [initialData]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      vehicle_type: e.target.value,
    }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Only allow numbers and decimal point
    const regex = /^[0-9]*\.?[0-9]*$/;
    if (regex.test(value) || value === "") {
      const numericValue = value === "" ? 0 : parseFloat(value);
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    }
  };

  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Only allow numbers and decimal point
    const regex = /^[0-9]*\.?[0-9]*$/;
    if (regex.test(value) || value === "") {
      setDimensionInputs((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Update dimension string
      const newHeight = name === "height" ? value : dimensionInputs.height;
      const newWidth = name === "width" ? value : dimensionInputs.width;

      if (newHeight && newWidth) {
        setFormData((prev) => ({
          ...prev,
          dimension: `${newHeight}ft x ${newWidth}ft`,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          dimension: "",
        }));
      }
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that dimension is set
    if (!dimensionInputs.height || !dimensionInputs.width) {
      alert("Please enter both height and width for dimension");
      return;
    }

    onSubmit(formData);
  };

  if (!isOpen || !initialData) return null;

  const trackClassActive = formData.isActive
    ? "bg-green-500 data-[state=checked]:bg-green-500 cursor-pointer"
    : "bg-gray-300 cursor-pointer";

  const trackClassPeak = formData.peak_pricing
    ? "bg-green-500 data-[state=checked]:bg-green-500 cursor-pointer"
    : "bg-gray-300 cursor-pointer";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Edit Vehicle Type
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vehicle Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Type
              </label>
              <select
                name="vehicle_type"
                value={formData.vehicle_type}
                onChange={handleSelectChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              >
                {Object.values(VehicleTypeEnum).map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            {/* Base Fare */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Fare
              </label>
              <input
                type="text"
                name="base_price"
                value={formData.base_price === 0 ? "" : formData.base_price}
                onChange={handleNumberInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="10.00"
                required
              />
            </div>

            {/* Per KM Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Per Kilometer Fee
              </label>
              <input
                type="text"
                name="per_km_price"
                value={formData.per_km_price === 0 ? "" : formData.per_km_price}
                onChange={handleNumberInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="1.3"
                required
              />
            </div>

            {/* Max Load */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Load (kg)
              </label>
              <input
                type="text"
                name="max_load"
                value={formData.max_load === 0 ? "" : formData.max_load}
                onChange={handleNumberInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="300"
                required
              />
            </div>

            {/* Dimension Height */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dimension - Height (ft)
              </label>
              <input
                type="text"
                name="height"
                value={dimensionInputs.height}
                onChange={handleDimensionChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="6"
                required
              />
            </div>

            {/* Dimension Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dimension - Width (ft)
              </label>
              <input
                type="text"
                name="width"
                value={dimensionInputs.width}
                onChange={handleDimensionChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="4"
                required
              />
            </div>
          </div>

          {/* Status Switches */}
          <div className="mb-6 flex flex-wrap gap-6 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  handleSwitchChange("isActive", checked)
                }
                className={trackClassActive}
              />
              <span
                className={`text-sm font-semibold ${
                  formData.isActive ? "text-green-700" : "text-gray-500"
                }`}
              >
                {formData.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.peak_pricing}
                onCheckedChange={(checked) =>
                  handleSwitchChange("peak_pricing", checked)
                }
                className={trackClassPeak}
              />
              <span
                className={`text-sm font-semibold ${
                  formData.peak_pricing ? "text-green-700" : "text-gray-500"
                }`}
              >
                {formData.peak_pricing
                  ? "Peak Pricing Enabled"
                  : "Peak Pricing Disabled"}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#FFCC00] rounded-md text-gray-900 font-medium hover:bg-[#FFD700] cursor-pointer"
            >
              Update Vehicle Type
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVehicleModal;
