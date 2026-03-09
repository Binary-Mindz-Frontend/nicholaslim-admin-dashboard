/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Check, Search, UserRoundPlus } from "lucide-react";
import toast from "react-hot-toast";
import { useGetWebUserTypesQuery } from "@/redux/features/usersTypes/usersTypesApi";
import { useAddaddUserToRoleMutation } from "@/redux/features/roleBasedAccessControl/roleBasedAccessControlApi";

interface WebUser {
  id: number;
  name: string;
  contactNum: string;
  contactEmail: string;
  totalOrders: number;
  totalCost: number;
  joiningDate: string;
  activeStatus: boolean;
  is_verified: boolean;
  is_deleted: boolean;
  role: string[];
  regi_status: string;
}

interface RoleUser {
  id: number;
  username: string;
  email: string;
  phone?: string;
}

const AssignUsersTab: React.FC<{
  roleId: number;
  roleUsers: RoleUser[];
  onUserAssigned: () => void;
}> = ({ roleId, roleUsers, onUserAssigned }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<WebUser | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [addingUserId, setAddingUserId] = useState<number | null>(null);
  const itemsPerPage = 10;

  const {
    data: webUsersData,
    isLoading: isLoadingWebUsers,
    refetch: refetchWebUsers,
  } = useGetWebUserTypesQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm || undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [addUserToRole, { isLoading: isAddingUser }] =
    useAddaddUserToRoleMutation();

  // Extract users from the response
  const users = webUsersData?.data?.data || [];

  // Get total pages from pagination info
  const totalPages = Math.ceil((webUsersData?.data?.total || 0) / itemsPerPage);
  const totalUsers = webUsersData?.data?.total || 0;

  // Filter out users that are already assigned to the role
  const availableUsers = users.filter(
    (user: WebUser) => !roleUsers?.some((roleUser) => roleUser.id === user.id),
  );

  const handleAddUser = async (user: WebUser) => {
    setAddingUserId(user.id);

    const loadingToast = toast.loading(`Adding ${user.name} to role...`);

    try {
      const response = await addUserToRole({
        roleId,
        userId: user.id,
      }).unwrap();

      toast.dismiss(loadingToast);
      toast.success(response?.message || "User added to role successfully!");

      // Reset selection and refresh data
      setSelectedUser(null);

      // Refetch both the role users and available web users
      onUserAssigned();
      refetchWebUsers();
    } catch (error: any) {
      toast.dismiss(loadingToast);
      console.error("Failed to add user:", error);
      toast.error(error?.data?.message || "Failed to add user to role");
    } finally {
      setAddingUserId(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Don't show data if there's an issue
  if (webUsersData && !webUsersData?.data?.data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Unable to load users data</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on new search
          }}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
        />
      </div>

      {/* Users List */}
      <div className="border rounded-lg divide-y max-h-96 overflow-y-auto">
        {isLoadingWebUsers ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
          </div>
        ) : availableUsers.length > 0 ? (
          availableUsers.map((user: WebUser) => (
            <div
              key={user.id}
              className={`flex items-center justify-between p-3 transition-colors ${
                selectedUser?.id === user.id
                  ? "bg-yellow-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <div
                className="flex items-center space-x-3 flex-1 cursor-pointer"
                onClick={() => setSelectedUser(user)}
              >
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-medium">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.contactEmail}</p>
                  {user.contactNum && (
                    <p className="text-xs text-gray-400">{user.contactNum}</p>
                  )}
                  {user.role && user.role.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.role.map((r, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {selectedUser?.id === user.id && (
                  <Check className="w-5 h-5 text-yellow-500" />
                )}

                {/* Add Icon Button */}
                <button
                  onClick={() => handleAddUser(user)}
                  disabled={isAddingUser && addingUserId === user.id}
                  className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Add user to role"
                >
                  {isAddingUser && addingUserId === user.id ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                  ) : (
                    <UserRoundPlus size={20} className="cursor-pointer" />
                  )}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <UserRoundPlus className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-500">
              {searchTerm
                ? "No users found matching your search"
                : "No available users to assign"}
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                className="mt-2 text-sm text-yellow-600 hover:text-yellow-700"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination - Only show if there are multiple pages */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-sm text-gray-500">
            Showing page {currentPage} of {totalPages}
            {totalUsers > 0 && (
              <span className="ml-1">(Total {totalUsers} users)</span>
            )}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Bottom Add Button (optional) */}
      {selectedUser && (
        <div className="flex justify-end border-t pt-4">
          <button
            onClick={() => handleAddUser(selectedUser)}
            disabled={isAddingUser}
            className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isAddingUser ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                <span>Adding {selectedUser.name}...</span>
              </>
            ) : (
              <>
                <UserRoundPlus size={18} />
                <span>Add Selected User to Role</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AssignUsersTab;
