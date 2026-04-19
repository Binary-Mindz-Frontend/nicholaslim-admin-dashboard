/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteSurgePricingRuleMutation } from "@/redux/features/surgePricingRules/surgePricingRulesApi";
import toast from "react-hot-toast";

export default function DeleteConfirmModal({ isOpen, onClose, id }: any) {
  const [deleteRule, { isLoading }] = useDeleteSurgePricingRuleMutation();

  const handleDelete = async () => {
    try {
      await deleteRule(id).unwrap();
      toast.success("Deleted successfully");
      onClose();
    } catch (err: any) {
      console.log(err);
      toast.error("Failed to delete");
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
          This action cannot be undone. This will permanently delete the surge
          pricing rule.
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