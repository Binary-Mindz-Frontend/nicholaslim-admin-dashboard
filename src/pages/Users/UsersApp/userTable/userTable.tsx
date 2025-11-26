"use client"
import { useState } from "react";
import { Column } from "@/components/Dashboard/DataTable/DataTable";
import { Switch } from "@/components/ui/switch";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,

} from "@/components/ui/alert-dialog"



// Type
export type TUser = {
    id: string;
    name: string;
    contact: string;
    totalOrder: number;
    totalOrderAmount: string;
    joiningDate: string;
    isActive: boolean;
};

// State management hook
export const useUserColumns = (initialData: TUser[]) => {
    const [openDelete, setOpenDelete] = useState(false);
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
            cell: () => {

                return (
                    <>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-gray-100"
                                >
                                    <MoreHorizontal size={18} />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-36">
                                {/* VIEW */}
                                <DropdownMenuItem
                                    onClick={() => console.log("View clicked")}
                                    className="flex items-center gap-2"
                                >
                                    <Eye size={16} className="text-blue-600" />
                                    <span>View</span>
                                </DropdownMenuItem>

                                {/* EDIT */}
                                <DropdownMenuItem
                                    onClick={() => console.log("Edit clicked")}
                                    className="flex items-center gap-2"
                                >
                                    <Pencil size={16} className="text-teal-600" />
                                    <span>Edit</span>
                                </DropdownMenuItem>

                                {/* DELETE → OPEN ALERT DIALOG */}
                                <DropdownMenuItem
                                    onClick={() => setOpenDelete(true)}
                                    className="flex items-center gap-2 text-red-600"
                                >
                                    <Trash2 size={16} />
                                    <span>Delete</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* ALERT DIALOG */}
                        <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete this
                                        record.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => {
                                            console.log("Record deleted!");
                                        }}
                                    >
                                        Yes, Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </>
                );
            },
        }
        ,
    ];

    return { userColumns, users };
};