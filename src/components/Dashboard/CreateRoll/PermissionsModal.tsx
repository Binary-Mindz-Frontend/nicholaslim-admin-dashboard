// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react-refresh/only-export-components */
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   // AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import React, { useState, useEffect } from "react";
// import { X, UserMinus, Save } from "lucide-react";
// import toast from "react-hot-toast";

// // Import the permissions constants from your existing file
// import {
//   ALL_PERMISSIONS,
//   FRONTEND_TO_BACKEND_MODULES,
//   MODULE_ACTIONS,
// } from "@/pages/Admin/AddRemovePermission/AddRemovePermission";
// import {
//   useGetRoleUsersQuery,
//   useRemoveUserFromRoleMutation,
//   useUpdateRoleBasedAccessControlMutation,
// } from "@/redux/features/roleBasedAccessControl/roleBasedAccessControlApi";

// interface Permission {
//   module: string;
//   action: string;
// }

// interface User {
//   id: number;
//   username: string;
//   email: string;
//   phone?: string;
// }

// interface PermissionsModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   permissions: Permission[];
//   roleName: string;
//   roleId: number;
//   isLoading?: boolean;
// }

// const PermissionsModal: React.FC<PermissionsModalProps> = ({
//   isOpen,
//   onClose,
//   permissions,
//   roleName,
//   roleId,
//   isLoading = false,
// }) => {
//   const [selectedPermissions, setSelectedPermissions] =
//     useState<Permission[]>(permissions);
//   const [activeTab, setActiveTab] = useState<"permissions" | "users">(
//     "permissions",
//   );
//   const [pendingRemove, setPendingRemove] = useState<{
//     userId: number;
//     username: string;
//   } | null>(null);

//   const [isEditing, setIsEditing] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);

//   // Fetch users for this role
//   const {
//     data: roleUsersData,
//     isLoading: isLoadingUsers,
//     refetch: refetchUsers,
//   } = useGetRoleUsersQuery(roleId);

//   const [removeUser, { isLoading: isRemovingUser }] =
//     useRemoveUserFromRoleMutation();

//   const [updateRoleBasedAccessControl, { isLoading: isUpdating }] =
//     useUpdateRoleBasedAccessControlMutation();

//   useEffect(() => {
//     setSelectedPermissions(permissions);
//     setIsEditing(false);
//   }, [permissions]);

//   // Refetch users when modal opens
//   useEffect(() => {
//     if (isOpen && roleId) {
//       refetchUsers();
//     }
//   }, [isOpen, roleId, refetchUsers]);

//   const isModuleSelected = (permissionName: string) => {
//     const backendModule = FRONTEND_TO_BACKEND_MODULES[permissionName];
//     const moduleActions = MODULE_ACTIONS[backendModule] || [];
//     const currentModulePermissions = selectedPermissions.filter(
//       (p) => p.module === backendModule,
//     );
//     return currentModulePermissions.length === moduleActions.length;
//   };

//   const isModulePartiallySelected = (permissionName: string) => {
//     const backendModule = FRONTEND_TO_BACKEND_MODULES[permissionName];
//     const moduleActions = MODULE_ACTIONS[backendModule] || [];
//     const currentModulePermissions = selectedPermissions.filter(
//       (p) => p.module === backendModule,
//     );
//     return (
//       currentModulePermissions.length > 0 &&
//       currentModulePermissions.length < moduleActions.length
//     );
//   };

//   const getSelectedModuleCount = () => {
//     const selectedModules = new Set();
//     selectedPermissions.forEach((p) => {
//       selectedModules.add(p.module);
//     });
//     return selectedModules.size;
//   };

//   const handlePermissionToggle = (permissionName: string) => {
//     if (!isEditing) return;

//     const backendModule = FRONTEND_TO_BACKEND_MODULES[permissionName];
//     const moduleActions = MODULE_ACTIONS[backendModule] || [];

//     setSelectedPermissions((prev) => {
//       const currentModulePermissions = prev.filter(
//         (p) => p.module === backendModule,
//       );

//       if (currentModulePermissions.length === moduleActions.length) {
//         // Remove all permissions for this module
//         return prev.filter((p) => p.module !== backendModule);
//       } else {
//         // Add all permissions for this module
//         const newPermissions = moduleActions.map((action) => ({
//           module: backendModule,
//           action,
//         }));

//         const filteredPermissions = prev.filter(
//           (p) => p.module !== backendModule,
//         );

//         return [...filteredPermissions, ...newPermissions];
//       }
//     });
//   };

//   const handleSavePermissions = async () => {
//     if (!roleId) return;

//     setIsSaving(true);
//     toast.loading("Updating permissions...");

//     try {
//       const cleanPermissions = selectedPermissions.map(
//         ({ module, action }) => ({
//           module,
//           action,
//         }),
//       );

//       const updateData = {
//         id: roleId,
//         permissions: cleanPermissions,
//       };

//       const response = await updateRoleBasedAccessControl(updateData).unwrap();

//       toast.dismiss();
//       toast.success(response?.message || "Permissions updated successfully!");
//       setIsEditing(false);
//     } catch (error: any) {
//       toast.dismiss();
//       console.error("Failed to update permissions:", error);
//       toast.error(error?.data?.message || "Failed to update permissions");

//       setSelectedPermissions(permissions);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleCancelEdit = () => {
//     setSelectedPermissions(permissions);
//     setIsEditing(false);
//   };

//   const handleRemoveUser = async () => {
//     if (!roleId || !pendingRemove) return;

//     const { userId, username } = pendingRemove;
//     toast.loading(`Removing ${username} from role...`);

//     try {
//       const response = await removeUser({
//         roleId,
//         userId,
//       }).unwrap();

//       if (response.success) {
//         toast.dismiss();
//         toast.success(response.message || `User removed successfully!`);
//         refetchUsers();
//       }
//     } catch (error) {
//       toast.dismiss();
//       console.error("Failed to remove user:", error);
//       toast.error("Failed to remove user from role");
//     } finally {
//       setPendingRemove(null); // always clear after attempt
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <>
//       <AlertDialog
//         open={!!pendingRemove}
//         onOpenChange={(open) => !open && setPendingRemove(null)}
//       >
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Remove User</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to remove{" "}
//               <span className="font-semibold text-foreground">
//                 {pendingRemove?.username}
//               </span>{" "}
//               from this role?
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               className="bg-red-500 hover:bg-red-600 text-white"
//               onClick={handleRemoveUser}
//             >
//               Remove
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//       <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
//         <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
//           <div className="flex justify-between items-center p-6 border-b">
//             <div>
//               <h2 className="text-xl font-semibold text-gray-800">
//                 Role Details - {roleName}
//               </h2>
//               <p className="text-sm text-gray-500 mt-1">
//                 {activeTab === "permissions"
//                   ? `${getSelectedModuleCount()} modules selected ${isEditing ? "(Editing)" : ""}`
//                   : `${roleUsersData?.users?.length || 0} users assigned`}
//               </p>
//             </div>
//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
//               disabled={isLoading || isSaving || isUpdating}
//             >
//               <X size={24} />
//             </button>
//           </div>

//           {/* Tabs */}
//           <div className="flex border-b px-6">
//             <button
//               onClick={() => setActiveTab("permissions")}
//               className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors cursor-pointer ${
//                 activeTab === "permissions"
//                   ? "border-yellow-400 text-yellow-600"
//                   : "border-transparent text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               Permissions
//             </button>
//             <button
//               onClick={() => setActiveTab("users")}
//               className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors cursor-pointer ${
//                 activeTab === "users"
//                   ? "border-yellow-400 text-yellow-600"
//                   : "border-transparent text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               Assigned Users ({roleUsersData?.users?.length || 0})
//             </button>
//           </div>

//           <div className="p-6 overflow-y-auto max-h-[70vh] no-scrollbar">
//             {activeTab === "permissions" ? (
//               // Permissions View
//               <>
//                 {/* Edit/Save Controls */}
//                 <div className="flex justify-end mb-4 space-x-2">
//                   {!isEditing ? (
//                     <button
//                       onClick={() => setIsEditing(true)}
//                       className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors cursor-pointer text-sm font-medium"
//                       disabled={isUpdating || isSaving}
//                     >
//                       Edit Permissions
//                     </button>
//                   ) : (
//                     <>
//                       <button
//                         onClick={handleCancelEdit}
//                         className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer text-sm font-medium"
//                         disabled={isSaving || isUpdating}
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         onClick={handleSavePermissions}
//                         disabled={isSaving || isUpdating}
//                         className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors cursor-pointer text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//                       >
//                         {isSaving || isUpdating ? (
//                           <>
//                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                             Saving...
//                           </>
//                         ) : (
//                           <>
//                             <Save size={16} className="mr-1" />
//                             Save Changes
//                           </>
//                         )}
//                       </button>
//                     </>
//                   )}
//                 </div>

//                 {/* Permissions Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {ALL_PERMISSIONS.map((permission) => {
//                     const isSelected = isModuleSelected(permission);
//                     const isPartial = isModulePartiallySelected(permission);

//                     let bgColor = "bg-gray-50";
//                     let borderColor = "border-gray-200";
//                     let textColor = "text-gray-800";
//                     let hoverEffect = "";

//                     if (isSelected) {
//                       bgColor = "bg-yellow-50";
//                       borderColor = "border-yellow-300";
//                       textColor = "text-yellow-800";
//                     } else if (isPartial) {
//                       bgColor = "bg-yellow-50";
//                       borderColor = "border-yellow-300";
//                       textColor = "text-yellow-800";
//                     }

//                     if (isEditing) {
//                       hoverEffect =
//                         "hover:shadow-md cursor-pointer hover:border-yellow-400";
//                     }

//                     return (
//                       <div
//                         key={permission}
//                         onClick={() =>
//                           isEditing && handlePermissionToggle(permission)
//                         }
//                         className={`border rounded-lg p-4 transition-all duration-200 ${bgColor} ${borderColor} ${hoverEffect}`}
//                       >
//                         <div className="flex items-center justify-between">
//                           <h3 className={`font-medium ${textColor}`}>
//                             {permission}
//                           </h3>
//                           <div className="flex items-center">
//                             <div
//                               className={`w-5 h-5 rounded-full flex items-center justify-center border ${
//                                 isSelected
//                                   ? "bg-yellow-400 border-yellow-400"
//                                   : isPartial
//                                     ? "bg-yellow-500 border-yellow-500"
//                                     : "bg-white border-gray-300"
//                               }`}
//                             >
//                               {isSelected ? (
//                                 <svg
//                                   className="w-3 h-3 text-white"
//                                   fill="none"
//                                   viewBox="0 0 24 24"
//                                   stroke="currentColor"
//                                 >
//                                   <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={3}
//                                     d="M5 13l4 4L19 7"
//                                   />
//                                 </svg>
//                               ) : (
//                                 isPartial && (
//                                   <div className="w-2 h-2 bg-white rounded-full"></div>
//                                 )
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </>
//             ) : (
//               // Users View
//               <div className="space-y-4">
//                 {isLoadingUsers ? (
//                   <div className="flex justify-center py-8">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
//                   </div>
//                 ) : roleUsersData?.users && roleUsersData.users.length > 0 ? (
//                   <div className="divide-y">
//                     {roleUsersData.users.map((user: User) => (
//                       <div
//                         key={user.id}
//                         className="flex items-center justify-between py-3"
//                       >
//                         <div className="flex-1">
//                           <div className="flex items-center space-x-3">
//                             <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
//                               <span className="text-yellow-600 font-medium">
//                                 {user.username.charAt(0).toUpperCase()}
//                               </span>
//                             </div>
//                             <div>
//                               <p className="font-medium text-gray-800">
//                                 {user.username}
//                               </p>
//                               <p className="text-sm text-gray-500">
//                                 {user.email}
//                               </p>
//                               {user.phone && (
//                                 <p className="text-xs text-gray-400">
//                                   {user.phone}
//                                 </p>
//                               )}
//                             </div>
//                           </div>
//                         </div>
                      
//                         <button
//                           onClick={() =>
//                             setPendingRemove({
//                               userId: user.id,
//                               username: user.username,
//                             })
//                           }
//                           disabled={isRemovingUser}
//                           className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//                           title="Remove user from role"
//                         >
//                           <UserMinus size={18} />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-8">
//                     <div className="text-gray-400 mb-2">
//                       <svg
//                         className="w-12 h-12 mx-auto"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={1.5}
//                           d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
//                         />
//                       </svg>
//                     </div>
//                     <p className="text-gray-500">
//                       No users assigned to this role
//                     </p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PermissionsModal;

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React, { useState, useEffect } from "react";
import { X, UserMinus, Save, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

// Import menu items and mapping
import { menuItems, MenuItem } from "@/components/Shared/Sidebar/MenuItems";
import {
  menuToPermissionMapping,
  childRouteToParentMapping,
} from "@/utils/permissionMapping";

import {
  MODULE_ACTIONS,
} from "@/pages/Admin/AddRemovePermission/AddRemovePermission";
import {
  useGetRoleUsersQuery,
  useRemoveUserFromRoleMutation,
  useUpdateRoleBasedAccessControlMutation,
} from "@/redux/features/roleBasedAccessControl/roleBasedAccessControlApi";

interface Permission {
  module: string;
  action: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
}

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  permissions: Permission[];
  roleName: string;
  roleId: number;
  isLoading?: boolean;
}

interface MenuNode {
  id: string;
  label: string;
  children?: MenuNode[];
  parentId?: string;
  route?: string;
}

// Build a tree structure from menu items
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

// Get all backend modules for a menu item (including children)
const getBackendModulesForMenuItem = (menuId: string): string[] => {
  // First check direct mapping
  const directModules = menuToPermissionMapping[menuId] || [];
  
  // Then check if this is a child route that maps to a parent
  const parentId = childRouteToParentMapping[menuId];
  if (parentId && parentId !== menuId) {
    const parentModules = menuToPermissionMapping[parentId] || [];
    return [...new Set([...directModules, ...parentModules])];
  }
  
  return directModules;
};

// Check if a menu item has any permissions
const hasAnyPermission = (
  menuId: string,
  selectedPermissions: Permission[]
): boolean => {
  const backendModules = getBackendModulesForMenuItem(menuId);
  
  for (const module of backendModules) {
    const hasModulePermission = selectedPermissions.some(
      (p) => p.module === module
    );
    if (hasModulePermission) return true;
  }
  
  return false;
};

// Check if all backend modules for a menu item have all their actions
const hasAllPermissions = (
  menuId: string,
  selectedPermissions: Permission[]
): boolean => {
  const backendModules = getBackendModulesForMenuItem(menuId);
  
  for (const module of backendModules) {
    const requiredActions = MODULE_ACTIONS[module] || [];
    const actualPermissions = selectedPermissions.filter(
      (p) => p.module === module
    );
    
    if (actualPermissions.length !== requiredActions.length) {
      return false;
    }
  }
  
  return backendModules.length > 0;
};

// Check if some (but not all) backend modules have permissions
const hasPartialPermissions = (
  menuId: string,
  selectedPermissions: Permission[]
): boolean => {
  const backendModules = getBackendModulesForMenuItem(menuId);
  let hasSomePermission = false;
  let hasAllPermission = true;
  
  for (const module of backendModules) {
    const requiredActions = MODULE_ACTIONS[module] || [];
    const actualPermissions = selectedPermissions.filter(
      (p) => p.module === module
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

// Get all permissions for a menu item (including children)
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

// Recursive component to render menu tree with original design
const MenuTreeItem: React.FC<{
  node: MenuNode;
  selectedPermissions: Permission[];
  onToggle: (menuId: string, checked: boolean) => void;
  expandedNodes: Set<string>;
  onToggleExpand: (nodeId: string) => void;
  level?: number;
  isEditing: boolean;
}> = ({ node, selectedPermissions, onToggle, expandedNodes, onToggleExpand, level = 0, isEditing }) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(node.id);
  
  const hasPermission = hasAnyPermission(node.id, selectedPermissions);
  const hasAll = hasAllPermissions(node.id, selectedPermissions);
  const hasPartial = hasPartialPermissions(node.id, selectedPermissions);
  
  let bgColor = "bg-gray-50";
  let borderColor = "border-gray-200";
  let textColor = "text-gray-800";

  if (hasAll) {
    bgColor = "bg-yellow-50";
    borderColor = "border-yellow-300";
    textColor = "text-yellow-800";
  } else if (hasPartial) {
    bgColor = "bg-yellow-50";
    borderColor = "border-yellow-300";
    textColor = "text-yellow-800";
  }

  const handleToggle = () => {
    if (hasChildren) {
      onToggleExpand(node.id);
    } else if (isEditing) {
      onToggle(node.id, !hasPermission);
    }
  };

  return (
    <div className="select-none">
      <div
        onClick={handleToggle}
        className={`border rounded-lg p-4 transition-all duration-200 ${bgColor} ${borderColor} ${
          isEditing ? "hover:shadow-md cursor-pointer hover:border-yellow-400" : ""
        } ${level > 0 ? "ml-6" : ""}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            {hasChildren && (
              <ChevronDown
                className={`w-4 h-4 mr-2 transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                } ${textColor}`}
              />
            )}
            <h3 className={`font-medium ${textColor}`}>
              {node.label}
            </h3>
          </div>
          
          <div className="flex items-center space-x-3">
            {hasPermission && (
              <span className="text-xs text-gray-500">
                {getBackendModulesForMenuItem(node.id).length} module(s)
              </span>
            )}
            
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                hasAll
                  ? "bg-yellow-400 border-yellow-400"
                  : hasPartial
                    ? "bg-yellow-500 border-yellow-500"
                    : "bg-white border-gray-300"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (isEditing && !hasChildren) {
                  onToggle(node.id, !hasPermission);
                }
              }}
            >
              {hasAll ? (
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
                hasPartial && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      
      {hasChildren && isExpanded && (
        <div className="mt-2 space-y-2">
          {node.children?.map((child) => (
            <MenuTreeItem
              key={child.id}
              node={child}
              selectedPermissions={selectedPermissions}
              onToggle={onToggle}
              expandedNodes={expandedNodes}
              onToggleExpand={onToggleExpand}
              level={level + 1}
              isEditing={isEditing}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const PermissionsModal: React.FC<PermissionsModalProps> = ({
  isOpen,
  onClose,
  permissions,
  roleName,
  roleId,
  isLoading = false,
}) => {
  const [selectedPermissions, setSelectedPermissions] =
    useState<Permission[]>(permissions);
  const [activeTab, setActiveTab] = useState<"permissions" | "users">(
    "permissions"
  );
  const [pendingRemove, setPendingRemove] = useState<{
    userId: number;
    username: string;
  } | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(["system-configuration"])
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    data: roleUsersData,
    isLoading: isLoadingUsers,
    refetch: refetchUsers,
  } = useGetRoleUsersQuery(roleId);

  const [removeUser, { isLoading: isRemovingUser }] =
    useRemoveUserFromRoleMutation();

  const [updateRoleBasedAccessControl, { isLoading: isUpdating }] =
    useUpdateRoleBasedAccessControlMutation();

  useEffect(() => {
    setSelectedPermissions(permissions);
    setIsEditing(false);
  }, [permissions]);

  useEffect(() => {
    if (isOpen && roleId) {
      refetchUsers();
    }
  }, [isOpen, roleId, refetchUsers]);

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

  const handlePermissionToggle = (menuId: string, checked: boolean) => {
    if (!isEditing) return;

    const menuPermissions = getAllPermissionsForMenuItem(menuId);
    
    setSelectedPermissions((prev) => {
      if (checked) {
        // Add all permissions for this menu item
        const newPermissions = [...prev];
        menuPermissions.forEach((perm) => {
          const exists = prev.some(
            (p) => p.module === perm.module && p.action === perm.action
          );
          if (!exists) {
            newPermissions.push(perm);
          }
        });
        return newPermissions;
      } else {
        // Remove all permissions for this menu item
        const backendModules = getBackendModulesForMenuItem(menuId);
        return prev.filter((p) => !backendModules.includes(p.module));
      }
    });
  };

  const getSelectedModuleCount = () => {
    const selectedModules = new Set();
    selectedPermissions.forEach((p) => {
      selectedModules.add(p.module);
    });
    return selectedModules.size;
  };

  const handleSavePermissions = async () => {
    if (!roleId) return;

    setIsSaving(true);
    toast.loading("Updating permissions...");

    try {
      const cleanPermissions = selectedPermissions.map(
        ({ module, action }) => ({
          module,
          action,
        })
      );

      const updateData = {
        id: roleId,
        permissions: cleanPermissions,
      };

      const response = await updateRoleBasedAccessControl(updateData).unwrap();

      toast.dismiss();
      toast.success(response?.message || "Permissions updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      toast.dismiss();
      console.error("Failed to update permissions:", error);
      toast.error(error?.data?.message || "Failed to update permissions");

      setSelectedPermissions(permissions);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setSelectedPermissions(permissions);
    setIsEditing(false);
  };

  const handleRemoveUser = async () => {
    if (!roleId || !pendingRemove) return;

    const { userId, username } = pendingRemove;
    toast.loading(`Removing ${username} from role...`);

    try {
      const response = await removeUser({
        roleId,
        userId,
      }).unwrap();

      if (response.success) {
        toast.dismiss();
        toast.success(response.message || `User removed successfully!`);
        refetchUsers();
      }
    } catch (error) {
      toast.dismiss();
      console.error("Failed to remove user:", error);
      toast.error("Failed to remove user from role");
    } finally {
      setPendingRemove(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <AlertDialog
        open={!!pendingRemove}
        onOpenChange={(open) => !open && setPendingRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-semibold text-foreground">
                {pendingRemove?.username}
              </span>{" "}
              from this role?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleRemoveUser}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Role Details - {roleName}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {activeTab === "permissions"
                  ? `${getSelectedModuleCount()} modules selected ${isEditing ? "(Editing)" : ""}`
                  : `${roleUsersData?.users?.length || 0} users assigned`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
              disabled={isLoading || isSaving || isUpdating}
            >
              <X size={24} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b px-6">
            <button
              onClick={() => setActiveTab("permissions")}
              className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors cursor-pointer ${
                activeTab === "permissions"
                  ? "border-yellow-400 text-yellow-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Permissions
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors cursor-pointer ${
                activeTab === "users"
                  ? "border-yellow-400 text-yellow-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Assigned Users ({roleUsersData?.users?.length || 0})
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[70vh] no-scrollbar">
            {activeTab === "permissions" ? (
              // Permissions View with hierarchical menu
              <>
                {/* Edit/Save Controls */}
                <div className="flex justify-end mb-4 space-x-2">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors cursor-pointer text-sm font-medium"
                      disabled={isUpdating || isSaving}
                    >
                      Edit Permissions
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer text-sm font-medium"
                        disabled={isSaving || isUpdating}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSavePermissions}
                        disabled={isSaving || isUpdating}
                        className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors cursor-pointer text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {isSaving || isUpdating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={16} className="mr-1" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>

                {/* Permissions Tree with original design */}
                <div className="space-y-3">
                  {MENU_TREE.map((node) => (
                    <MenuTreeItem
                      key={node.id}
                      node={node}
                      selectedPermissions={selectedPermissions}
                      onToggle={handlePermissionToggle}
                      expandedNodes={expandedNodes}
                      onToggleExpand={toggleExpand}
                      isEditing={isEditing}
                    />
                  ))}
                </div>
              </>
            ) : (
              // Users View
              <div className="space-y-4">
                {isLoadingUsers ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                  </div>
                ) : roleUsersData?.users && roleUsersData.users.length > 0 ? (
                  <div className="divide-y">
                    {roleUsersData.users.map((user: User) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between py-3"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                              <span className="text-yellow-600 font-medium">
                                {user.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                {user.username}
                              </p>
                              <p className="text-sm text-gray-500">
                                {user.email}
                              </p>
                              {user.phone && (
                                <p className="text-xs text-gray-400">
                                  {user.phone}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            setPendingRemove({
                              userId: user.id,
                              username: user.username,
                            })
                          }
                          disabled={isRemovingUser}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Remove user from role"
                        >
                          <UserMinus size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      <svg
                        className="w-12 h-12 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500">
                      No users assigned to this role
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PermissionsModal;