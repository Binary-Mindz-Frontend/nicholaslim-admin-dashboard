import type React from "react"
import { useState } from "react"
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
import toast from "react-hot-toast"

interface AddPolicyModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (title: string, description: string) => Promise<{ success: boolean; error?: any }>
  isLoading: boolean
}

const AddPolicyModal: React.FC<AddPolicyModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  isLoading 
}) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in all required fields")
      return
    }
    
    const result = await onSubmit(title, description)
    
    if (result.success) {
      // Reset form on success
      setTitle("")
      setDescription("")
      onClose()
      toast.success("Policy created successfully")
    } else {
      toast.error("Failed to create policy. Please try again.")
    }
  }

  const handleClose = () => {
    setTitle("")
    setDescription("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Create New Policy
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">            
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1 text-gray-700">
                Policy Title *
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Return Policy, Privacy Policy"
                className="py-2"
                disabled={isLoading}
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1 text-gray-700">
                Description *
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the purpose and scope of this policy..."
                rows={4}
                className="resize-none"
                disabled={isLoading}
                required
              />
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
              {isLoading ? "Creating..." : "Create Policy"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddPolicyModal