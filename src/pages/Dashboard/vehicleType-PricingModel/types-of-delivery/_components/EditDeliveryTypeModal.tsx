import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { 
  useGetVehicleTypesQuery 
} from "@/redux/features/vehicleType/vehicleTypeApi";
import toast from "react-hot-toast";
import DeliveryTypeIconPicker from "./DeliveryTypeIconPicker";

interface EditDeliveryTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData: any;
}

const EditDeliveryTypeModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: EditDeliveryTypeModalProps) => {
  const { data: vehicleTypesRes } = useGetVehicleTypesQuery("");
  const vehicleTypes = vehicleTypesRes?.data?.data || [];

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price_multiplier: 1,
    collection_time: 0,
    collection_unit: "MINUTES",
    delivery_time: 0,
    delivery_unit: "MINUTES",
    expiry_timeout: 0,
    expiry_unit: "MINUTES",
    allow_stack: false,
    extra_stop_surcharge: 0,
    priority: 1,
    vehicle_type_ids: [] as number[],
    is_active: true,
    icon: "",
  });

  useEffect(() => {
    if (initialData) {
      const vehicleTypeIds = initialData.vehicle_types?.map((vt: any) => vt.vehicle_type_id) || [];
      
      setFormData({
        id: initialData.id,
        name: initialData.name,
        description: initialData.description,
        price_multiplier: parseFloat(initialData.price_multiplier) || 0,
        collection_time: initialData.collection_time,
        collection_unit: initialData.collection_unit,
        delivery_time: initialData.delivery_time,
        delivery_unit: initialData.delivery_unit,
        expiry_timeout: initialData.expiry_timeout ?? 0,
        expiry_unit: initialData.expiry_unit || "MINUTES",
        allow_stack: initialData.allow_stack,
        extra_stop_surcharge: parseFloat(initialData.extra_stop_surcharge) || 0,
        priority: initialData.priority,
        vehicle_type_ids: vehicleTypeIds,
        is_active: initialData.is_active,
        icon: initialData.icon || "",
      });
    }
  }, [initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleVehicleTypeChange = (id: number) => {
    setFormData((prev) => {
      const exists = prev.vehicle_type_ids.includes(id);
      if (exists) {
        return {
          ...prev,
          vehicle_type_ids: prev.vehicle_type_ids.filter((vId) => vId !== id),
        };
      } else {
        return {
          ...prev,
          vehicle_type_ids: [...prev.vehicle_type_ids, id],
        };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priorityVal = Number(formData.priority) || 0;
    if (priorityVal > 10) {
      toast.error("Priority cannot be greater than 10");
      return;
    }
    if (priorityVal < 1) {
      toast.error("Priority cannot be less than 1");
      return;
    }
    if (formData.vehicle_type_ids.length === 0) {
      toast.error("Please select at least one vehicle type.");
      return;
    }

    const submitData = {
      id: formData.id,
      name: formData.name,
      description: formData.description,
      price_multiplier: Number(formData.price_multiplier) || 0,
      collection_time: Number(formData.collection_time) || 0,
      collection_unit: formData.collection_unit,
      delivery_time: Number(formData.delivery_time) || 0,
      delivery_unit: formData.delivery_unit,
      expiry_timeout: Number(formData.expiry_timeout) || 0,
      expiry_unit: formData.expiry_unit,
      allow_stack: formData.allow_stack,
      extra_stop_surcharge: Number(formData.extra_stop_surcharge) || 0,
      priority: priorityVal,
      vehicle_type_ids: formData.vehicle_type_ids,
      is_active: formData.is_active,
      icon: formData.icon,
    };

    onSubmit(submitData);
    onClose();
  };

  if (!isOpen || !initialData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Delivery Type</h2>
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
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Multiplier
              </label>
              <input
                type="number"
                step="0.01"
                name="price_multiplier"
                value={formData.price_multiplier}
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
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[60px]"
                required
              />
            </div>

            <div className="md:col-span-2">
              <DeliveryTypeIconPicker
                selectedIcon={formData.icon}
                onChange={(iconName) =>
                  setFormData((prev) => ({ ...prev, icon: iconName }))
                }
              />
            </div>

            <div className="col-span-2 space-y-4">
              {/* Collection Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Time
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    name="collection_time"
                    value={formData.collection_time}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <select
                    name="collection_unit"
                    value={formData.collection_unit}
                    onChange={handleInputChange}
                    className="w-28 px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="MINUTES">Min</option>
                    <option value="HOURS">Hours</option>
                  </select>
                </div>
              </div>

              {/* Delivery Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Time
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    name="delivery_time"
                    value={formData.delivery_time}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <select
                    name="delivery_unit"
                    value={formData.delivery_unit}
                    onChange={handleInputChange}
                    className="w-28 px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="MINUTES">Min</option>
                    <option value="HOURS">Hours</option>
                  </select>
                </div>
              </div>

              {/* Expiry Timeout */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Timeout
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    name="expiry_timeout"
                    value={formData.expiry_timeout}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="0"
                    required
                  />
                  <select
                    name="expiry_unit"
                    value={formData.expiry_unit}
                    onChange={handleInputChange}
                    className="w-28 px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="MINUTES">Min</option>
                    <option value="HOURS">Hours</option>
                  </select>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  How long an unassigned order remains active after pickup time.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <input
                type="number"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Extra Stop Surcharge
              </label>
              <input
                type="number"
                step="0.01"
                name="extra_stop_surcharge"
                value={formData.extra_stop_surcharge}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Vehicle Types Multi-select */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Applicable Vehicle Types
              </label>
              <div className="flex flex-wrap gap-3">
                {vehicleTypes.map((vt: any) => (
                  <label
                    key={vt.id}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${
                      formData.vehicle_type_ids.includes(vt.id)
                        ? "bg-yellow-100 border-yellow-400 text-yellow-800"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      hidden
                      checked={formData.vehicle_type_ids.includes(vt.id)}
                      onChange={() => handleVehicleTypeChange(vt.id)}
                    />
                    <span className="text-sm font-medium">{vt.vehicle_name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 py-4 border-t border-b">
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(val) =>
                  setFormData({ ...formData, is_active: val })
                }
              />
              <span className="text-sm font-semibold">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.allow_stack}
                onCheckedChange={(val) =>
                  setFormData({ ...formData, allow_stack: val })
                }
              />
              <span className="text-sm font-semibold">Allow Stackable</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#FFCC00] rounded-md font-bold hover:bg-[#FFD700] cursor-pointer"
            >
              Update Delivery Type
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDeliveryTypeModal;
