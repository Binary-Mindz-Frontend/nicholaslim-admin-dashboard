import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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
import { useDeleteRiderProfileMutation } from "@/redux/features/drivers/driversApi";

interface Registration {
  raider_name: string;
}

interface TDriver {
  id: number;
  userId: number;
  is_online: boolean;
  is_available: boolean;
  raider_status: string;
  LoginType: string;
  raider_verificationFromAdmin: string;
  isSuspended: boolean;
  suspendedDuration: number | null;
  suspensionReason: string | null;
  created_at: string;
  updated_at: string;
  registrations: Registration[];
}

type Props = {
  row: TDriver;
  onDeleteSuccess?: () => void;
};

export default function DriverAction({ row, onDeleteSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [deleteRider, { isLoading }] = useDeleteRiderProfileMutation();

  const handleEdit = () => {
    // Use userId instead of id if that's what your API expects
    // Or use row.id if that's the correct identifier
    console.log("Editing driver with ID:", row.id, "UserID:", row.userId, row);
    navigate(`/driver-list/${row.id}`);
  };

  const handleDelete = async () => {
    try {
      console.log("Deleting rider with userId:", row.userId);
      
      const result = await deleteRider(row.userId).unwrap();
      
      console.log("Delete API Response:", result);
      toast.success(`Driver ${row.registrations?.[0]?.raider_name || 'Rider'} deleted successfully!`);
      setOpen(false);
      
      // Trigger refetch after successful deletion
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Delete failed with error:", error);
      toast.error(error?.data?.message || "Failed to delete driver");
    }
  };

  return (
    <div className="flex items-center justify-center gap-3">
      {/* EDIT ICON */}
      <button 
        className="p-2 rounded hover:bg-gray-200 transition"
        onClick={handleEdit}
        type="button"
      >
        <Pencil className="h-4 w-4 text-blue-600" />
      </button>

      {/* DELETE ICON + ALERT DIALOG */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <button className="p-2 rounded hover:bg-red-100 transition" type="button">
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Driver?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              driver <b>{row.registrations?.[0]?.raider_name || 'this rider'}</b> from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}