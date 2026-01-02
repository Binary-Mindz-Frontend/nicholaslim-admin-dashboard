import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
import { useDeleteQuizResultMutation } from "@/redux/features/questions/questionsApi";
import toast from "react-hot-toast";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  resultId: number;
  refetch: () => void;
}

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, resultId, refetch }: DeleteConfirmModalProps) => {
  const [deleteQuizResult, { isLoading }] = useDeleteQuizResultMutation();

  const handleConfirm = async () => {
    if (!resultId) return;
    
    try {
      const result = await deleteQuizResult(resultId).unwrap();
      
      if (!result.success) {
        toast.error(result.message || "Failed to delete quiz result");
        return;
      }
      
      toast.success("Quiz result deleted successfully!");
      refetch();
      onConfirm();
    } catch (error) {
      console.error("Failed to delete quiz result:", error);
      toast.error("Failed to delete quiz result");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
            Delete Quiz Result
          </h3>
          
          <p className="text-gray-600 text-center mb-6">
            Are you sure you want to delete quiz result #{resultId}? This action cannot be undone.
          </p>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 cursor-pointer"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1 cursor-pointer"
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                "Deleting..."
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;