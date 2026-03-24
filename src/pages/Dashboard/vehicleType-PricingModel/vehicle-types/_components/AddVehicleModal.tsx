/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const AddVehicleModal = ({
  isOpen,
  onClose,
  onSubmit,
}: AddVehicleModalProps) => {
  const initialState = {
    vehicle_type: "",
    vehicle_name: "",
    vehicle_desc: "",
    base_price: 0,
    per_km_price: 0,
    peak_pricing: true,
    dimension_width: 0,
    dimension_height: 0,
    dimension_length: 0,
    max_load: 0,
    base_distance: 0,
    isActive: true,
  };

  const [formData, setFormData] = useState(initialState);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    // Logic to allow decimals like 0.40
    if (e.target.type === "text" || e.target.type === "number") {
      const regex = /^[0-9]*\.?[0-9]*$/;
      if (regex.test(value) || value === "") {
        setFormData((prev) => ({
          ...prev,
          [name]: value === "" ? 0 : parseFloat(value),
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(initialState);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add Vehicle Type</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Category
              </label>
              <select
                name="vehicle_type"
                value={formData.vehicle_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none"
                required
              >
                <option value="">Select category</option>
                <option value="BICYCLE">Bicycle</option>
                <option value="MOTORCYCLE">Motorcycle</option>
                <option value="CAR">Car</option>
                <option value="VAN">Van</option>
                <option value="TRUCK">Truck</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Type (Name)
              </label>
              <input
                type="text"
                name="vehicle_name"
                value={formData.vehicle_name}
                onChange={(e) =>
                  setFormData({ ...formData, vehicle_name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g. SUV, 10ft Lorry"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="vehicle_desc"
                value={formData.vehicle_desc}
                onChange={(e) =>
                  setFormData({ ...formData, vehicle_desc: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[60px]"
                required
              />
            </div>

            {/* Pricing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Fare ($)
              </label>
              <input
                type="text"
                name="base_price"
                value={formData.base_price || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="10.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Per KM Fee ($)
              </label>
              <input
                type="text"
                name="per_km_price"
                value={formData.per_km_price || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="0.40"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Distance (Km)
              </label>
              <input
                type="text"
                name="base_distance"
                value={formData.base_distance || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Load (kg)
              </label>
              <input
                type="text"
                name="max_load"
                value={formData.max_load || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="300"
                required
              />
            </div>

            {/* Dimensions in Meters */}
            <div className="md:col-span-2 grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Height (m)
                </label>
                <input
                  type="text"
                  name="dimension_height"
                  value={formData.dimension_height || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="1.5"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Width (m)
                </label>
                <input
                  type="text"
                  name="dimension_width"
                  value={formData.dimension_width || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="1.8"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Length (m)
                </label>
                <input
                  type="text"
                  name="dimension_length"
                  value={formData.dimension_length || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="4.5"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 py-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(val) =>
                  setFormData({ ...formData, isActive: val })
                }
              />
              <span className="text-sm font-semibold">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.peak_pricing}
                onCheckedChange={(val) =>
                  setFormData({ ...formData, peak_pricing: val })
                }
              />
              <span className="text-sm font-semibold">Peak Pricing</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#FFCC00] rounded-md font-bold hover:bg-[#FFD700]"
            >
              Create Vehicle Type
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicleModal;
