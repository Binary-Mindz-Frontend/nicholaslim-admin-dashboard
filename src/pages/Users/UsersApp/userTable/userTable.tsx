import { useState, useEffect } from "react";
import { useGetUserTypesQuery } from "@/redux/features/usersTypes/usersTypesApi";
import { Column } from "@/components/Dashboard/DataTable/DataTable";
import { Switch } from "@/components/ui/switch";
import ActionCell from "../ActionCell/ActionCell";
import { TUser } from "../data/usersData";

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

  // Update users when data is fetched
  useEffect(() => {
    if (usersData?.data?.data) {
      setUsers(usersData.data.data);
    }
  }, [usersData]);

  // Handle toggle active status
  const handleToggleActive = (userId: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      )
    );
  };

  // Column definitions for the table
  const userColumns: Column<TUser>[] = [
    {
      header: "User ID",
      accessor: "id",
      cell: (row: TUser) => (
        <a href="#" className="text-blue-600 underline">
          U{row.id}
        </a>
      ),
    },

    {
      header: "Name",
      accessor: "name",
      cell: (row: TUser) => (
        <a href="#" className="text-blue-600 underline">
          {row.name}
        </a>
      ),
    },

    {
      header: "Contact",
      cell: (row: TUser) => {
        const contact = row.contact || "";
        return <span>{contact.slice(0, 2) + "******"}</span>;
      },
    },

    {
      header: "Total Order",
      accessor: "totalOrder",
    },

    {
      header: "Total Order Amount",
      accessor: "totalOrderAmount",
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