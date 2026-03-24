/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";

interface EditVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData: any;
}

const EditVehicleModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: EditVehicleModalProps) => {
  const [formData, setFormData] = useState({
    id: "",
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
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        // Ensure numbers are properly typed for the inputs
        base_price: parseFloat(initialData.base_price) || 0,
        per_km_price: parseFloat(initialData.per_km_price) || 0,
        max_load: parseFloat(initialData.max_load) || 0,
        base_distance: parseFloat(initialData.base_distance) || 0,
        dimension_width: parseFloat(initialData.dimension_width) || 0,
        dimension_height: parseFloat(initialData.dimension_height) || 0,
        dimension_length: parseFloat(initialData.dimension_length) || 0,
      });
    }
  }, [initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    const regex = /^[0-9]*\.?[0-9]*$/;

    // Specific handling for numeric fields to allow decimals like 0.40
    if (
      e.target.type === "text" &&
      name !== "vehicle_name" &&
      name !== "vehicle_type"
    ) {
      if (regex.test(value) || value === "") {
        setFormData((prev) => ({
          ...prev,
          [name]: value === "" ? 0 : value, // Keep as string while typing to allow "0."
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      base_price: parseFloat(formData.base_price as any),
      per_km_price: parseFloat(formData.per_km_price as any),
      max_load: parseFloat(formData.max_load as any),
      base_distance: parseFloat(formData.base_distance as any),
      dimension_width: parseFloat(formData.dimension_width as any),
      dimension_height: parseFloat(formData.dimension_height as any),
      dimension_length: parseFloat(formData.dimension_length as any),
    };
    onSubmit(submitData);
  };

  if (!isOpen || !initialData) return null;

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

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Category
            </label>
            <select
              name="vehicle_type"
              value={formData.vehicle_type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="BICYCLE">Bicycle</option>
              <option value="MOTORCYCLE">Motorcycle</option>
              <option value="CAR">Car</option>
              <option value="VAN">Van</option>
              <option value="TRUCK">Truck</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Name
            </label>
            <input
              type="text"
              name="vehicle_name"
              value={formData.vehicle_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base Fare ($)
            </label>
            <input
              type="text"
              name="base_price"
              value={formData.base_price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
              value={formData.per_km_price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g. 0.40"
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
              value={formData.base_distance}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
              value={formData.max_load}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="md:col-span-2 grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Height (m)
              </label>
              <input
                type="text"
                name="dimension_height"
                value={formData.dimension_height}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Width (m)
              </label>
              <input
                type="text"
                name="dimension_width"
                value={formData.dimension_width}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Length (m)
              </label>
              <input
                type="text"
                name="dimension_length"
                value={formData.dimension_length}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="md:col-span-2 flex gap-6 py-2">
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

          <div className="md:col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#FFCC00] rounded-md font-medium"
            >
              Update Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVehicleModal;
