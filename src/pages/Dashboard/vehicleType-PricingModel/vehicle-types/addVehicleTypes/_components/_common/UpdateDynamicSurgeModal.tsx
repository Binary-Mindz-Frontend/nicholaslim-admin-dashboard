import { useState, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

interface UpdateDynamicSurgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  rule: any;
  onUpdate: (id: string | number, data: any) => Promise<any>;
}

export const UpdateDynamicSurgeModal: React.FC<
  UpdateDynamicSurgeModalProps
> = ({ isOpen, onClose, rule, onUpdate }) => {
  const [formData, setFormData] = useState({
    role_name: "",
    price_multiplier: "",
    condition: "",
    time_range: "",
    applicable_user: "RAIDER",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (rule) {
      setFormData({
        role_name: rule.role_name || "",
        price_multiplier: rule.price_multiplier?.toString() || "",
        condition: rule.condition || "",
        time_range: rule.time_range || "",
        applicable_user: rule.applicable_user || "RAIDER",
      });
    }
  }, [rule]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rule?.id) {
      toast.error("No rule selected");
      return;
    }

    // Validate form
    if (!formData.role_name.trim()) {
      toast.error("Role name is required");
      return;
    }

    if (
      !formData.price_multiplier ||
      parseFloat(formData.price_multiplier) <= 0
    ) {
      toast.error("Valid price multiplier is required");
      return;
    }

    if (!formData.condition.trim()) {
      toast.error("Condition is required");
      return;
    }

    setIsLoading(true);
    try {
      const updateData = {
        ...formData,
        price_multiplier: parseFloat(formData.price_multiplier),
      };

      await onUpdate(rule.id, updateData);
      toast.success("Dynamic surge rule updated successfully");
      onClose();
    } catch (error: any) {
      console.error("Failed to update rule:", error);
      toast.error(
        error?.data?.message || "Failed to update dynamic surge rule"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50000 overflow-y-auto">
      <div className="flex items-center justify-center min-h-[70vh] px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Modal panel */}
        <div className="inline-block w-full max-w-md p-8 my-20 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-3xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Update Dynamic Surge Rule
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer"
              disabled={isLoading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role Name
              </label>
              <input
                type="text"
                name="role_name"
                value={formData.role_name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="e.g., Peak Hours"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Multiplier
              </label>
              <input
                type="number"
                name="price_multiplier"
                value={formData.price_multiplier}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="e.g., 2.0"
                step="0.1"
                min="0"
                required
                disabled={isLoading}
              />
              <p className="mt-1 text-sm text-gray-500">
                Multiplier for base price (e.g., 2 = 2x base price)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-yellow-500 focus:border-yellow-500"
                required
                disabled={isLoading}
              >
                <option value="">Select Condition</option>
                <option value="HIGH_DEMAND">High Demand</option>
                <option value="LOW_SUPPLY">Low Supply</option>
                <option value="WEATHER">Bad Weather</option>
                <option value="HOLIDAY">Holiday</option>
                <option value="PEAK_HOURS">Peak Hours</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Range
              </label>
              <input
                type="text"
                name="time_range"
                value={formData.time_range}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="e.g., 10:20 AM - 12:30 PM"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Applicable User
              </label>
              <select
                name="applicable_user"
                value={formData.applicable_user}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-yellow-500 focus:border-yellow-500"
                required
                disabled={isLoading}
              >
                <option value="RAIDER">Raider</option>
                <option value="USER">User</option>
              </select>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  "Update Rule"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
