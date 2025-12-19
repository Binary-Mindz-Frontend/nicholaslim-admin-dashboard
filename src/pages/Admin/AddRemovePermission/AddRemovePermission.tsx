import { useState, useEffect } from "react";
import {
  useGetRoleBasedAccessControlQuery,
  useUpdateRoleBasedAccessControlMutation,
} from "@/redux/features/roleBasedAccessControl/roleBasedAccessControlApi";
import { toast } from "react-hot-toast";
import { PermissionFormData, Role } from "@/types/roleBasedAccessControlType";
import RoleSelector from "@/components/Dashboard/AddRemovePermission/RoleSelector";
import PermissionsGrid from "@/components/Dashboard/AddRemovePermission/PermissionsGrid";

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

  const handlePermissionToggle = (permission: string) => {
    const backendModule = FRONTEND_TO_BACKEND_MODULES[permission];
    const moduleActions = MODULE_ACTIONS[backendModule] || [];

    setFormData((prev) => {
      const currentModulePermissions = prev.permissions.filter(
        (p) => p.module === backendModule
      );

      if (currentModulePermissions.length === moduleActions.length) {
        return {
          ...prev,
          permissions: prev.permissions.filter(
            (p) => p.module !== backendModule
          ),
        };
      } else {
        const newPermissions = moduleActions.map((action) => ({
          module: backendModule,
          action,
        }));

        const filteredPermissions = prev.permissions.filter(
          (p) => p.module !== backendModule
        );

        return {
          ...prev,
          permissions: [...filteredPermissions, ...newPermissions],
        };
      }
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

        <PermissionsGrid
          permissions={ALL_PERMISSIONS}
          selectedPermissions={formData.permissions}
          onPermissionToggle={handlePermissionToggle}
          isLoading={isLoadingRoles || isUpdating}
        />

        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!formData.roleId || isUpdating || isLoadingRoles}
            className="px-12 py-3 bg-yellow-400 font-bold hover:bg-yellow-500 text-black rounded transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {isUpdating ? "Updating..." : "Update Permissions"}
          </button>
        </div>
      </div>
    </div>
  );
}

const FRONTEND_TO_BACKEND_MODULES: Record<string, string> = {
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
  // DESTINATION: "destination",
  // "MY RAIDER": "my_raider",
  // REFERRAL: "referral",
  // RBAC: "rbac",
};

const MODULE_ACTIONS: Record<string, string[]> = {
  user: [
    "create",
    "read",
    "update",
    "update_user_profile",
    "update_user_role",
    "update_user_status",
    "delete",
    "get_user_profile",
  ],
  raider: ["create", "read", "update", "delete", "just_admin"],
  order: [
    "create",
    "read",
    "update",
    "add_destination_to_order",
    "order_compitition",
    "get_order_details",
    "order_read_mine",
    "order_read_feed",
    "update_order_status",
    "cancel_order",
    "delete",
  ],
  payment_transaction: [
    "create",
    "read",
    "update_transaction_status",
    "update_transaction_amount",
    "approve_transaction",
    "refund_transaction",
    "delete",
  ],
  live_map: ["read"],
  advertisement: ["create", "read", "delete", "update", "just_admin"],
  content_management: ["create", "read", "delete", "update"],
  wallet: ["create", "read", "delete", "update"],
  notification: ["create", "delete", "update"],
  platform_fee: ["create", "delete", "update", "read"],
  quiz: ["create", "delete", "update", "read", "get_one"],
  coin: ["create", "delete", "update", "read", "get_one"],
  driver_order_competition: ["create", "read", "delete", "update"],
  customer_order_confirmation: ["create", "read", "delete", "update"],
  vechicle_pricing: ["create", "read", "delete", "update", "just_admin"],
  // destination: ["create", "read", "update", "delete", "just_admin"],
  // my_raider: ["create", "read", "delete", "update", "read_admin_my_raider"],
  // referral: ["create", "read", "delete", "update"],
  // rbac: ["create", "read", "delete", "update_rbac_role_permission"],
  support_dispute: ["create", "read", "delete", "update", "just_admin"],
  order_placement: ["create", "read", "delete", "update", "just_admin"],
  report_analytics: ["create", "read", "delete", "update", "just_admin"],
};

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
  // "DESTINATION",
  // "MY RAIDER",
  // "REFERRAL",
  // "RBAC",
];

export { FRONTEND_TO_BACKEND_MODULES, MODULE_ACTIONS, ALL_PERMISSIONS };
