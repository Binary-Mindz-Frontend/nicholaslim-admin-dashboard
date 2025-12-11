import { useState } from "react";
import { Ban, Pencil, Trash2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useDeleteRiderProfileMutation, useSuspendRiderProfileMutation, useUnsuspendRiderProfileMutation } from "@/redux/features/drivers/driversApi";

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
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [unsuspendDialogOpen, setUnsuspendDialogOpen] = useState(false);
  const [suspendedDuration, setSuspendedDuration] = useState<Date>();
  const [suspensionReason, setSuspensionReason] = useState("");
  const navigate = useNavigate();
  const [deleteRider, { isLoading }] = useDeleteRiderProfileMutation();
  const [suspendRider, { isLoading: isSuspending }] = useSuspendRiderProfileMutation();
  const [unsuspendRider, { isLoading: isUnsuspending }] = useUnsuspendRiderProfileMutation();

  const handleEdit = () => {
    navigate(`/driver-list/${row.id}`);
  };

  const handleDelete = async () => {
    try {
      
       await deleteRider(row.userId).unwrap();
      
      toast.success(`Driver ${row.registrations?.[0]?.raider_name || 'Rider'} deleted successfully!`);
      setOpen(false);
      
      // Trigger refetch after successful deletion
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete driver");
    }
  };

  const handleSuspend = async () => {
    if (!suspendedDuration) {
      toast.error("Please select a suspension date");
      return;
    }
    
    if (!suspensionReason.trim()) {
      toast.error("Please provide a suspension reason");
      return;
    }
    
    try {
      const suspendData = {
        suspendedDuration: suspendedDuration.toISOString(),
        suspensionReason,
      };
      
      await suspendRider({ id: row.id, data: suspendData }).unwrap();
      
      toast.success(`Driver ${row.registrations?.[0]?.raider_name || 'Rider'} suspended successfully!`);
      
      // Close modal and reset form
      setSuspendModalOpen(false);
      setSuspendedDuration(undefined);
      setSuspensionReason("");
      
      // Trigger refetch after successful suspension
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to suspend driver");
    }
  };

  const handleUnsuspend = async () => {
    try {
      await unsuspendRider(row.id).unwrap();
      
      toast.success(`Driver ${row.registrations?.[0]?.raider_name || 'Rider'} unsuspended successfully!`);
      
      // Close dialog
      setUnsuspendDialogOpen(false);
      
      // Trigger refetch after successful unsuspension
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to unsuspend driver");
    }
  };

  const handleBanClick = () => {
    if (row.isSuspended) {
      setUnsuspendDialogOpen(true);
    } else {
      setSuspendModalOpen(true);
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

      {/* SUSPEND ICON */}
      <button 
        className="p-2 rounded hover:bg-red-200 transition"
        onClick={handleBanClick}
        type="button"
      >
        <Ban className="h-4 w-4  text-red-600" />
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

      {/* SUSPEND MODAL */}
      <Dialog open={suspendModalOpen} onOpenChange={setSuspendModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend Driver</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="suspendedDuration">Suspended Duration</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !suspendedDuration && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {suspendedDuration ? format(suspendedDuration, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={suspendedDuration}
                    onSelect={setSuspendedDuration}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="suspensionReason">Suspension Reason</Label>
              <Textarea
                id="suspensionReason"
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                placeholder="Enter reason for suspension"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSuspendModalOpen(false)}
              disabled={isSuspending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSuspend}
              className="bg-red-600 hover:bg-red-700"
              disabled={isSuspending}
            >
              {isSuspending ? "Suspending..." : "Suspend"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* UNSUSPEND DIALOG */}
      <AlertDialog open={unsuspendDialogOpen} onOpenChange={setUnsuspendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Suspension?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove the suspension for driver{" "}
              <b>{row.registrations?.[0]?.raider_name || 'this rider'}</b>? 
              This will restore their access immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUnsuspending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={handleUnsuspend}
              disabled={isUnsuspending}
            >
              {isUnsuspending ? "Removing..." : "Remove Suspension"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}