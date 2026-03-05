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
import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  UserMinus,
  Save,
  ChevronDown,
  ChevronRight,
  Check,
  Minus,
} from "lucide-react";
import toast from "react-hot-toast";

// Import menu items and mapping
import { menuItems, MenuItem } from "@/components/Shared/Sidebar/MenuItems";
import {
  menuToPermissionMapping,
  getSelectionModules,
} from "@/utils/permissionMapping";

import { MODULE_ACTIONS } from "@/pages/Admin/AddRemovePermission/AddRemovePermission";
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
  level?: number;
}

// Professional Checkbox Component
const CustomCheckbox: React.FC<{
  checked: boolean;
  indeterminate?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
}> = ({ checked, indeterminate, onChange, disabled, className }) => {
  return (
    <div className={`relative inline-flex items-center ${className || ""}`}>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <div
        className={`
          w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105"}
          ${checked || indeterminate
            ? "bg-yellow-500 border-yellow-500 shadow-md"
            : "bg-white border-gray-300 hover:border-yellow-400 hover:shadow-sm"
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
          <Check className="w-3.5 h-3.5 text-white stroke-3" />
        )}
        {indeterminate && <Minus className="w-3.5 h-3.5 text-white stroke-3" />}
      </div>
    </div>
  );
};

// Build a tree structure from menu items
const buildMenuTree = (
  items: MenuItem[],
  parentId?: string,
  level: number = 0,
): MenuNode[] => {
  return items
    .filter((item) => item.id !== "login" && item.id !== "" && item.id !== "admin")
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

// Find modules from children in menu tree
const findChildModules = (nodes: MenuNode[], targetId: string): string[] => {
  for (const node of nodes) {
    if (node.id === targetId) {
      const childModules: string[] = [];

      if (node.children) {
        const collectModules = (childNodes: MenuNode[]) => {
          for (const child of childNodes) {
            // Use getSelectionModules to support bundling for children
            childModules.push(...getSelectionModules(child.id));

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

// Helper to find parent permissions for a menu item (e.g. users-web-portal -> user)
const findParentPermissions = (
  menuId: string,
  moduleActions: Record<string, string[]>,
  tree: MenuNode[],
): Permission[] => {
  const findNode = (nodes: MenuNode[], targetId: string): MenuNode | null => {
    for (const node of nodes) {
      if (node.id === targetId) return node;
      if (node.children) {
        const found = findNode(node.children, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  const node = findNode(tree, menuId);
  const parentId = node?.parentId;

  if (!parentId) return [];

  const parentModules = getSelectionModules(parentId);
  const permissions: Permission[] = [];

  for (const module of parentModules) {
    const actions = moduleActions[module] || [];
    actions.forEach((action) => {
      permissions.push({ module, action });
    });
  }

  // Also check grandparents
  return [...permissions, ...findParentPermissions(parentId, moduleActions, tree)];
};

// Get all backend modules for a menu item (including children recursively)
const getAllBackendModulesForMenuItem = (menuId: string, isSelection: boolean = true): string[] => {
  // Use getSelectionModules for selection, otherwise stick to direct mapping for deselection
  const directModules = isSelection ? getSelectionModules(menuId) : (menuToPermissionMapping[menuId] || []);

  const findChildModules = (nodes: MenuNode[], targetId: string): string[] => {
    for (const node of nodes) {
      if (node.id === targetId) {
        const childModules: string[] = [];

        if (node.children) {
          const collectModules = (childNodes: MenuNode[]) => {
            for (const child of childNodes) {
              // Same logic for child modules
              const childDirect = isSelection ? getSelectionModules(child.id) : (menuToPermissionMapping[child.id] || []);
              childModules.push(...childDirect);

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

  // Combine all modules and remove duplicates, filtering by active MODULE_ACTIONS
  return [
    ...new Set([
      ...directModules,
      ...childModules,
    ]),
  ].filter(mod => !!MODULE_ACTIONS[mod]);
};

// Extract all unique modules currently mapped in the menu tree to prevent ghost permissions
const ALL_ACTIVE_TREE_MODULES = new Set<string>();
MENU_TREE.forEach(node => {
  getAllBackendModulesForMenuItem(node.id).forEach(mod => ALL_ACTIVE_TREE_MODULES.add(mod));
});

// Get all permissions for a menu item (including children recursively AND parents recursively for selection)
const getAllPermissionsForMenuItem = (
  menuId: string,
  moduleActions: Record<string, string[]>,
): Permission[] => {
  const backendModules = getAllBackendModulesForMenuItem(menuId);
  const parentPermissions = findParentPermissions(
    menuId,
    moduleActions,
    MENU_TREE,
  );

  const permissions: Permission[] = [];

  // Add the modules for this item and its children
  for (const module of backendModules) {
    const actions = moduleActions[module] || [];
    actions.forEach((action) => {
      permissions.push({ module, action });
    });
  }

  // Add parent permissions (toggle up)
  return [...permissions, ...parentPermissions];
};

// Helper to check if a menu or any of its children have any permission
const hasAnyPermissionLocal = (
  menuId: string,
  selectedPermissions: Permission[],
  moduleActions: Record<string, string[]>,
): boolean => {
  console.log(moduleActions, "moduleActions")
  const backendModules = getAllBackendModulesForMenuItem(menuId);
  return backendModules.some(mod =>
    selectedPermissions.some(p => p.module === mod)
  );
};

// Helper to check if a menu and all its children have all permissions
const hasAllPermissionsLocal = (
  menuId: string,
  selectedPermissions: Permission[],
  moduleActions: Record<string, string[]>,
): boolean => {
  const backendModules = getAllBackendModulesForMenuItem(menuId);
  if (backendModules.length === 0) return false;

  return backendModules.every(mod => {
    const requiredActions = moduleActions[mod] || [];
    const actualPermissions = selectedPermissions.filter(p => p.module === mod);

    if (requiredActions.length === 0) return actualPermissions.length > 0;
    return actualPermissions.length === requiredActions.length;
  });
};

// Helper to check for partial permissions
const hasPartialPermissionsLocal = (
  menuId: string,
  selectedPermissions: Permission[],
  moduleActions: Record<string, string[]>,
): boolean => {
  const hasAny = hasAnyPermissionLocal(menuId, selectedPermissions, moduleActions);
  const hasAll = hasAllPermissionsLocal(menuId, selectedPermissions, moduleActions);
  return hasAny && !hasAll;
};

// Recursive component to render menu tree with professional styling
const MenuTreeItem: React.FC<{
  node: MenuNode;
  selectedPermissions: Permission[];
  onToggle: (menuId: string, checked: boolean) => void;
  expandedNodes: Set<string>;
  onToggleExpand: (nodeId: string) => void;
  isEditing: boolean;
  moduleActions: Record<string, string[]>;
}> = ({
  node,
  selectedPermissions,
  onToggle,
  expandedNodes,
  onToggleExpand,
  isEditing,
  moduleActions,
}) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);

    const hasPermission = hasAnyPermissionLocal(
      node.id,
      selectedPermissions,
      moduleActions,
    );
    const hasAll = hasAllPermissionsLocal(
      node.id,
      selectedPermissions,
      moduleActions,
    );
    const hasPartial = hasPartialPermissionsLocal(
      node.id,
      selectedPermissions,
      moduleActions,
    );

    // Background color based on state
    let bgColor = "bg-white";
    let borderColor = "border-gray-200";
    let textColor = "text-gray-700";

    if (hasAll) {
      bgColor = "bg-green-50";
      borderColor = "border-green-200";
      textColor = "text-green-700";
    } else if (hasPartial) {
      bgColor = "bg-yellow-50";
      borderColor = "border-yellow-200";
      textColor = "text-yellow-700";
    }

    const handleToggle = () => {
      if (hasChildren) {
        onToggleExpand(node.id);
      }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      if (isEditing) {
        onToggle(node.id, e.target.checked);
      }
    };

    const getCheckboxState = () => {
      if (hasAll) return "checked";
      if (hasPartial) return "indeterminate";
      return "unchecked";
    };

    const checkboxState = getCheckboxState();

    const marginLeft = node.level ? `${node.level * 1.5}rem` : "0";

    return (
      <div className="select-none">
        <div
          className={`
          flex items-center py-2.5 px-3 rounded-xl transition-all duration-200
          ${bgColor} ${borderColor} border
          hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm
          ${hasChildren ? "cursor-pointer" : ""}
          ${isEditing ? "hover:border-yellow-400" : ""}
        `}
          style={{ marginLeft }}
          onClick={handleToggle}
        >
          <div className="flex items-center flex-1 min-w-0">
            {hasChildren && (
              <div className="mr-1 shrink-0">
                {isExpanded ? (
                  <ChevronDown className={`w-4 h-4 ${textColor}`} />
                ) : (
                  <ChevronRight className={`w-4 h-4 ${textColor}`} />
                )}
              </div>
            )}
            {!hasChildren && <div className="w-5 mr-1 shrink-0" />}

            <CustomCheckbox
              checked={checkboxState === "checked"}
              indeterminate={checkboxState === "indeterminate"}
              onChange={handleCheckboxChange}
              className="mr-3 shrink-0"
              disabled={!isEditing}
            />

            <span className={`flex-1 text-sm font-medium ${textColor} truncate`}>
              {node.label}
            </span>

            {hasPermission && (
              <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full shrink-0 font-medium">
                {getAllBackendModulesForMenuItem(node.id).length}
              </span>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-4 border-l-2 border-yellow-100 pl-2 mt-1 space-y-1">
            {node.children?.map((child) => (
              <MenuTreeItem
                key={child.id}
                node={child}
                selectedPermissions={selectedPermissions}
                onToggle={onToggle}
                expandedNodes={expandedNodes}
                onToggleExpand={onToggleExpand}
                isEditing={isEditing}
                moduleActions={moduleActions}
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
  const filterValidPermissions = (perms: Permission[]) =>
    perms.filter(p => p.action && p.action.trim() !== "" && !!MODULE_ACTIONS[p.module] && ALL_ACTIVE_TREE_MODULES.has(p.module));

  const [selectedPermissions, setSelectedPermissions] =
    useState<Permission[]>(filterValidPermissions(permissions));
  const [activeTab, setActiveTab] = useState<"permissions" | "users">(
    "permissions",
  );
  const [pendingRemove, setPendingRemove] = useState<{
    userId: number;
    username: string;
  } | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(["system-configuration"]),
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
    setSelectedPermissions(filterValidPermissions(permissions));
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

  const handlePermissionToggle = useCallback(
    (menuId: string, checked: boolean) => {
      if (!isEditing) return;

      const menuPermissions = getAllPermissionsForMenuItem(
        menuId,
        MODULE_ACTIONS,
      );

      setSelectedPermissions((prev) => {
        if (checked) {
          // Add all permissions for this menu item and its children
          const newPermissions = [...prev];
          const parentPermissions = findParentPermissions(
            menuId,
            MODULE_ACTIONS,
            MENU_TREE,
          );
          const allToAdd = [...menuPermissions, ...parentPermissions];

          allToAdd.forEach((perm) => {
            const exists = prev.some(
              (p) => p.module === perm.module && p.action === perm.action,
            );
            if (!exists) {
              newPermissions.push(perm);
            }
          });
          return newPermissions;
        } else {
          // Remove only the direct permissions for this menu item and its children (not bundled modules)
          const backendModules = getAllBackendModulesForMenuItem(menuId, false);
          return prev.filter(
            (p) => !backendModules.includes(p.module) && p.action && p.action.trim() !== ""
          );
        }
      });
    },
    [isEditing],
  );

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
      // Clean permissions to ensure no duplicates
      const permissionMap = new Map();
      selectedPermissions.forEach(({ module, action }) => {
        if (!action || action.trim() === "") return;
        if (!permissionMap.has(module)) {
          permissionMap.set(module, new Set());
        }
        permissionMap.get(module).add(action);
      });

      // Convert back to array format
      const cleanPermissions: Permission[] = [];
      permissionMap.forEach((actions, module) => {
        actions.forEach((action: string) => {
          cleanPermissions.push({ module, action });
        });
      });

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
              className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors cursor-pointer ${activeTab === "permissions"
                ? "border-yellow-400 text-yellow-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
              Permissions
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors cursor-pointer ${activeTab === "users"
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
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
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

                {/* Info Box when editing */}
                {isEditing && (
                  <div className="mb-4 p-3 bg-linear-to-r from-yellow-50 to-blue-50 border border-yellow-100 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <div className="shrink-0 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">i</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-yellow-700">
                          <span className="font-semibold">Note:</span> Selecting
                          a parent item grants all permissions for that section
                          and its children. The sidebar will only show items
                          that have at least one permission assigned.
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1">
                            <div className="w-4 h-4 bg-green-500 rounded flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-xs text-gray-600">Full</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-4 h-4 bg-yellow-500 rounded flex items-center justify-center">
                              <Minus className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-xs text-gray-600">
                              Partial
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Permissions Tree */}
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
                      moduleActions={MODULE_ACTIONS}
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
