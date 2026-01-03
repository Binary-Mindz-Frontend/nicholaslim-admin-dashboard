import React from "react";
import { X } from "lucide-react";

// Import the permissions constants from your existing file
import {
  ALL_PERMISSIONS,
  FRONTEND_TO_BACKEND_MODULES,
  MODULE_ACTIONS,
} from "@/pages/Admin/AddRemovePermission/AddRemovePermission";

interface Permission {
  module: string;
  action: string;
}

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  permissions: Permission[];
  onUpdatePermissions: (permissions: Permission[]) => void;
  roleName: string;
  isLoading?: boolean;
}

const PermissionsModal: React.FC<PermissionsModalProps> = ({
  isOpen,
  onClose,
  permissions,
  roleName,
  isLoading = false,
}) => {
  const [selectedPermissions, setSelectedPermissions] =
    React.useState<Permission[]>(permissions);

  React.useEffect(() => {
    setSelectedPermissions(permissions);
  }, [permissions]);

  const isModuleSelected = (permissionName: string) => {
    const backendModule = FRONTEND_TO_BACKEND_MODULES[permissionName];
    const moduleActions = MODULE_ACTIONS[backendModule] || [];
    const currentModulePermissions = selectedPermissions.filter(
      (p) => p.module === backendModule
    );
    return currentModulePermissions.length === moduleActions.length;
  };

  const isModulePartiallySelected = (permissionName: string) => {
    const backendModule = FRONTEND_TO_BACKEND_MODULES[permissionName];
    const moduleActions = MODULE_ACTIONS[backendModule] || [];
    const currentModulePermissions = selectedPermissions.filter(
      (p) => p.module === backendModule
    );
    return (
      currentModulePermissions.length > 0 &&
      currentModulePermissions.length < moduleActions.length
    );
  };

  const getSelectedModuleCount = () => {
    const selectedModules = new Set();
    selectedPermissions.forEach((p) => {
      selectedModules.add(p.module);
    });
    return selectedModules.size;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              View Permissions - {roleName}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {getSelectedModuleCount()} modules selected (Read-only view)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ALL_PERMISSIONS.map((permission) => {
              const isSelected = isModuleSelected(permission);
              const isPartial = isModulePartiallySelected(permission);

              let bgColor = "bg-gray-50";
              let borderColor = "border-gray-200";
              let textColor = "text-gray-800";

              if (isSelected) {
                bgColor = "bg-yellow-50";
                borderColor = "border-yellow-300";
                textColor = "text-yellow-800";
              } else if (isPartial) {
                bgColor = "bg-yellow-50";
                borderColor = "border-yellow-300";
                textColor = "text-yellow-800";
              }

              return (
                <div
                  key={permission}
                  className={`border rounded-lg p-4 transition-all duration-200 ${bgColor} ${borderColor}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium ${textColor}`}>{permission}</h3>
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          isSelected
                            ? "bg-yellow-400 border-yellow-400"
                            : isPartial
                            ? "bg-yellow-500 border-yellow-500"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        {isSelected ? (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          isPartial && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionsModal;
