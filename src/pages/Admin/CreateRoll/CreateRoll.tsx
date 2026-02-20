import CustomTable from "@/components/Dashboard/DataTable/DataTable";
import {
  useAddRoleBasedAccessControlMutation,
  useDeleteRoleBasedAccessControlMutation,
  useGetRoleBasedAccessControlQuery,
  useUpdateRoleBasedAccessControlRoleMutation,
  useUpdateRoleBasedAccessControlStatusMutation,
} from "@/redux/features/roleBasedAccessControl/roleBasedAccessControlApi";
import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  // MoreVertical,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import RoleFormModal from "@/components/Dashboard/CreateRoll/RoleFormModal";
import ConfirmModal from "@/components/Dashboard/CreateRoll/ConfirmModal";
import PermissionsModal from "@/components/Dashboard/CreateRoll/PermissionsModal";
import toast from "react-hot-toast";

interface Role {
  id: number;
  name: string;
  isStatic: boolean;
  isActive: boolean;
  permissions: any[];
  _count: {
    users: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

const CreateRoll: React.FC = () => {
  const {
    data: roles,
    isLoading,
    error,
  } = useGetRoleBasedAccessControlQuery("");
  const [addRole] = useAddRoleBasedAccessControlMutation();
  const [updateRole] = useUpdateRoleBasedAccessControlRoleMutation();
  const [updateStatus] = useUpdateRoleBasedAccessControlStatusMutation();
  const [deleteRole] = useDeleteRoleBasedAccessControlMutation();

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

  // Selected role states
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [editRoleData, setEditRoleData] = useState({ name: "" });

  // Handle form submission for creating role
  const handleCreateRole = async (data: {
    name: string;
    permissions: any[];
  }) => {
    toast.loading("Creating role...");
    try {
      const response = await addRole(data).unwrap();

      if (response.success) {
        setShowCreateModal(false);
        toast.dismiss();
        toast.success(response.message || "Role created successfully!");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Failed to add role:", error);
      toast.error("Failed to add role");
    }
  };

  // Handle form submission for editing role
  const handleEditRole = async (data: { name: string; permissions: any[] }) => {
    if (!selectedRole) return;

    toast.loading("Updating role...");

    try {
      const response = await updateRole({
        id: selectedRole.id,
        name: data.name,
      }).unwrap();

      if (response.success) {
        setShowEditModal(false);
        toast.dismiss();
        toast.success(response.message || "Role updated successfully!");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Failed to update role:", error);
      toast.error("Failed to update role");
    }
  };

  // Handle delete role
  const handleDeleteRole = async () => {
    if (!selectedRole) return;

    toast.loading("Deleting role...");

    try {
      const response = await deleteRole(selectedRole.id).unwrap();

      if (response.success) {
        setShowDeleteModal(false);
        toast.dismiss();
        toast.success(response.message || "Role deleted successfully!");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Failed to delete role:", error);
      toast.error("Failed to delete role");
    }
  };

  // Handle status toggle
  const handleToggleStatus = async (id: number) => {
    toast.loading("Updating status...");

    try {
      const response = await updateStatus(id).unwrap();

      if (response.success) {
        toast.dismiss();
        toast.success(response.message || "Status updated successfully!");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    }
  };

  // Define table columns
  const orderColumns = [
    {
      header: "ID",
      accessor: "id" as const,
    },
    {
      header: "Role Name",
      accessor: "name" as const,
    },
    {
      header: "Created Date",
      cell: (row: Role) => (
        <span className="text-gray-600">
          {row.createdAt
            ? new Date(row.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "N/A"}
        </span>
      ),
    },
    {
      header: "Active/Inactive",
      cell: (row: Role) => (
        <div
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Switch
            checked={row.isActive}
            onCheckedChange={() => handleToggleStatus(row.id)}
            className="data-[state=checked]:bg-green data-[state=unchecked]:bg-gray-300 cursor-pointer"
          />
        </div>
      ),
    },
    {
      header: "Actions",
      cell: (row: Role) => (
        <div className="flex items-center space-x-2 justify-center">
          {/* View/Edit Permissions Button */}
          <button
            onClick={() => {
              setSelectedRole(row);
              setShowPermissionsModal(true);
            }}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors cursor-pointer"
            title="View/Edit Permissions"
          >
            <Eye size={18} />
          </button>

          {/* Edit Button */}
          <button
            onClick={() => {
              setSelectedRole(row);
              setEditRoleData({ name: row.name });
              setShowEditModal(true);
            }}
            disabled={row._count.users > 0 || row.isStatic}
            // className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded transition-colors cursor-pointer"
            className={`p-2 rounded transition-colors cursor-pointer ${
              row._count.users > 0 || row.isStatic
                ? "text-gray-400 hover:cursor-not-allowed"
                : "text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50"
            }`}
            title="Edit Role"
          >
            <Edit2 size={18} />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => {
              setSelectedRole(row);
              setShowDeleteModal(true);
            }}
            disabled={row._count.users > 0 || row.isStatic}
            className={`p-2 rounded transition-colors cursor-pointer ${
              row._count.users > 0 || row.isStatic
                ? "text-gray-400 hover:cursor-not-allowed"
                : "text-red-600 hover:text-red-800 hover:bg-red-50"
            }`}
            title={
              row.isStatic
                ? "Cannot delete static role"
                : row._count.users > 0
                ? "Cannot delete role with assigned users"
                : "Delete role"
            }
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading roles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Failed to load roles. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              Role Management
            </h1>
            <p className="text-gray-600 mt-2">
              Create and manage user roles with specific permissions
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-yellow-400 rounded-lg hover:bg-yellow-500 text-black transition-colors cursor-pointer"
          >
            <Plus size={20} className="mr-2" />
            Create New Role
          </button>
        </div>

        {/* Roles Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Existing Roles ({roles?.length || 0})
            </h2>
          </div>

          {roles && roles.length > 0 ? (
            <CustomTable
              columns={orderColumns}
              data={roles}
              isLoading={isLoading}
            />
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No roles found
              </h3>
              <p className="text-gray-500 mb-4">
                Get started by creating your first role
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} className="mr-2" />
                Create Your First Role
              </button>
            </div>
          )}
        </div>

        {/* Create Role Modal */}
        <RoleFormModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateRole}
          title="Create New Role"
          // isLoading={addRole.isLoading}
        />

        {/* Edit Role Modal */}
        <RoleFormModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedRole(null);
          }}
          onSubmit={handleEditRole}
          title="Edit Role"
          initialData={editRoleData}
          // isLoading={updateRole.isLoading}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedRole(null);
          }}
          onConfirm={handleDeleteRole}
          title="Delete Role"
          message={`Are you sure you want to delete the role "${selectedRole?.name}"? This action cannot be undone.`}
          confirmText="Delete Role"
          // isLoading={deleteRole.isLoading}
        />

        {/* Permissions Modal */}
        {selectedRole && (
          <PermissionsModal
            isOpen={showPermissionsModal}
            onClose={() => {
              setShowPermissionsModal(false);
              setSelectedRole(null);
            }}
            permissions={selectedRole.permissions}
            roleName={selectedRole.name}
            roleId={selectedRole.id}
            // isLoading={updateRolePermissions.isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default CreateRoll;
