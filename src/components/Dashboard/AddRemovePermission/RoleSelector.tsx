import React from "react";
import { ChevronDown } from "lucide-react";
import { Role } from "@/types/roleBasedAccessControlType";

interface RoleSelectorProps {
  roles: Role[];
  selectedRoleId: string;
  onRoleChange: (roleId: string) => void;
  isLoading: boolean;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({
  roles,
  selectedRoleId,
  onRoleChange,
  isLoading,
}) => {
  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-3">
        <label className="block text-gray-600 font-medium text-lg">
          Select Role
        </label>
      </div>
      <div className="relative w-full">
        <select
          name="role"
          value={selectedRoleId}
          onChange={(e) => onRoleChange(e.target.value)}
          className="w-full px-4 py-3 bg-[#EBEBEB] border-0 rounded-md text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer"
          disabled={isLoading}
        >
          <option value="">Select a role</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id.toString()}>
              {role.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-800 pointer-events-none" />
      </div>
    </div>
  );
};

export default RoleSelector;