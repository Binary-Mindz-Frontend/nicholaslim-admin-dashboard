import {
  DISPUTE_ROLE_OPTIONS,
  PREDEFINED_DISPUTES,
} from "@/types/disputeOptions";
import React, { useState, useEffect } from "react";

interface DisputeTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  initialData?: any;
}

export default function DisputeTypeModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: DisputeTypeModalProps) {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");

  // Reset name if role changes
  useEffect(() => {
    setName("");
  }, [role]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, role });
    setRole("");
    setName("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">Add New Dispute Type</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Select Role
            </label>
            <select
              className="w-full border p-2 rounded-md"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select Role</option>
              {DISPUTE_ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Name Selection (Conditional) */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Dispute Name
            </label>
            <select
              className="w-full border p-2 rounded-md disabled:bg-gray-100"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!role}
              required
            >
              <option value="">Select Dispute Type</option>
              {role &&
                PREDEFINED_DISPUTES[
                  role as keyof typeof PREDEFINED_DISPUTES
                ].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !name}
              className="px-4 py-2 bg-[#FFCC00] rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-[#FFD700] transition-colors text-black flex items-center"
            >
              {isLoading ? "Saving..." : "Create Dispute"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
