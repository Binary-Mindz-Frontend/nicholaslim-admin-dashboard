import { useState, useEffect } from "react";
import { useGetUserTypesQuery } from "@/redux/features/usersTypes/usersTypesApi"; // RTK Query hook
import { Column } from "@/components/Dashboard/DataTable/DataTable";
import { Switch } from "@/components/ui/switch";
import ActionCell from "../ActionCell/ActionCell";
import { TUser } from "../data/usersData";

export const useUserColumns = () => {
  const [users, setUsers] = useState<TUser[]>([]);

  // Fetch user data using the custom RTK query hook
  const { data: usersData, isLoading, isError } = useGetUserTypesQuery({
    active: "", // Filter active status if needed
    verified: "", // Filter verified status if needed
    deleted: "", // Add other filters if needed
    dateFilter: "", // Apply date filter if needed
  });

  // Update users when data is fetched and avoid setting data before it's available
  useEffect(() => {
    if (usersData?.data?.data) {
      setUsers(usersData.data.data); // Set users data after fetching
    }
  }, [usersData]); // Only update when usersData changes

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
        // Check if contact exists and is a valid string before calling slice
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

  return { userColumns, users, isLoading, isError };
};
