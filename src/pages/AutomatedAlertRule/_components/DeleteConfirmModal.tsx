/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteNotificationRuleMutation } from "@/redux/features/notificationRules/notificationRulesApi";
import toast from "react-hot-toast";

export default function DeleteConfirmModal({ isOpen, onClose, id }: any) {
  const [deleteRule, { isLoading }] = useDeleteNotificationRuleMutation();

  const handleDelete = async () => {
    try {
      const res = await deleteRule(id).unwrap();

      if (!res.success) {
        toast.error(res?.message || "Failed to perform operation");
        return;
      }

      toast.success(res?.message || "Operation success");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Operation failed");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">
            Are you absolutely sure?
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-500">
          This action cannot be undone. This will permanently delete this notification rule.
        </p>
        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
            className="cursor-pointer"
          >
            {isLoading ? "Deleting..." : "Confirm Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
