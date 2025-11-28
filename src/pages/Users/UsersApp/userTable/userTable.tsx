"use client"
import { useState } from "react";
import { Column } from "@/components/Dashboard/DataTable/DataTable";
import { Switch } from "@/components/ui/switch";
import ActionCell from "../ActionCell/ActionCell";
import { TUser } from "../data/usersData";


// State management hook
export const useUserColumns = (initialData: TUser[]) => {
    const [users, setUsers] = useState<TUser[]>(initialData);

    const handleToggleActive = (userId: string) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === userId ? { ...user, isActive: !user.isActive } : user
            )
        );
    };

    const userColumns: Column<TUser>[] = [
        {
            header: "User ID",
            accessor: "id",
            cell: (row: TUser) => (
                <a href="#" className="text-blue-600 underline">
                    {row.id}
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
            cell: (row: TUser) => (
                <span>{row.contact.slice(0, 2) + "******"}</span>
            ),
        },

        {
            header: "Total Order",
            accessor: "totalOrder",
        },

        {
            header: "Total Order Account",
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
                        checked={row.isActive}
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

    return { userColumns, users };
};