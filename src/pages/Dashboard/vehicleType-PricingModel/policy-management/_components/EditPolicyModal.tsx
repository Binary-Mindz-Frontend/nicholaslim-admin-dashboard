import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog"
import { PolicyData } from "./_common/PolicyCard"
import toast from "react-hot-toast"

interface EditPolicyModalProps {
  isOpen: boolean
  onClose: () => void
  policy: PolicyData | null
  onUpdateContent: (id: string, title: string, description: string) => Promise<{ success: boolean; error?: any }>
  onUpdateStatus: (id: string, isPublist: boolean) => Promise<{ success: boolean; error?: any }>
}

const EditPolicyModal: React.FC<EditPolicyModalProps> = ({ 
  isOpen, 
  onClose, 
  policy, 
  onUpdateContent,
  onUpdateStatus
}) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isPublist, setIsPublist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (policy) {
      setTitle(policy.title || "")
      setDescription(policy.description || "")
      setIsPublist(policy.isPublist || false)
    }
  }, [policy])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!policy?.id) return
    
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in all required fields")
      return
    }
    
    setIsLoading(true)
    
    try {
      const contentChanged = title !== policy.title || description !== policy.description
      if (contentChanged) {
        const result = await onUpdateContent(policy.id, title, description)
        if (!result.success) {
          toast.error("Failed to update policy content")
          setIsLoading(false)
          return
        }
      }
      
      const statusChanged = isPublist !== policy.isPublist
      if (statusChanged) {
        const result = await onUpdateStatus(policy.id, isPublist)
        if (!result.success) {
          toast.error("Failed to update policy status")
          setIsLoading(false)
          return
        }
      }
      
      toast.success("Policy updated successfully")
      onClose()
    } catch (error) {
      toast.error("Failed to update policy")
      console.error("Update policy error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setTitle("")
    setDescription("")
    setIsPublist(false)
    onClose()
  }

  const togglePublishStatus = () => {
    setIsPublist(prev => !prev)
  }

  if (!policy) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Edit Policy: {policy.title}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">            
            <div>
              <label htmlFor="edit-title" className="block text-sm font-medium mb-1 text-gray-700">
                Policy Title *
              </label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Policy title"
                className="py-2"
                disabled={isLoading}
                required
              />
            </div>
            
            <div>
              <label htmlFor="edit-description" className="block text-sm font-medium mb-1 text-gray-700">
                Description *
              </label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Policy description"
                rows={4}
                className="resize-none"
                disabled={isLoading}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Publish Status
              </label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  onClick={togglePublishStatus}
                  variant="outline"
                  className={`px-4 py-2 rounded-md cursor-pointer ${
                    isPublist 
                      ? "bg-green-50 border-green-200 text-green-700" 
                      : "bg-gray-50 border-gray-200 text-gray-700"
                  }`}
                  disabled={isLoading}
                >
                  {isPublist ? "Published" : "Draft"}
                </Button>
                <span className="text-sm text-gray-500">
                  {isPublist 
                    ? "Policy is visible to users" 
                    : "Policy is in draft mode"}
                </span>
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isLoading}
              className="border-gray-300 cursor-pointer"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-[#FFCC00] hover:bg-[#E6B800] text-black font-semibold cursor-pointer"
            >
              {isLoading ? "Updating..." : "Update Policy"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditPolicyModal