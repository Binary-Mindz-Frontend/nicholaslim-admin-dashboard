// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react-refresh/only-export-components */
// import { useState, useEffect } from "react";
// import {
//   useGetRoleBasedAccessControlQuery,
//   useUpdateRoleBasedAccessControlMutation,
// } from "@/redux/features/roleBasedAccessControl/roleBasedAccessControlApi";
// import { toast } from "react-hot-toast";
// import { PermissionFormData, Role } from "@/types/roleBasedAccessControlType";
// import RoleSelector from "@/components/Dashboard/AddRemovePermission/RoleSelector";
// import PermissionsGrid from "@/components/Dashboard/AddRemovePermission/PermissionsGrid";

// export default function AddRemovePermission() {
//   const { data: roleData = [], isLoading: isLoadingRoles } =
//     useGetRoleBasedAccessControlQuery({});

//   const [updateRoleBasedAccessControl, { isLoading: isUpdating }] =
//     useUpdateRoleBasedAccessControlMutation();

//   const [formData, setFormData] = useState<PermissionFormData>({
//     roleId: "",
//     permissions: [],
//   });

//   const [localRoles, setLocalRoles] = useState<Role[]>([]);
//   const [hasInitialized, setHasInitialized] = useState(false);

//   useEffect(() => {
//     if (Array.isArray(roleData) && roleData.length > 0) {
//       setLocalRoles(roleData);
//       if (!hasInitialized) {
//         setHasInitialized(true);
//       }
//     }
//   }, [roleData, hasInitialized]);

//   const nonStaticRoles = localRoles.filter((role) => !role.isStatic);

//   useEffect(() => {
//     if (nonStaticRoles.length > 0 && !formData.roleId) {
//       const firstNonStaticRole = nonStaticRoles[0];
//       setFormData({
//         roleId: firstNonStaticRole.id.toString(),
//         permissions: firstNonStaticRole.permissions.map((p) => ({
//           module: p.module,
//           action: p.action,
//         })),
//       });
//     }
//   }, [nonStaticRoles, formData.roleId]);

//   const handleRoleChange = (roleId: string) => {
//     const selectedRole = localRoles.find(
//       (role) => role.id.toString() === roleId
//     );

//     if (selectedRole) {
//       setFormData({
//         roleId,
//         permissions: selectedRole.permissions.map((p) => ({
//           module: p.module,
//           action: p.action,
//         })),
//       });
//     }
//   };

//   const handlePermissionToggle = (permission: string) => {
//     const backendModule = FRONTEND_TO_BACKEND_MODULES[permission];
//     const moduleActions = MODULE_ACTIONS[backendModule] || [];

//     setFormData((prev) => {
//       const currentModulePermissions = prev.permissions.filter(
//         (p) => p.module === backendModule
//       );

//       if (currentModulePermissions.length === moduleActions.length) {
//         return {
//           ...prev,
//           permissions: prev.permissions.filter(
//             (p) => p.module !== backendModule
//           ),
//         };
//       } else {
//         const newPermissions = moduleActions.map((action) => ({
//           module: backendModule,
//           action,
//         }));

//         const filteredPermissions = prev.permissions.filter(
//           (p) => p.module !== backendModule
//         );

//         return {
//           ...prev,
//           permissions: [...filteredPermissions, ...newPermissions],
//         };
//       }
//     });
//   };

//   const handleSubmit = async () => {
//     if (!formData.roleId) {
//       toast.error("Please select a role");
//       return;
//     }

//     const roleId = parseInt(formData.roleId);
//     toast.loading("Updating permissions...");

//     try {
//       const updateData = {
//         id: roleId,
//         permissions: formData.permissions,
//       };

//       const response = await updateRoleBasedAccessControl(updateData).unwrap();

//       toast.dismiss();
//       toast.success(response?.message || "Permissions updated successfully!");

//       setLocalRoles((prevRoles) =>
//         prevRoles.map((role) =>
//           role.id === roleId
//             ? {
//                 ...role,
//                 permissions: formData.permissions.map((p) => ({
//                   id: Math.random(),
//                   module: p.module,
//                   action: p.action,
//                   roleId: roleId,
//                 })),
//               }
//             : role
//         )
//       );
//     } catch (error: any) {
//       toast.dismiss();
//       toast.error(error?.data?.message || "Failed to update permissions");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 px-8 sm:p-6 lg:p-8">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold text-gray-800 pt-2 sm:pt-0">
//           Add/Remove Permission
//         </h1>
//       </div>

//       <div className="bg-white rounded-xl shadow-sm p-6 sm:px-9 lg:px-36 lg:p-10">
//         <RoleSelector
//           roles={nonStaticRoles}
//           selectedRoleId={formData.roleId}
//           onRoleChange={handleRoleChange}
//           isLoading={isLoadingRoles || isUpdating}
//         />

//         <PermissionsGrid
//           permissions={ALL_PERMISSIONS}
//           selectedPermissions={formData.permissions}
//           onPermissionToggle={handlePermissionToggle}
//           isLoading={isLoadingRoles || isUpdating}
//         />

//         <div className="flex justify-center">
//           <button
//             onClick={handleSubmit}
//             disabled={!formData.roleId || isUpdating || isLoadingRoles}
//             className="px-12 py-3 bg-yellow-400 font-bold hover:bg-yellow-500 text-black rounded transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
//           >
//             {isUpdating ? "Updating..." : "Update Permissions"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// const FRONTEND_TO_BACKEND_MODULES: Record<string, string> = {
//   Users: "user",
//   Drivers: "raider",
//   Order: "order",
//   "Live Map/ Fleet Tracking": "live_map",
//   "Support & Dispute": "support_dispute",
//   "Payments & Transactions": "payment_transaction",
//   "Notifications & Communication": "notification",
//   "Report Analytics": "report_analytics",
//   "Vehicle Type & Pricing Management": "vechicle_pricing",
//   "Wallet Management": "wallet",
//   "Coin System": "coin",
//   Quiz: "quiz",
//   Advertisement: "advertisement",
//   "Platform fee": "platform_fee",
//   "Content Management": "content_management",
//   "Driver Order Competition": "driver_order_competition",
//   "Customer Order Confirmation": "customer_order_confirmation",
//   "Order Placement": "order_placement",
//   // DESTINATION: "destination",
//   // "MY RAIDER": "my_raider",
//   // REFERRAL: "referral",
//   // RBAC: "rbac",
// };

// const MODULE_ACTIONS: Record<string, string[]> = {
//   user: [
//     "create",
//     "read",
//     "update",
//     "update_user_profile",
//     "update_user_role",
//     "update_user_status",
//     "delete",
//     "get_user_profile",
//   ],
//   raider: ["create", "read", "update", "delete", "just_admin"],
//   order: [
//     "create",
//     "read",
//     "update",
//     "add_destination_to_order",
//     "order_compitition",
//     "get_order_details",
//     "order_read_mine",
//     "order_read_feed",
//     "update_order_status",
//     "cancel_order",
//     "delete",
//   ],
//   payment_transaction: [
//     "create",
//     "read",
//     "update_transaction_status",
//     "update_transaction_amount",
//     "approve_transaction",
//     "refund_transaction",
//     "delete",
//   ],
//   live_map: ["read"],
//   advertisement: ["create", "read", "delete", "update", "just_admin"],
//   content_management: ["create", "read", "delete", "update"],
//   wallet: ["create", "read", "delete", "update"],
//   notification: ["create", "delete", "update"],
//   platform_fee: ["create", "delete", "update", "read"],
//   quiz: ["create", "delete", "update", "read", "get_one"],
//   coin: ["create", "delete", "update", "read", "get_one"],
//   driver_order_competition: ["create", "read", "delete", "update"],
//   customer_order_confirmation: ["create", "read", "delete", "update"],
//   vechicle_pricing: ["create", "read", "delete", "update", "just_admin"],
//   // destination: ["create", "read", "update", "delete", "just_admin"],
//   // my_raider: ["create", "read", "delete", "update", "read_admin_my_raider"],
//   // referral: ["create", "read", "delete", "update"],
//   // rbac: ["create", "read", "delete", "update_rbac_role_permission"],
//   support_dispute: ["create", "read", "delete", "update", "just_admin"],
//   order_placement: ["create", "read", "delete", "update", "just_admin"],
//   report_analytics: ["create", "read", "delete", "update", "just_admin"],
// };

// const ALL_PERMISSIONS = [
//   "Users",
//   "Drivers",
//   "Order",
//   "Live Map/ Fleet Tracking",
//   "Support & Dispute",
//   "Payments & Transactions",
//   "Notifications & Communication",
//   "Report Analytics",
//   "Vehicle Type & Pricing Management",
//   "Wallet Management",
//   "Coin System",
//   "Quiz",
//   "Advertisement",
//   "Platform fee",
//   "Content Management",
//   "Driver Order Competition",
//   "Customer Order Confirmation",
//   "Order Placement",
//   // "DESTINATION",
//   // "MY RAIDER",
//   // "REFERRAL",
//   // "RBAC",
// ];

// export { FRONTEND_TO_BACKEND_MODULES, MODULE_ACTIONS, ALL_PERMISSIONS };


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
import { ChevronDown, Save } from "lucide-react";

// Import menu items and mapping
import { menuItems, MenuItem } from "@/components/Shared/Sidebar/MenuItems";
import {
  menuToPermissionMapping,
  childRouteToParentMapping,
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
}

// Build menu tree
const buildMenuTree = (items: MenuItem[], parentId?: string): MenuNode[] => {
  return items
    .filter(item => item.id !== "login" && item.id !== "")
    .map((item) => ({
      id: item.id,
      label: item.label,
      parentId,
      route: item.route,
      children: item.children ? buildMenuTree(item.children, item.id) : undefined,
    }));
};

const MENU_TREE = buildMenuTree(menuItems);

// Helper functions (same as in PermissionsModal)
const getBackendModulesForMenuItem = (menuId: string): string[] => {
  const directModules = menuToPermissionMapping[menuId] || [];
  const parentId = childRouteToParentMapping[menuId];
  if (parentId && parentId !== menuId) {
    const parentModules = menuToPermissionMapping[parentId] || [];
    return [...new Set([...directModules, ...parentModules])];
  }
  return directModules;
};

const hasAnyPermission = (menuId: string, selectedPermissions: Permission[]): boolean => {
  const backendModules = getBackendModulesForMenuItem(menuId);
  for (const module of backendModules) {
    if (selectedPermissions.some((p) => p.module === module)) return true;
  }
  return false;
};

const hasAllPermissions = (menuId: string, selectedPermissions: Permission[]): boolean => {
  const backendModules = getBackendModulesForMenuItem(menuId);
  for (const module of backendModules) {
    const requiredActions = MODULE_ACTIONS[module] || [];
    const actualPermissions = selectedPermissions.filter((p) => p.module === module);
    if (actualPermissions.length !== requiredActions.length) return false;
  }
  return backendModules.length > 0;
};

const hasPartialPermissions = (menuId: string, selectedPermissions: Permission[]): boolean => {
  const backendModules = getBackendModulesForMenuItem(menuId);
  let hasSome = false;
  let hasAll = true;
  
  for (const module of backendModules) {
    const requiredActions = MODULE_ACTIONS[module] || [];
    const actualPermissions = selectedPermissions.filter((p) => p.module === module);
    if (actualPermissions.length > 0) hasSome = true;
    if (actualPermissions.length !== requiredActions.length) hasAll = false;
  }
  
  return hasSome && !hasAll && backendModules.length > 0;
};

const getAllPermissionsForMenuItem = (menuId: string): Permission[] => {
  const backendModules = getBackendModulesForMenuItem(menuId);
  const permissions: Permission[] = [];
  
  for (const module of backendModules) {
    const actions = MODULE_ACTIONS[module] || [];
    actions.forEach((action) => {
      permissions.push({ module, action });
    });
  }
  
  return permissions;
};

// MenuTreeItem component
const MenuTreeItem: React.FC<{
  node: MenuNode;
  selectedPermissions: Permission[];
  onToggle: (menuId: string, checked: boolean) => void;
  expandedNodes: Set<string>;
  onToggleExpand: (nodeId: string) => void;
  level?: number;
}> = ({ node, selectedPermissions, onToggle, expandedNodes, onToggleExpand, level = 0 }) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(node.id);
  
  const hasPermission = hasAnyPermission(node.id, selectedPermissions);
  const hasAll = hasAllPermissions(node.id, selectedPermissions);
  const hasPartial = hasPartialPermissions(node.id, selectedPermissions);
  
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
  
  return (
    <div className="select-none">
      <div
        className={`flex items-center py-2 px-2 rounded-lg hover:bg-gray-50 cursor-pointer ${
          level > 0 ? "ml-6" : ""
        }`}
        onClick={handleToggle}
      >
        {hasChildren && (
          <ChevronDown
            className={`w-4 h-4 mr-1 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        )}
        {!hasChildren && <div className="w-5 mr-1" />}
        
        <input
          type="checkbox"
          className="w-4 h-4 mr-3 rounded border-gray-300 text-yellow-400 focus:ring-yellow-400 cursor-pointer"
          checked={checkboxState === "checked"}
          ref={(input) => {
            if (input && checkboxState === "indeterminate") {
              input.indeterminate = true;
            } else if (input) {
              input.indeterminate = false;
            }
          }}
          onChange={handleCheckboxChange}
          onClick={(e) => e.stopPropagation()}
        />
        
        <span className="flex-1 text-sm font-medium text-gray-700">
          {node.label}
        </span>
        
        {hasPermission && (
          <span className="text-xs text-gray-500 mr-2">
            {getBackendModulesForMenuItem(node.id).length} module(s)
          </span>
        )}
      </div>
      
      {hasChildren && isExpanded && (
        <div className="ml-4 border-l border-gray-200 pl-2">
          {node.children?.map((child) => (
            <MenuTreeItem
              key={child.id}
              node={child}
              selectedPermissions={selectedPermissions}
              onToggle={onToggle}
              expandedNodes={expandedNodes}
              onToggleExpand={onToggleExpand}
              level={level + 1}
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
    new Set(["system-configuration"])
  );

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
        permissions: firstNonStaticRole.permissions.map((p) => ({
          module: p.module,
          action: p.action,
        })),
      });
    }
  }, [nonStaticRoles, formData.roleId]);

  const handleRoleChange = (roleId: string) => {
    const selectedRole = localRoles.find(
      (role) => role.id.toString() === roleId
    );

    if (selectedRole) {
      setFormData({
        roleId,
        permissions: selectedRole.permissions.map((p) => ({
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
        // Add all permissions for this menu item
        const newPermissions = [...prev.permissions];
        menuPermissions.forEach((perm) => {
          const exists = prev.permissions.some(
            (p) => p.module === perm.module && p.action === perm.action
          );
          if (!exists) {
            newPermissions.push(perm);
          }
        });
        return { ...prev, permissions: newPermissions };
      } else {
        // Remove all permissions for this menu item
        const backendModules = getBackendModulesForMenuItem(menuId);
        return {
          ...prev,
          permissions: prev.permissions.filter(
            (p) => !backendModules.includes(p.module)
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

  const handleSubmit = async () => {
    if (!formData.roleId) {
      toast.error("Please select a role");
      return;
    }

    const roleId = parseInt(formData.roleId);
    toast.loading("Updating permissions...");

    try {
      const updateData = {
        id: roleId,
        permissions: formData.permissions,
      };

      const response = await updateRoleBasedAccessControl(updateData).unwrap();

      toast.dismiss();
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
            : role
        )
      );
    } catch (error: any) {
      toast.dismiss();
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

  return (
    <div className="min-h-screen bg-gray-50 px-8 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 pt-2 sm:pt-0">
          Add/Remove Permission
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 sm:px-9 lg:px-36 lg:p-10">
        <RoleSelector
          roles={nonStaticRoles}
          selectedRoleId={formData.roleId}
          onRoleChange={handleRoleChange}
          isLoading={isLoadingRoles || isUpdating}
        />

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Permissions
            </h2>
            <span className="text-sm text-gray-500">
              {getSelectedModuleCount()} modules selected
            </span>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50 max-h-[500px] overflow-y-auto">
            <div className="text-sm text-gray-500 mb-4">
              <span className="font-medium">Note:</span> Selecting a parent
              item will grant all permissions for that section. Selecting a
              child item will grant only that specific feature's permissions.
            </div>
            
            <div className="space-y-1">
              {MENU_TREE.map((node) => (
                <MenuTreeItem
                  key={node.id}
                  node={node}
                  selectedPermissions={formData.permissions}
                  onToggle={handlePermissionToggle}
                  expandedNodes={expandedNodes}
                  onToggleExpand={toggleExpand}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!formData.roleId || isUpdating || isLoadingRoles}
            className="px-12 py-3 bg-yellow-400 font-bold hover:bg-yellow-500 text-black rounded transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed flex items-center"
          >
            {isUpdating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                Updating...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Update Permissions
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Keep the existing constants
const FRONTEND_TO_BACKEND_MODULES: Record<string, string> = {
  // Core Modules
  Users: "user",
  Drivers: "raider",
  Order: "order",
  "Live Map/ Fleet Tracking": "live_map",
  "Support & Dispute": "support_dispute",
  "Payments & Transactions": "payment_transaction",
  "Notifications & Communication": "notification",
  "Report Analytics": "report_analytics",
  "Vehicle Type & Pricing Management": "vechicle_pricing",
  "Wallet Management": "wallet",
  "Coin System": "coin",
  Quiz: "quiz",
  Advertisement: "advertisement",
  "Platform fee": "platform_fee",
  "Content Management": "content_management",
  "Driver Order Competition": "driver_order_competition",
  "Customer Order Confirmation": "customer_order_confirmation",
  "Order Placement": "order_placement",

  // New Modules from your enum
  Dashboard: "dashboard",
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


const MODULE_ACTIONS: Record<string, string[]> = {
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
  ],

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
  ],

  // Live Map/Fleet Tracking
  live_map: ["read"],

  // Advertisement Management
  advertisement: ["create", "read", "delete", "update", "just_admin"],

  // Content Management
  content_management: ["create", "read", "delete", "update"],

  // FAQ Management
  faq: ["create", "read", "delete", "update"],

  // Wallet Management
  wallet: ["create", "read", "delete", "update", "reedom_coin"],

  // Notification Management
  notification: ["create", "read", "delete", "update"],

  // Platform Fee Management
  platform_fee: ["create", "read", "delete", "update"],

  // Quiz Management
  quiz: ["create", "read", "delete", "update", "get_one"],

  // Coin/Rewards System
  coin: ["create", "read", "delete", "update", "get_one", "reedom_coin"],

  // Driver Order Competition
  driver_order_competition: ["create", "read", "delete", "update"],

  // Customer Order Confirmation
  customer_order_confirmation: ["create", "read", "delete", "update"],

  // Vehicle & Pricing Management
  vechicle_pricing: ["create", "read", "delete", "update", "just_admin"],

  // Support & Dispute Management
  support_dispute: ["create", "read", "delete", "update", "just_admin"],

  // Order Placement
  order_placement: ["create", "read", "delete", "update", "just_admin"],

  // Report & Analytics
  report_analytics: ["create", "read", "delete", "update", "just_admin"],

  // Report Analytics Stats
  report_analytics_stats: ["create", "read", "delete", "update", "just_admin"],

  // Dashboard
  dashboard: ["read"],

  // Destination Management
  destination: ["create", "read", "update", "delete", "just_admin"],

  // My Raider
  my_raider: ["create", "read", "delete", "update", "read_admin_my_raider"],

  // Payment Method
  payment_method: ["create", "read", "update", "delete", "just_admin"],

  // Referral Management
  referral: ["create", "read", "update", "delete"],

  // Additional Services
  additional_services: ["create", "read", "update", "delete"],

  // User Profile
  user_profile: [
    "create",
    "read",
    "update",
    "delete",
    "get_user_profile",
    "update_user_profile",
  ],

  // Service Areas
  service_areas: ["create", "read", "update", "delete", "just_admin"],

  // Vehicle Type
  vehicle_type: ["create", "read", "update", "delete", "just_admin"],

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

  // Quizzes
  quizzes: ["create", "read", "update", "delete", "get_one"],

  // Driver Incentive
  driver_incentive: ["create", "read", "update", "delete"],

  // Customer Rewards
  customer_rewards: ["create", "read", "update", "delete", "reedom_coin"],

  // Promo Code
  promo_code: ["create", "read", "update", "delete"],

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
  service_chat: ["create", "read", "update", "delete"],

  // Dashboard Popup
  dashboard_popup: ["create", "read", "update", "delete", "just_admin"],

  // RBAC (Role Based Access Control)
  rbac: ["create", "read", "delete", "update_rbac_role_permission"],
};

// Keep ALL_PERMISSIONS for backward compatibility if needed
const ALL_PERMISSIONS = [
  // Core Permissions
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
  
  // New Permissions from your enum
  "Dashboard",
  "Destination",
  "My Raider",
  "Payment Method",
  "Referral",
  "Additional Services",
  "User Profile",
  "Service Areas",
  "Vehicle Type",
  "Delivery Type",
  "Policies",
  "Revenue Configuration",
  "Additional Order Service",
  "Order Confirmation",
  "Quizzes",
  "Driver Incentive",
  "Customer Rewards",
  "Promo Code",
  "Coin Stats",
  "Incentive Analytics",
  "KPI Stats",
  "Transaction Stats",
  "Report Analytics Stats",
  "Contact Info",
  "Service Chat",
  "Dashboard Popup",
  "FAQ",
  "RBAC",
]

export { FRONTEND_TO_BACKEND_MODULES, MODULE_ACTIONS, ALL_PERMISSIONS };