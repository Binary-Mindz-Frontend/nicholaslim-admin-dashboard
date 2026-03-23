import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { useGetVehicleTypesQuery } from "@/redux/features/vehicleType/vehicleTypeApi";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface EditVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VehicleTypeData) => void;
  initialData: any;
}

interface VehicleTypeData {
  id: string;
  vehicle_type: string;
  vehicle_name: string;
  vehicle_desc: string; // ✅ New field
  base_price: number | string;
  per_km_price: number | string;
  peak_pricing: boolean;
  dimension: string;
  max_load: number | string;
  isActive: boolean;
}

const EditVehicleModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: EditVehicleModalProps) => {
  const { data: vehicleTypesData = [] } = useGetVehicleTypesQuery({});

  const [formData, setFormData] = useState<VehicleTypeData>({
    id: "",
    vehicle_type: "",
    vehicle_name: "",
    vehicle_desc: "", // ✅ Initial state
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

  const parseDimension = (dimension: string) => {
    if (!dimension) return { height: "", width: "" };
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
        vehicle_desc: initialData.vehicle_desc || "",
      });

      let { height, width } = parseDimension(initialData.dimension);

      // fallback to individual fields if dimension string is missing
      if (!height && initialData.dimension_height) {
        height = initialData.dimension_height.toString();
      }
      if (!width && initialData.dimension_width) {
        width = initialData.dimension_width.toString();
      }

      setDimensionInputs({ height, width });
    }
  }, [initialData]);

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const regex = /^[0-9]*\.?[0-9]*$/;
    if (regex.test(value) || value === "") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : parseFloat(value),
      }));
    }
  };

  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const regex = /^[0-9]*\.?[0-9]*$/;
    if (regex.test(value) || value === "") {
      setDimensionInputs((prev) => ({ ...prev, [name]: value }));

      const newHeight = name === "height" ? value : dimensionInputs.height;
      const newWidth = name === "width" ? value : dimensionInputs.width;

      setFormData((prev) => ({
        ...prev,
        dimension:
          newHeight && newWidth ? `${newHeight}ft x ${newWidth}ft` : "",
      }));
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
            {/* Vehicle Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Type
              </label>
              <select
                value={formData.vehicle_type}
                onChange={(e) =>
                  setFormData({ ...formData, vehicle_type: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                required
              >
                <option value="" disabled>
                  Select vehicle type
                </option>
                {vehicleTypesData?.data?.map(
                  (type: { id: number; vehicle_type: string }) => (
                    <option key={type.id} value={type.vehicle_type}>
                      {type.vehicle_type}
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* Vehicle Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Name
              </label>
              <input
                type="text"
                name="vehicle_name"
                value={formData.vehicle_name}
                onChange={(e) =>
                  setFormData({ ...formData, vehicle_name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="e.g. Toyota Prado"
                required
              />
            </div>

            {/* ✅ Vehicle Description - New Full Width Field */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Description
              </label>
              <textarea
                name="vehicle_desc"
                value={formData.vehicle_desc}
                onChange={(e) =>
                  setFormData({ ...formData, vehicle_desc: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-20"
                placeholder="Write vehicle description here..."
                required
              />
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

            {/* Dimensions */}
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
          <div className="mb-6 flex flex-wrap gap-6 p-4 rounded-lg mt-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  handleSwitchChange("isActive", checked)
                }
                className={trackClassActive}
              />
              <span
                className={`text-sm font-semibold ${formData.isActive ? "text-green-700" : "text-gray-500"}`}
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
                className={`text-sm font-semibold ${formData.peak_pricing ? "text-green-700" : "text-gray-500"}`}
              >
                {formData.peak_pricing
                  ? "Peak Pricing Enabled"
                  : "Peak Pricing Disabled"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
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
