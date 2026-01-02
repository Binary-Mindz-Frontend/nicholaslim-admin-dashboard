import type React from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FiAlertTriangle } from "react-icons/fi"
import { PolicyData } from "./_common/PolicyCard"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  policy: PolicyData | null
  isLoading: boolean
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  policy,
  isLoading 
}) => {
  const handleConfirm = async () => {
    await onConfirm()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <FiAlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Delete Policy
            </DialogTitle>
          </div>
          <DialogDescription className="pt-4">
            <div className="space-y-3">
              <p className="text-gray-700">
                Are you sure you want to delete this policy? This action cannot be undone.
              </p>
              {policy && (
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="font-medium text-gray-900">{policy.title}</p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {policy.description}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Status: <span className={policy.isPublist ? "text-green-600" : "text-gray-600"}>
                      {policy.isPublist ? "Published" : "Draft"}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="gap-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
            className="border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white font-medium"
          >
            {isLoading ? "Deleting..." : "Delete Policy"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteConfirmationModal