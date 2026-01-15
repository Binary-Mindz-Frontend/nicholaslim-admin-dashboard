import { useState, useEffect } from "react";
import { useGetUserTypesQuery, useToggleUserActiveStatusMutation } from "@/redux/features/usersTypes/usersTypesApi";
import { Column } from "@/components/Dashboard/DataTable/DataTable";
import { Switch } from "@/components/ui/switch";
import ActionCell from "../ActionCell/ActionCell";
import { TUser } from "../data/usersData";
import toast from "react-hot-toast"; // Import toast

interface UseUserColumnsParams {
  status?: string;
  dateFilter?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

export const useUserColumns = (params: UseUserColumnsParams = {}) => {
  const [users, setUsers] = useState<TUser[]>([]);

  // Fetch user data using the custom RTK query hook with params
  const { data: usersData, isLoading, isError } = useGetUserTypesQuery({
    status: params.status || "",
    dateFilter: params.dateFilter || "",
    page: params.page || 1,
    limit: params.limit || 10,
    sortBy: params.sortBy || "createdAt",
    sortOrder: params.sortOrder || "desc",
  });

  // Add the mutation hook
  const [toggleActiveStatus] = useToggleUserActiveStatusMutation();

  // Update users when data is fetched
  useEffect(() => {
    if (usersData?.data?.data) {
      setUsers(usersData.data.data);
    }
  }, [usersData]);

  // Handle toggle active status - now calls the API
  const handleToggleActive = async (userId: string) => {
    try {
      // Optimistic update (update UI immediately)
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, activeStatus: !user.activeStatus } : user
        )
      );

      // Call the API to update on the server
      await toggleActiveStatus(userId).unwrap();

      // Show success toast if successful
      toast.success("User status updated successfully!");

    } catch (error) {
      console.error("Failed to toggle active status:", error);

      // Revert the optimistic update on error
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, activeStatus: !user.activeStatus } : user
        )
      );

      // Show error toast if failed
      toast.error("Failed to update user status. Please try again.");
    }
  };

  // Column definitions for the table
  const userColumns: Column<TUser>[] = [
    {
      header: "User ID",
      accessor: "id",
      cell: (row: TUser) => (
        <p>
          U{row.id}
        </p>
      ),
    },

    {
      header: "FullName",
      accessor: "name",
      cell: (row: TUser) => (
        <p>
          {row.name}
        </p>
      ),
    },
    {
      header: "Email Address",
      accessor: "contactEmail",
      cell: (row: TUser) => (
        <div className="whitespace-normal wrap-break-word">
          {row.contactEmail}
        </div>
      ),
    },


    {
      header: "Phone Number",
      cell: (row: TUser) => {
        const contact = row.contactNum || "";
        return <span>{contact}</span>;
      },
    },

    {
      header: "Total Order",
      accessor: "totalOrders",
    },

    {
      header: "Total Order Amount",
      accessor: "totalCost",
    },

    {
      header: "Joining Date",
      accessor: "joiningDate",
    },

    {
      header: "Active/Inactive",
      cell: (row: TUser) => (
        <div
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Switch
            checked={row.activeStatus}
            onCheckedChange={() => handleToggleActive(row.id)}
            className="data-[state=checked]:bg-green data-[state=unchecked]:bg-gray-300"
          />
        </div>
      ),
    },
    {
      header: "Action",
      cell: (user: TUser) => {
        return <ActionCell row={user} />;
      },
    },
  ];

  // Get total count from API response
  const totalItems = usersData?.data?.meta?.total || usersData?.data?.total || 0;

  return { userColumns, users, isLoading, isError, totalItems };
};