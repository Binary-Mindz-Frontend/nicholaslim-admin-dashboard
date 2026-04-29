import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import {
  useDeleteNotificationMutation,
  useUpdateNotificationMutation,
} from "@/redux/features/notificationServices/notificationServicesApi";

interface ActionCellProps {
  notification: any;
}

export const NotificationActionCell: React.FC<ActionCellProps> = ({
  notification,
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Edit States
  const [title, setTitle] = useState(notification.title);
  const [message, setMessage] = useState(notification.message);

  const [updateNotification, { isLoading: isUpdating }] =
    useUpdateNotificationMutation();
  const [deleteNotification, { isLoading: isDeleting }] =
    useDeleteNotificationMutation();

  const handleUpdate = async () => {
    try {
      await updateNotification({
        id: notification.id,
        body: { title, message },
      }).unwrap();
      toast.success("Notification updated!");
      setIsEditOpen(false);
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNotification(notification.id).unwrap();
      toast.success("Notification deleted!");
      setIsDeleteOpen(false);
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Edit Trigger */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsEditOpen(true)}
        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
      >
        <Edit className="h-4 w-4" />
      </Button>

      {/* Delete Trigger */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsDeleteOpen(true)}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Notification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="bg-yellow-400 text-black hover:bg-yellow-500"
            >
              {isUpdating ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Are you absolutely sure?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            This action cannot be undone. This will permanently delete the
            notification <b>#N-{notification.id}</b>.
          </p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
