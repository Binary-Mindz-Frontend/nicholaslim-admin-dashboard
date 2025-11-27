"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
import { TUser } from "../userTable/userTable";

export default function ActionCell({ row }: { row: TUser }) {
  const [openDelete, setOpenDelete] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal size={18} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-36">
          {/* VIEW */}
          <DropdownMenuItem className="flex items-center gap-2">
            <Eye size={16} className="text-blue-600" />
            <span>View</span>
          </DropdownMenuItem>

          {/* EDIT → NAVIGATE */}
          <DropdownMenuItem
            onClick={() => navigate(`/users-app/${row.id}`)}
            className="flex items-center gap-2"
          >
            <Pencil size={16} className="text-teal-600" />
            <span>Edit</span>
          </DropdownMenuItem>

          {/* DELETE */}
          <DropdownMenuItem
            onClick={() => setOpenDelete(true)}
            className="flex items-center gap-2 text-red-600"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* DELETE CONFIRMATION */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                console.log("Deleted", row.id);
              }}
            >
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
