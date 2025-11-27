"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { TDriver } from "../../data/DriverData";

type Props = {
  row: TDriver;
};

export default function DriverAction({ row }: Props) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleDelete = () => {
    console.log("Delete Driver:", row.id);
    setOpen(false);
  };

  return (
    <div className="flex items-center justify-center gap-3">
      {/* EDIT ICON */}
      <button className="p-2 rounded hover:bg-gray-200 transition">
        <Pencil className="h-4 w-4 text-blue-600"
        onClick={() => navigate(`/driver-list/${row.id}`)}
        />
      </button>

      {/* DELETE ICON + ALERT DIALOG */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <button className="p-2 rounded hover:bg-red-100 transition">
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Driver?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              driver <b>{row.name}</b> from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
