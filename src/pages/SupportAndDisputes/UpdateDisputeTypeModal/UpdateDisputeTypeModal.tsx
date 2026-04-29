import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { PREDEFINED_DISPUTES } from "@/types/disputeOptions";

interface UpdateDisputeTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  initialData?: any;
}

export default function UpdateDisputeTypeModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
}: UpdateDisputeTypeModalProps) {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (initialData) {
      setRole(initialData?.role || "");
      setName(initialData?.name || "");
      setIsActive(initialData?.isActive ?? true);
    } else {
      setRole("");
      setName("");
      setIsActive(true);
    }
  }, [initialData, isOpen]);

  // Helper function to check if a name exists in predefined list for given role
  const isNameInPredefinedList = (roleValue: string, nameValue: string) => {
    if (!roleValue || !nameValue) return false;
    const predefinedList =
      PREDEFINED_DISPUTES[roleValue as keyof typeof PREDEFINED_DISPUTES];
    if (!predefinedList) return false;

    // Case-insensitive comparison
    return predefinedList.some(
      (item) => item.toLowerCase() === nameValue.toLowerCase(),
    );
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      role,
      name,
      isActive,
    //   priority: "LOW",
    };
    onSubmit(payload);
  };

  // Get the display name that matches the predefined list case
  const getMatchingPredefinedName = () => {
    if (!role || !name) return name;
    const predefinedList =
      PREDEFINED_DISPUTES[role as keyof typeof PREDEFINED_DISPUTES];
    if (!predefinedList) return name;

    const match = predefinedList.find(
      (item) => item.toLowerCase() === name.toLowerCase(),
    );
    return match || name;
  };

  const displayName = getMatchingPredefinedName();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Update Dispute Type
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Role Selection - Disabled in update mode */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Role
            </label>
            <div className="w-full h-11 border border-gray-300 rounded-lg px-3 bg-gray-50 flex items-center text-gray-600">
              {role === "USER" ? "User" : role === "DRIVER" ? "Driver" : role}
            </div>
            <input type="hidden" name="role" value={role} />
          </div>

          {/* Name Selection - Show current value first */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Dispute Name
            </label>
            <select
              value={displayName}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent outline-none transition-all"
              required
            >
              <option value={displayName}>
                {displayName || "Select dispute reason..."}
              </option>
              {role &&
                PREDEFINED_DISPUTES[
                  role as keyof typeof PREDEFINED_DISPUTES
                ]?.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
            </select>
            {displayName && !isNameInPredefinedList(role, name) && (
              <p className="text-xs text-amber-600 mt-1">
                Note: "{name}" is not in the predefined list. Select from
                dropdown to change.
              </p>
            )}
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700">
              Status
            </label>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">Inactive</span>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isActive ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isActive ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-sm text-gray-500">Active</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 px-4 border border-gray-300 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !name || !role}
              className="flex-1 h-11 px-4 bg-[#FFCC00] hover:bg-[#E6B800] disabled:bg-gray-200 disabled:text-gray-400 text-black font-bold cursor-pointer rounded-lg transition-all"
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
