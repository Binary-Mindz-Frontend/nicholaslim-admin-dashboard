import { FRONTEND_TO_BACKEND_MODULES, MODULE_ACTIONS } from "@/pages/Admin/AddRemovePermission/AddRemovePermission";
import React from "react";

interface PermissionsGridProps {
  permissions: string[];
  selectedPermissions: Array<{ module: string; action: string }>;
  onPermissionToggle: (permission: string) => void;
  isLoading: boolean;
}

const PermissionsGrid: React.FC<PermissionsGridProps> = ({
  permissions,
  selectedPermissions,
  onPermissionToggle,
  isLoading,
}) => {
  const isModuleSelected = (frontendModule: string) => {
    const backendModule = FRONTEND_TO_BACKEND_MODULES[frontendModule];
    const moduleActions = MODULE_ACTIONS[backendModule] || [];

    if (moduleActions.length === 0) return false;

    const selectedActions = selectedPermissions
      .filter((p) => p.module === backendModule)
      .map((p) => p.action);

    return moduleActions.every((action) => selectedActions.includes(action));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
      {permissions.map((permission) => {
        const backendModule = FRONTEND_TO_BACKEND_MODULES[permission];
        const moduleActions = MODULE_ACTIONS[backendModule] || [];
        const isSelected = isModuleSelected(permission);
        const hasActions = moduleActions.length > 0;

        return (
          <label
            key={permission}
            className={`flex items-center justify-between px-4 py-3 rounded cursor-pointer transition-all border ${
              isSelected
                ? "bg-yellow-400 border-yellow-500"
                : "bg-yellow-50 border-[#6B6B6B] hover:bg-yellow-100"
            } ${!hasActions ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <span className="text-gray-800 font-medium">{permission}</span>
            {hasActions ? (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onPermissionToggle(permission)}
                className="w-5 h-5 cursor-pointer"
                disabled={isLoading}
              />
            ) : (
              <div className="w-5 h-5 border border-gray-400 rounded bg-gray-200"></div>
            )}
          </label>
        );
      })}
    </div>
  );
};

export default PermissionsGrid;