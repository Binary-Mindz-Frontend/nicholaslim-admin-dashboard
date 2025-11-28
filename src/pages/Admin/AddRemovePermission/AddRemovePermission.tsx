"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface PermissionFormData {
  role: string;
  permissions: string[];
}

const ALL_PERMISSIONS = [
  "Users",
  "Drivers",
  "Order",
  "Live Map/ Fleet Tracking",
  "Support & Dispute",
  "Payments & Transactions",
  "Notifications & Communication",
  "Report Analytics",
  "Vehicle Type & Pricing Management",
  "Wallet Management",
  "Coin System",
  "Quiz",
  "Advertisement",
  "Platform fee",
  "Content Management",
  "Driver Order Competition",
  "Customer Order Confirmation",
  "Order Placement",
];

export default function AddRemovePermission() {
  const [formData, setFormData] = useState<PermissionFormData>({
    role: "Finance",
    permissions: ["Payments & Transactions", "Report Analytics", "Wallet Management", "Coin System", "Platform fee"]
  });

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, role: e.target.value });
  };

  const togglePermission = (permission: string) => {
    setFormData((prev) => {
      const alreadySelected = prev.permissions.includes(permission);
      return {
        ...prev,
        permissions: alreadySelected
          ? prev.permissions.filter((p) => p !== permission)
          : [...prev.permissions, permission],
      };
    });
  };

  const handleSubmit = () => {
    console.log("Role:", formData.role);
    console.log("Permissions:", formData.permissions);
    alert("Permissions updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-semibold text-gray-800 pt-2 sm:pt-0 mb-6">
        Add/Remove Permission
      </h1>

      <div className="bg-white rounded-xl shadow-sm p-6 sm:px-9 lg:px-36 lg:p-10">

        {/* Select Role */}
        <div className="mb-10">
          <label className="block text-gray-600 font-medium mb-3 text-lg">
            Select Role
          </label>
          <div className="relative w-full ">
            <select
              name="role"
              value={formData.role}
              onChange={handleRoleChange}
              className="w-full px-4 py-3 bg-[#EBEBEB] border-0  rounded-md text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer"
            >
              <option value="Finance">Finance</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Support">Support</option>
              <option value="Operations">Operations</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-800 pointer-events-none" />
          </div>
        </div>

        {/* Permissions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
          {ALL_PERMISSIONS.map((permission) => (
            <label
              key={permission}
              className="flex items-center justify-between px-4 py-3 bg-yellow-50 rounded cursor-pointer hover:bg-yellow-100 transition-all border border-[#6B6B6B]"
            >
              <span className="text-gray-800 font-medium">{permission}</span>
              <input
                type="checkbox"
                checked={formData.permissions.includes(permission)}
                onChange={() => togglePermission(permission)}
                className="w-5 h-5 cursor-pointer"
              />
            </label>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="px-12 py-3 bg-yellow-400 cursor-pointer font-bold hover:bg-yellow-500 text-black rounded transition-colors"
          >
            Add Now
          </button>
        </div>
      </div>
    </div>
  );
}
