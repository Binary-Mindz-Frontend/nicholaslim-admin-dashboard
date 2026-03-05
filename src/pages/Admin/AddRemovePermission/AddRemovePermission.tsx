/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect } from "react";
import {
  useGetRoleBasedAccessControlQuery,
  useUpdateRoleBasedAccessControlMutation,
} from "@/redux/features/roleBasedAccessControl/roleBasedAccessControlApi";
import { toast } from "react-hot-toast";
import { PermissionFormData, Role } from "@/types/roleBasedAccessControlType";
import RoleSelector from "@/components/Dashboard/AddRemovePermission/RoleSelector";
import { ChevronDown, ChevronRight, Save, Check, Minus, Search, X } from "lucide-react";

// Import menu items and mapping
import { menuItems, MenuItem } from "@/components/Shared/Sidebar/MenuItems";
import {
  menuToPermissionMapping,
} from "@/utils/permissionMapping";

interface Permission {
  module: string;
  action: string;
}

interface MenuNode {
  id: string;
  label: string;
  children?: MenuNode[];
  parentId?: string;
  route?: string;
  level?: number;
}

// Build menu tree
const buildMenuTree = (
  items: MenuItem[],
  parentId?: string,
  level: number = 0,
): MenuNode[] => {
  return items
    .filter((item) => item.id !== "login" && item.id !== "")
    .map((item) => ({
      id: item.id,
      label: item.label,
      parentId,
      route: item.route,
      level,
      children: item.children
        ? buildMenuTree(item.children, item.id, level + 1)
        : undefined,
    }));
};

const MENU_TREE = buildMenuTree(menuItems);

// Get all backend modules for a menu item (including children recursively)
const getAllBackendModulesForMenuItem = (menuId: string): string[] => {
  // Direct modules from mapping
  const directModules = menuToPermissionMapping[menuId] || [];

  // Find modules from children in menu tree
  const findChildModules = (nodes: MenuNode[], targetId: string): string[] => {
    for (const node of nodes) {
      if (node.id === targetId) {
        const childModules: string[] = [];

        if (node.children) {
          const collectModules = (childNodes: MenuNode[]) => {
            for (const child of childNodes) {
              childModules.push(...(menuToPermissionMapping[child.id] || []));

              if (child.children) {
                collectModules(child.children);
              }
            }
          };
          collectModules(node.children);
        }

        return childModules;
      }

      if (node.children) {
        const result = findChildModules(node.children, targetId);
        if (result.length > 0) return result;
      }
    }
    return [];
  };

  const childModules = findChildModules(MENU_TREE, menuId);

  // Combine all modules and remove duplicates
  return [
    ...new Set([
      ...directModules,
      ...childModules,
    ]),
  ];
};

// Extract all unique modules currently mapped in the menu tree to prevent ghost permissions
const ALL_ACTIVE_TREE_MODULES = new Set<string>();
MENU_TREE.forEach(node => {
  getAllBackendModulesForMenuItem(node.id).forEach(mod => ALL_ACTIVE_TREE_MODULES.add(mod));
});

// Get all permissions for a menu item (including children)
const getAllPermissionsForMenuItem = (menuId: string): Permission[] => {
  const backendModules = getAllBackendModulesForMenuItem(menuId);
  const permissions: Permission[] = [];

  for (const module of backendModules) {
    const actions = MODULE_ACTIONS[module] || [];
    actions.forEach((action) => {
      permissions.push({ module, action });
    });
  }

  return permissions;
};

// Check if menu item has any permissions
const hasAnyPermission = (
  menuId: string,
  selectedPermissions: Permission[],
): boolean => {
  const backendModules = getAllBackendModulesForMenuItem(menuId);

  for (const module of backendModules) {
    const hasModulePermission = selectedPermissions.some(
      (p) => p.module === module,
    );
    if (hasModulePermission) return true;
  }

  return false;
};

// Check if all modules for this menu item have all their actions
const hasAllPermissions = (
  menuId: string,
  selectedPermissions: Permission[],
): boolean => {
  const backendModules = getAllBackendModulesForMenuItem(menuId);

  for (const module of backendModules) {
    const requiredActions = MODULE_ACTIONS[module] || [];
    const actualPermissions = selectedPermissions.filter(
      (p) => p.module === module,
    );

    if (actualPermissions.length !== requiredActions.length) {
      return false;
    }
  }

  return backendModules.length > 0;
};

// Check if some (but not all) modules have permissions
const hasPartialPermissions = (
  menuId: string,
  selectedPermissions: Permission[],
): boolean => {
  const backendModules = getAllBackendModulesForMenuItem(menuId);
  let hasSomePermission = false;
  let hasAllPermission = true;

  for (const module of backendModules) {
    const requiredActions = MODULE_ACTIONS[module] || [];
    const actualPermissions = selectedPermissions.filter(
      (p) => p.module === module,
    );

    if (actualPermissions.length > 0) {
      hasSomePermission = true;
    }

    if (actualPermissions.length !== requiredActions.length) {
      hasAllPermission = false;
    }
  }

  return hasSomePermission && !hasAllPermission && backendModules.length > 0;
};

// Professional Checkbox Component with Material Design
const CustomCheckbox: React.FC<{
  checked: boolean;
  indeterminate?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}> = ({ checked, indeterminate, onChange, disabled, className, size = "md" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const iconSizes = {
    sm: "w-2.5 h-2.5",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  return (
    <div className={`relative inline-flex items-center ${className || ''}`}>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <div
        className={`
          ${sizeClasses[size]} rounded border-2 flex items-center justify-center transition-all duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
          ${checked || indeterminate
            ? 'bg-primary-600 border-primary-600 shadow-md'
            : 'bg-white border-gray-300 hover:border-primary-400 hover:shadow-sm'
          }
        `}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) {
            const syntheticEvent = {
              target: { checked: !checked },
              stopPropagation: () => { },
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(syntheticEvent);
          }
        }}
      >
        {checked && !indeterminate && (
          <Check className={`${iconSizes[size]} text-white stroke-3`} />
        )}
        {indeterminate && (
          <Minus className={`${iconSizes[size]} text-white stroke-3`} />
        )}
      </div>
    </div>
  );
};

// MenuTreeItem component with professional styling
const MenuTreeItem: React.FC<{
  node: MenuNode;
  selectedPermissions: Permission[];
  onToggle: (menuId: string, checked: boolean) => void;
  expandedNodes: Set<string>;
  onToggleExpand: (nodeId: string) => void;
  searchTerm?: string;
}> = ({
  node,
  selectedPermissions,
  onToggle,
  expandedNodes,
  onToggleExpand,
  searchTerm = "",
}) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);

    const hasPermission = hasAnyPermission(node.id, selectedPermissions);
    const hasAll = hasAllPermissions(node.id, selectedPermissions);
    const hasPartial = hasPartialPermissions(node.id, selectedPermissions);

    // Highlight search term
    const highlightText = (text: string) => {
      if (!searchTerm) return text;
      const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
      return parts.map((part, i) =>
        part.toLowerCase() === searchTerm.toLowerCase() ?
          <span key={i} className="bg-yellow-200 font-medium">{part}</span> : part
      );
    };

    const getCheckboxState = () => {
      if (hasAll) return "checked";
      if (hasPartial) return "indeterminate";
      return "unchecked";
    };

    const checkboxState = getCheckboxState();

    const handleToggle = () => {
      if (hasChildren) {
        onToggleExpand(node.id);
      }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      onToggle(node.id, e.target.checked);
    };

    const marginLeft = node.level ? `${node.level * 1.5}rem` : "0";

    // Background color based on state
    let bgColor = "bg-white";
    let borderColor = "border-gray-200";
    let textColor = "text-gray-700";

    if (hasAll) {
      bgColor = "bg-green-50";
      borderColor = "border-green-200";
    } else if (hasPartial) {
      bgColor = "bg-primary-50";
      borderColor = "border-primary-200";
    }

    return (
      <div className="select-none">
        <div
          className={`
          flex items-center py-2.5 px-3 rounded-xl transition-all duration-200
          ${bgColor} ${borderColor} border
          hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm
          ${hasChildren ? 'cursor-pointer' : ''}
        `}
          style={{ marginLeft }}
          onClick={handleToggle}
        >
          <div className="flex items-center flex-1 min-w-0">
            {hasChildren && (
              <div className="mr-1 shrink-0">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </div>
            )}
            {!hasChildren && <div className="w-5 mr-1 shrink-0" />}

            <CustomCheckbox
              checked={checkboxState === "checked"}
              indeterminate={checkboxState === "indeterminate"}
              onChange={handleCheckboxChange}
              className="mr-3 shrink-0"
              size="md"
            />

            <span className={`flex-1 text-sm font-medium ${textColor} truncate`}>
              {highlightText(node.label)}
            </span>

            {hasPermission && (
              <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full shrink-0 font-medium">
                {getAllBackendModulesForMenuItem(node.id).length}
              </span>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-4 border-l-2 border-primary-100 pl-2 mt-1 space-y-1">
            {node.children?.map((child) => (
              <MenuTreeItem
                key={child.id}
                node={child}
                selectedPermissions={selectedPermissions}
                onToggle={onToggle}
                expandedNodes={expandedNodes}
                onToggleExpand={onToggleExpand}
                searchTerm={searchTerm}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

export default function AddRemovePermission() {
  const { data: roleData = [], isLoading: isLoadingRoles } =
    useGetRoleBasedAccessControlQuery({});

  const [updateRoleBasedAccessControl, { isLoading: isUpdating }] =
    useUpdateRoleBasedAccessControlMutation();

  const [formData, setFormData] = useState<PermissionFormData>({
    roleId: "",
    permissions: [],
  });

  const [localRoles, setLocalRoles] = useState<Role[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(["system-configuration", "admin"]), // Expanded by default
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (Array.isArray(roleData) && roleData.length > 0) {
      setLocalRoles(roleData);
      if (!hasInitialized) {
        setHasInitialized(true);
      }
    }
  }, [roleData, hasInitialized]);

  const nonStaticRoles = localRoles.filter((role) => !role.isStatic);

  useEffect(() => {
    if (nonStaticRoles.length > 0 && !formData.roleId) {
      const firstNonStaticRole = nonStaticRoles[0];
      setFormData({
        roleId: firstNonStaticRole.id.toString(),
        permissions: firstNonStaticRole.permissions
          .filter((p) => p.action && p.action.trim() !== "" && !!MODULE_ACTIONS[p.module] && ALL_ACTIVE_TREE_MODULES.has(p.module))
          .map((p) => ({
            module: p.module,
            action: p.action,
          })),
      });
    }
  }, [nonStaticRoles, formData.roleId]);

  const handleRoleChange = (roleId: string) => {
    const selectedRole = localRoles.find(
      (role) => role.id.toString() === roleId,
    );

    if (selectedRole) {
      setFormData({
        roleId,
        permissions: selectedRole.permissions
          .filter((p) => p.action && p.action.trim() !== "" && !!MODULE_ACTIONS[p.module] && ALL_ACTIVE_TREE_MODULES.has(p.module))
          .map((p) => ({
            module: p.module,
            action: p.action,
          })),
      });
    }
  };

  const handlePermissionToggle = (menuId: string, checked: boolean) => {
    const menuPermissions = getAllPermissionsForMenuItem(menuId);

    setFormData((prev) => {
      if (checked) {
        // Add all permissions for this menu item and its children
        const newPermissions = [...prev.permissions];
        menuPermissions.forEach((perm) => {
          const exists = prev.permissions.some(
            (p) => p.module === perm.module && p.action === perm.action,
          );
          if (!exists) {
            newPermissions.push(perm);
          }
        });
        return { ...prev, permissions: newPermissions };
      } else {
        // Remove all permissions for this menu item and its children
        const backendModules = getAllBackendModulesForMenuItem(menuId);
        return {
          ...prev,
          permissions: prev.permissions.filter(
            (p) => !backendModules.includes(p.module) && p.action && p.action.trim() !== "",
          ),
        };
      }
    });
  };

  const toggleExpand = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    const allNodes = new Set<string>();
    const collectNodes = (nodes: MenuNode[]) => {
      nodes.forEach(node => {
        allNodes.add(node.id);
        if (node.children) collectNodes(node.children);
      });
    };
    collectNodes(MENU_TREE);
    setExpandedNodes(allNodes);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  const handleSubmit = async () => {
    if (!formData.roleId) {
      toast.error("Please select a role");
      return;
    }

    const roleId = parseInt(formData.roleId);
    const loadingToast = toast.loading("Updating permissions...");

    try {
      const updateData = {
        id: roleId,
        permissions: formData.permissions.filter(p => p.action && p.action.trim() !== ""),
      };

      const response = await updateRoleBasedAccessControl(updateData).unwrap();

      toast.dismiss(loadingToast);
      toast.success(response?.message || "Permissions updated successfully!");

      setLocalRoles((prevRoles) =>
        prevRoles.map((role) =>
          role.id === roleId
            ? {
              ...role,
              permissions: formData.permissions.map((p) => ({
                id: Math.random(),
                module: p.module,
                action: p.action,
                roleId: roleId,
              })),
            }
            : role,
        ),
      );
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error?.data?.message || "Failed to update permissions");
    }
  };

  const getSelectedModuleCount = () => {
    const selectedModules = new Set();
    formData.permissions.forEach((p) => {
      selectedModules.add(p.module);
    });
    return selectedModules.size;
  };

  const getSelectedActionCount = () => {
    return formData.permissions.length;
  };

  // Filter menu items based on search
  const filterMenuItems = (nodes: MenuNode[], search: string): MenuNode[] => {
    if (!search) return nodes;

    return nodes.reduce((acc: MenuNode[], node) => {
      const matches = node.label.toLowerCase().includes(search.toLowerCase());

      if (node.children) {
        const filteredChildren = filterMenuItems(node.children, search);
        if (filteredChildren.length > 0) {
          acc.push({
            ...node,
            children: filteredChildren,
          });
        } else if (matches) {
          acc.push({ ...node, children: [] });
        }
      } else if (matches) {
        acc.push(node);
      }

      return acc;
    }, []);
  };

  const filteredMenuTree = searchTerm ? filterMenuItems(MENU_TREE, searchTerm) : MENU_TREE;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Role Permissions Manager
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
          <RoleSelector
            roles={nonStaticRoles}
            selectedRoleId={formData.roleId}
            onRoleChange={handleRoleChange}
            isLoading={isLoadingRoles || isUpdating}
          />

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Module Permissions
              </h2>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {getSelectedModuleCount()} modules • {getSelectedActionCount()} actions
                </span>
              </div>
            </div>

            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search modules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={expandAll}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAll}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Collapse All
                </button>
              </div>
            </div>

            {/* Info Box */}
            <div className="mb-4 p-4 bg-linear-to-r from-primary-50 to-blue-50 border border-primary-100 rounded-xl">
              <div className="flex items-start space-x-3">
                <div className="shrink-0 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-primary-800">
                    <span className="font-semibold">How it works:</span> Selecting a parent item grants all permissions for that section and its children. The number indicates total backend modules.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center shadow-sm">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs text-gray-600">Full access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-primary-500 rounded flex items-center justify-center shadow-sm">
                        <Minus className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs text-gray-600">Partial access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-white border-2 border-gray-300 rounded"></div>
                      <span className="text-xs text-gray-600">No access</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Permissions Tree */}
            <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
              <div className="max-h-[500px] overflow-y-auto p-4 space-y-1 custom-scrollbar">
                {filteredMenuTree.length > 0 ? (
                  filteredMenuTree.map((node) => (
                    <MenuTreeItem
                      key={node.id}
                      node={node}
                      selectedPermissions={formData.permissions}
                      onToggle={handlePermissionToggle}
                      expandedNodes={expandedNodes}
                      onToggleExpand={toggleExpand}
                      searchTerm={searchTerm}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    No modules found matching "{searchTerm}"
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={!formData.roleId || isUpdating || isLoadingRoles}
              className="px-12 py-3 bg-linear-to-r from-primary-500 to-primary-600 font-bold hover:from-primary-600 hover:to-primary-700 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {isUpdating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Updating Permissions...
                </>
              ) : (
                <>
                  <Save size={20} className="mr-3" />
                  Save Permission Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Module Actions configuration based on your enums
const MODULE_ACTIONS: Record<string, string[]> = {
  // Dashboard
  dashboard: ["read", "just_admin"],

  // User Management
  user: [
    "create",
    "read",
    "update",
    "delete",
    "get_user_profile",
    "update_user_profile",
    "update_user_role",
    "update_user_status",
    "just_admin",
  ],
  user_web: ["create", "read", "update", "delete", "just_admin"],
  user_mobile: ["create", "read", "update", "delete", "just_admin"],

  // Raider/Driver Management
  raider: [
    "create",
    "read",
    "update",
    "delete",
    "just_admin",
    "online_status_update",
    "order_compitition",
    "order_read_feed",
    "read_admin_my_raider",
  ],
  raider_join: ["create", "read", "update", "delete", "just_admin"],

  // Order Management
  order: [
    "create",
    "read",
    "update",
    "delete",
    "update_order_status",
    "get_order_details",
    "add_destination_to_order",
    "cancel_order",
    "decline_order",
    "order_read_mine",
    "order_compitition",
    "order_read_feed",
    "just_admin",
  ],

  // Payment & Transaction Management
  payment_transaction: [
    "create",
    "read",
    "update",
    "delete",
    "update_transaction_status",
    "update_transaction_amount",
    "approve_transaction",
    "refund_transaction",
    "just_admin",
  ],

  // Live Map/Fleet Tracking
  live_map: ["read", "just_admin"],

  // Advertisement Management
  advertisement: ["create", "read", "delete", "update", "just_admin"],

  // Content Management
  content_management: ["create", "read", "delete", "update", "just_admin"],

  // FAQ Management
  faq: ["create", "read", "delete", "update", "just_admin"],

  // Wallet Management
  wallet: ["create", "read", "delete", "update", "reedom_coin", "just_admin"],

  // Notification Management
  notification: ["create", "read", "delete", "update", "just_admin"],

  // Platform Fee Management
  platform_fee: ["create", "read", "delete", "update", "just_admin"],

  // Quiz Management
  quiz: ["create", "read", "delete", "update", "get_one", "just_admin"],
  quizzes: ["create", "read", "delete", "update", "get_one", "just_admin"],

  // Coin/Rewards System
  coin: [
    "create",
    "read",
    "delete",
    "update",
    "get_one",
    "reedom_coin",
    "just_admin",
  ],

  // Driver Order Competition
  driver_order_competition: ["create", "read", "delete", "update", "just_admin"],
  driver_order_compitition: ["create", "read", "delete", "update", "just_admin"],

  // Customer Order Confirmation
  customer_order_confirmation: [
    "create",
    "read",
    "delete",
    "update",
    "just_admin",
  ],

  // Vehicle & Pricing Management
  vechicle_pricing: ["create", "read", "delete", "update", "just_admin"],

  // Support & Dispute Management
  support_dispute: ["create", "read", "delete", "update", "just_admin"],

  // Order Placement
  order_placement: ["create", "read", "delete", "update", "just_admin"],
  live_order_tracking: ["create", "read", "delete", "update", "just_admin"],
  order_history: ["read", "delete", "just_admin"],
  payment_options: ["create", "read", "delete", "update", "just_admin"],

  // Report & Analytics
  report_analytics: ["create", "read", "delete", "update", "just_admin"],
  report_orders: ["read", "delete", "just_admin"],
  driver_performance: ["read", "just_admin"],
  customer_report: ["read", "just_admin"],
  report_analytics_stats: ["create", "read", "delete", "update", "just_admin"],

  // Destination Management
  destination: ["create", "read", "update", "delete", "just_admin"],

  // My Raider
  my_raider: [
    "create",
    "read",
    "delete",
    "update",
    "read_admin_my_raider",
    "just_admin",
  ],

  // Payment Method
  payment_method: ["create", "read", "update", "delete", "just_admin"],

  // Referral Management
  referral: ["create", "read", "update", "delete", "just_admin"],

  // Additional Services
  additional_services: ["create", "read", "update", "delete", "just_admin"],

  // User Profile
  user_profile: [
    "create",
    "read",
    "update",
    "delete",
    "get_user_profile",
    "update_user_profile",
    "just_admin",
  ],

  // Service Areas
  service_areas: ["create", "read", "update", "delete", "just_admin"],

  // Vehicle Type
  vehicle_type: ["create", "read", "update", "delete", "just_admin"],

  // Wallet Management
  wallet_user: ["create", "read", "update", "delete", "just_admin"],
  wallet_driver: ["create", "read", "update", "delete", "just_admin"],
  user_wallet: ["create", "read", "update", "delete", "just_admin"],
  raider_wallet: ["create", "read", "update", "delete", "just_admin"],

  // Delivery Type
  delivery_type: ["create", "read", "update", "delete", "just_admin"],

  // Policies Management
  policies: ["create", "read", "update", "delete", "just_admin"],

  // Revenue Order Configuration
  revenue_order_config: ["create", "read", "update", "delete", "just_admin"],

  // Additional Order Service
  additionl_order_service: ["create", "read", "update", "delete", "just_admin"],

  // Order Confirmation
  order_confirmation: ["create", "read", "update", "delete", "just_admin"],

  // Driver Incentive
  driver_incentive: ["create", "read", "update", "delete", "just_admin"],

  // Customer Rewards
  customer_rewards: ["create", "read", "update", "delete", "reedom_coin", "just_admin"],

  // Promo Code
  promo_code: ["create", "read", "update", "delete", "just_admin"],

  // Coin Stats
  coin_stats: ["create", "read", "update", "delete", "just_admin"],

  // Incentive Analytics
  incentive_analytics: ["create", "read", "update", "delete", "just_admin"],

  // KPI Stats
  kpi_stats: ["create", "read", "update", "delete", "just_admin"],

  // Transaction Stats
  transactions_stats: ["create", "read", "update", "delete", "just_admin"],

  // Contact Info
  contact_info: ["create", "read", "update", "delete", "just_admin"],

  // Service Chat
  service_chat: ["create", "read", "update", "delete", "just_admin"],

  // Dashboard Popup
  dashboard_popup: ["create", "read", "update", "delete", "just_admin"],

  // RBAC (Role Based Access Control)
  rbac: [
    "create",
    "read",
    "delete",
    "update_rbac_role_permission",
    "just_admin",
  ],
};

// Keep for backward compatibility
const FRONTEND_TO_BACKEND_MODULES: Record<string, string> = {
  Dashboard: "dashboard",
  Users: "user",
  Drivers: "raider",
  Order: "order",
  "Live Map/ Fleet Tracking": "live_map",
  "Support & Dispute": "support_dispute",
  "Payments & Transactions": "payment_transaction",
  "Notifications & Communication": "notification",
  "Report Analytics": "report_analytics",
  "Report Orders": "report_orders",
  "Driver Performance": "driver_performance",
  "Customer Report": "customer_report",
  "Vehicle Type & Pricing Management": "vechicle_pricing",
  "Wallet Management": "wallet",
  "User Wallet": "wallet_user",
  "Driver Wallet": "wallet_driver",
  "Coin System": "coin",
  Quiz: "quiz",
  Advertisement: "advertisement",
  "Platform fee": "platform_fee",
  "Content Management": "content_management",
  "Driver Order Competition": "driver_order_competition",
  "Customer Order Confirmation": "customer_order_confirmation",
  "Order Placement": "order_placement",
  "Live Order Tracking": "live_order_tracking",
  "Order History": "order_history",
  "Payment Options": "payment_options",
  Destination: "destination",
  "My Raider": "my_raider",
  "Payment Method": "payment_method",
  Referral: "referral",
  "Additional Services": "additional_services",
  "User Profile": "user_profile",
  "Service Areas": "service_areas",
  "Vehicle Type": "vehicle_type",
  "Delivery Type": "delivery_type",
  Policies: "policies",
  "Revenue Configuration": "revenue_order_config",
  "Additional Order Service": "additionl_order_service",
  "Order Confirmation": "order_confirmation",
  Quizzes: "quizzes",
  "Driver Incentive": "driver_incentive",
  "Customer Rewards": "customer_rewards",
  "Promo Code": "promo_code",
  "Coin Stats": "coin_stats",
  "Incentive Analytics": "incentive_analytics",
  "KPI Stats": "kpi_stats",
  "Transaction Stats": "transactions_stats",
  "Report Analytics Stats": "report_analytics_stats",
  "Contact Info": "contact_info",
  "Service Chat": "service_chat",
  "Dashboard Popup": "dashboard_popup",
  FAQ: "faq",
  RBAC: "rbac",
};

const ALL_PERMISSIONS = Object.keys(FRONTEND_TO_BACKEND_MODULES || {});

export { FRONTEND_TO_BACKEND_MODULES, MODULE_ACTIONS, ALL_PERMISSIONS };