import React, { useState } from "react";
import {
  useDeleteNotificationMutation,
  useGetNotificationsListQuery,
  useUpdateNotificationMutation,
} from "@/redux/features/notificationServices/notificationServicesApi";
import { useUploadFileMutation } from "@/redux/features/usersTypes/usersTypesApi";
import CustomTable from "@/components/Dashboard/DataTable/DataTable";
import AdminTablePagination from "@/components/Shared/CustomPagination/AdminTablePagination";
import {
  TNotification,
} from "../NotificationList/_components/useNotificationColumns/useNotificationColumns";
import toast from "react-hot-toast";
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
import { Upload, X, Loader2 } from "lucide-react";
import { useNotificationPromotionColumns } from "./_components/useNotificationPromotionColumns/useNotificationPromotionColumns";
import TableSkeletonLoader from "@/components/Shared/TableSkeletonLoader/TableSkeletonLoader";

const NotificationPromotionList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [selectedNotification, setSelectedNotification] =
    useState<TNotification | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Image Upload Local States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [editData, setEditData] = useState({
    title: "",
    message: "",
    image_url: "",
    send_immediately: true,
    schedule_to_send: "",
    expiry_date: "",
    is_active: true,
  });

  const [deleteNotification, { isLoading: isDeleting }] =
    useDeleteNotificationMutation();
  const [updateNotification, { isLoading: isUpdating }] =
    useUpdateNotificationMutation();
  const [uploadFile, { isLoading: isUploadingImage }] = useUploadFileMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(editData.image_url);
  };

  const resetModals = () => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setSelectedNotification(null);
  };

  const handleDelete = async () => {
    if (!selectedNotification) return;
    try {
      const res = await deleteNotification(selectedNotification.id).unwrap();
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message || "Notification deleted successfully");
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  const handleUpdateSubmit = async () => {
    if (!selectedNotification) return;

    let loadingToast = toast.loading("Processing...");

    try {
      let finalImageUrl = editData.image_url;

      if (selectedFile) {
        const uploadRes = await uploadFile(selectedFile).unwrap();

        if (uploadRes.success && uploadRes.data && uploadRes.data.length > 0) {
          finalImageUrl = uploadRes.data[0];
        } else if (uploadRes.success && typeof uploadRes.data === "string") {
          finalImageUrl = uploadRes.data;
        } else {
          throw new Error("Image upload failed");
        }
      }

      const payload = {
        title: editData.title,
        message: editData.message,
        image_url: finalImageUrl,
        send_immediately: editData.send_immediately,
        schedule_to_send: editData.schedule_to_send || null,
        expiry_date: editData.expiry_date || null,
        is_active: editData.is_active,
      };

      const res = await updateNotification({
        id: selectedNotification.id,
        ...payload,
      }).unwrap();

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message || "Notification updated successfully");
      resetModals();
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
      console.error("Update Error:", error);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleEditClick = (notification: any) => {
    setSelectedNotification(notification);
    const originalImageUrl = notification.image_url || "";
    setEditData({
      title: notification.title || "",
      message: notification.message || "",
      image_url: originalImageUrl,
      send_immediately: notification.send_immediately ?? true,
      schedule_to_send: notification.schedule_to_send
        ? new Date(notification.schedule_to_send).toISOString().slice(0, 16)
        : "",
      expiry_date: notification.expiry_date
        ? new Date(notification.expiry_date).toISOString().slice(0, 16)
        : "",
      is_active: notification.is_active ?? true,
    });
    setPreviewUrl(originalImageUrl);
    setSelectedFile(null);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (notification: TNotification) => {
    setSelectedNotification(notification);
    setIsDeleteModalOpen(true);
  };

  const { notificationColumns } = useNotificationPromotionColumns({
    onEdit: handleEditClick,
    onDelete: handleDeleteClick,
  });

  const { data: response, isLoading } = useGetNotificationsListQuery({
    page: currentPage,
    limit: itemsPerPage,
    category: "PROMOTION",
  });

  const notifications = response?.data?.data || [];
  const totalItems = response?.data?.total || 0;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 bg-[#F5F7FA] min-h-screen space-y-6">
      <h1 className="text-black text-xl sm:text-2xl font-bold">
        Promotion History
      </h1>

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

      {/* --- EDIT MODAL --- */}
      <Dialog open={isEditModalOpen} onOpenChange={resetModals}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Promotion</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                />
              </div>

              {/* Image Section */}
              <div className="space-y-2 col-span-2 border p-3 rounded-md bg-gray-50/50">
                <label className="text-sm font-medium">Promotion Image</label>
                <div className="flex items-center gap-4 mt-2">
                  <div className="relative w-24 h-24 border rounded-md overflow-hidden bg-white">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 text-xs">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="cursor-pointer">
                      <div className="bg-white border text-sm px-4 py-2 rounded-md hover:bg-gray-50 flex items-center gap-2 shadow-sm">
                        <Upload className="h-4 w-4" /> Upload New
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </label>
                    {selectedFile && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeSelectedFile}
                        className="text-red-500 gap-1"
                      >
                        <X className="h-3 w-3" /> Cancel New
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  rows={3}
                  value={editData.message}
                  onChange={(e) =>
                    setEditData({ ...editData, message: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Schedule To Send</label>
                <Input
                  type="datetime-local"
                  value={editData.schedule_to_send}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      schedule_to_send: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Expiry Date</label>
                <Input
                  type="datetime-local"
                  value={editData.expiry_date}
                  onChange={(e) =>
                    setEditData({ ...editData, expiry_date: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-2 border rounded-md bg-white">
                <label className="text-sm font-medium">Send Immediately</label>
                <Switch
                  checked={editData.send_immediately}
                  onCheckedChange={(val) =>
                    setEditData({ ...editData, send_immediately: val })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-2 border rounded-md bg-white">
                <label className="text-sm font-medium">Is Active</label>
                <Switch
                  checked={editData.is_active}
                  onCheckedChange={(val) =>
                    setEditData({ ...editData, is_active: val })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={resetModals}
              disabled={isUpdating || isUploadingImage}
            >
              Cancel
            </Button>
            <Button
              className="bg-yellow-400 text-black hover:bg-yellow-500 min-w-[120px]"
              onClick={handleUpdateSubmit}
              disabled={isUpdating || isUploadingImage}
            >
              {isUpdating || isUploadingImage ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isUploadingImage ? "Uploading..." : "Saving..."}
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- DELETE MODAL --- */}
      <Dialog open={isDeleteModalOpen} onOpenChange={resetModals}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Promotion</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-sm text-gray-600">
            Are you sure you want to delete this promotion? This action cannot
            be undone.
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={resetModals}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationPromotionList;
