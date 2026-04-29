import React, { useState } from "react";
import {
  useDeleteNotificationMutation,
  useGetNotificationsListQuery,
  useUpdateNotificationMutation,
} from "@/redux/features/notificationServices/notificationServicesApi";
import CustomTable from "@/components/Dashboard/DataTable/DataTable";
import {
  useNotificationColumns,
  TNotification,
} from "./_components/useNotificationColumns/useNotificationColumns";
import NotificationFilter from "./_components/NotificationFilter/NotificationFilter";
import AdminTablePagination from "@/components/Shared/CustomPagination/AdminTablePagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import TableSkeletonLoader from "@/components/Shared/TableSkeletonLoader/TableSkeletonLoader";

const NotificationList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [type, setType] = useState<string>("all");

  const [selectedNotification, setSelectedNotification] =
    useState<TNotification | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [editData, setEditData] = useState({
    title: "",
    message: "",
    send_immediately: true,
    is_active: true,
  });

  const [deleteNotification, { isLoading: isDeleting }] =
    useDeleteNotificationMutation();
  const [updateNotification, { isLoading: isUpdating }] =
    useUpdateNotificationMutation();

  const { data: response, isLoading } = useGetNotificationsListQuery({
    page: currentPage,
    limit: itemsPerPage,
    type: type === "all" ? undefined : type,
    category: "NOTIFICATION",
  });

  const notifications = response?.data?.data || [];
  const totalItems = response?.data?.total || 0;

  const handleEditClick = (notification: TNotification) => {
    setSelectedNotification(notification);
    setEditData({
      title: notification.title,
      message: notification.message,
      send_immediately: notification.send_immediately ?? true,
      is_active: notification.is_active ?? true,
    });
    setIsEditModalOpen(true);
  };

  // Delete Button click handler
  const handleDeleteClick = (notification: TNotification) => {
    setSelectedNotification(notification);
    setIsDeleteModalOpen(true);
  };

  const { notificationColumns } = useNotificationColumns({
    onEdit: handleEditClick,
    onDelete: handleDeleteClick,
  });

  const handleUpdateSubmit = async () => {
    if (!selectedNotification) return;
    try {
      const res = await updateNotification({
        id: selectedNotification.id,
        ...editData,
      }).unwrap();

      if (!res.success) {
        toast.error(res.message || "Failed to update notification");
        return;
      }

      if (res.success) {
        toast.success(res.message || "Notification updated successfully");
        setIsEditModalOpen(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update notification");
    }
  };

  // Action: Delete
  const handleDeleteSubmit = async () => {
    if (!selectedNotification) return;
    try {
      const res = await deleteNotification(selectedNotification.id).unwrap();

      if (!res.success) {
        toast.error(res.message || "Failed to delete notification");
        return;
      }

      if (res.success) {
        toast.success(res.message || "Deleted successfully");
        setIsDeleteModalOpen(false);
      }
    } catch (error: any) {
      toast.error("Failed to delete notification");
    }
  };

  const handleResetFilter = () => {
    setType("all");
    setCurrentPage(1);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 bg-[#F5F7FA] min-h-screen space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-black text-xl sm:text-2xl font-bold">
          Notification History
        </h1>
      </div>

      <NotificationFilter
        type={type}
        setType={(v) => {
          setType(v);
          setCurrentPage(1);
        }}
        handleReset={handleResetFilter}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <TableSkeletonLoader />
          </div>
        ) : (
          <>
            <CustomTable columns={notificationColumns} data={notifications} />
            <div className="p-4 border-t border-gray-100">
              <AdminTablePagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(limit) => {
                  setItemsPerPage(limit);
                  setCurrentPage(1);
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Notification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                rows={4}
                value={editData.message}
                onChange={(e) =>
                  setEditData({ ...editData, message: e.target.value })
                }
              />
            </div>
            <div className="flex items-center justify-between border p-3 rounded-lg">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Active Status</label>
                <p className="text-xs text-gray-500">
                  Enable or disable this notification
                </p>
              </div>
              <Switch
                checked={editData.is_active}
                onCheckedChange={(val) =>
                  setEditData({ ...editData, is_active: val })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              className="bg-yellow-400 text-black hover:bg-yellow-500 cursor-pointer"
              onClick={handleUpdateSubmit}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Delete Notification
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 py-2">
            Are you sure you want to delete this notification record? This
            action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSubmit}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                "Delete Now"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationList;
