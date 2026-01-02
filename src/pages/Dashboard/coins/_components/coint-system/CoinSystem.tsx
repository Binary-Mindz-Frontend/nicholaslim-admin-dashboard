import { useState } from "react"
import { Button } from "@/components/ui/button"
import CoinSystemTable from "./CoinSystemTable"
import CoinDialog, { CoinFormData } from "./CoinDialog"
import { 
  useAddCoinMutation, 
  useDeleteCoinMutation, 
  useGetCoinsQuery, 
  useUpdateCoinMutation 
} from "@/redux/features/coinManagement/coinManagementApi"
import toast from "react-hot-toast"
import DeleteConfirmationModal from "@/components/Shared/DeleteConfirmationModal/DeleteConfirmationModal"

const CoinSystem = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
  const [editData, setEditData] = useState<CoinFormData | undefined>()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [selectedCoinName, setSelectedCoinName] = useState<string>("")
  
  const { data: coinsResponse, refetch, isLoading } = useGetCoinsQuery({})
  const [addCoin, { isLoading: isAdding }] = useAddCoinMutation()
  const [updateCoin, { isLoading: isUpdating }] = useUpdateCoinMutation()
  const [deleteCoin, { isLoading: isDeleting }] = useDeleteCoinMutation()

  const coins = coinsResponse?.data || []

  const openAdd = () => {
    setDialogMode("add")
    setEditData(undefined)
    setSelectedId(null)
    setOpenDialog(true)
  }

  const openEdit = (row: any) => {
    setDialogMode("edit")
    setSelectedId(row.id)
    
    // Transform API response to form data
    setEditData({
      id: row.id,
      key: row.key,
      description: row.description,
      coin_amount: row.coin_amount.toString(),
      condition: row.condition || {},
      expire_days: row.expire_days.toString(),
      coin_value_in_cent: row.coin_value_in_cent.toString(),
      is_active: row.is_active
    })
    setOpenDialog(true)
  }

  const openDelete = (id: number, key: string) => {
    setSelectedId(id)
    
    // Find the label for the key
    const triggerLabels: Record<string, string> = {
      "FIRST_SIGNUP": "First Signup",
      "DAILY_LOGIN": "Daily Login",
      "SHARE_ON_SOCIAL": "Share on Social",
      "REFERRAL": "Referral",
      "COMPLETED_ORDER": "Completed Orders"
    }
    
    setSelectedCoinName(triggerLabels[key] || key)
    setOpenDeleteModal(true)
  }

  const handleSubmit = async (data: CoinFormData) => {
    try {
      // Prepare payload according to API schema
      const payload: any = {
        key: data.key,
        description: data.description,
        coin_amount: parseInt(data.coin_amount) || 0,
        expire_days: parseInt(data.expire_days) || 0,
        coin_value_in_cent: parseInt(data.coin_value_in_cent) || 0,
        is_active: data.is_active
      }

      // Only include condition for COMPLETED_ORDER
      if (data.key === "COMPLETED_ORDER" && data.condition) {
        payload.condition = {}
        
        // Add maxPerDay if provided
        if (data.condition.maxPerDay !== undefined) {
          payload.condition.maxPerDay = parseInt(data.condition.maxPerDay.toString()) || 0
        }
      }

      if (dialogMode === "add") {
        const result = await addCoin(payload).unwrap()
        if (result.success) {
          toast.success("Coin reward added successfully!")
          refetch()
          setOpenDialog(false)
        } else {
          toast.error(result.message || "Failed to add coin reward")
        }
      } else {
        if (!selectedId) return
        const result = await updateCoin({ 
          id: selectedId, 
          ...payload 
        }).unwrap()
        if (result.success) {
          toast.success("Coin reward updated successfully!")
          refetch()
          setOpenDialog(false)
        } else {
          toast.error(result.message || "Failed to update coin reward")
        }
      }
    } catch (error: any) {
      console.error("Failed to submit coin:", error)
      toast.error(error?.data?.message || `Failed to ${dialogMode === "add" ? "add" : "update"} coin reward`)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedId) return

    try {
      const result = await deleteCoin(selectedId).unwrap()
      if (result.success) {
        toast.success("Coin reward deleted successfully!")
        refetch()
        setOpenDeleteModal(false)
        setSelectedId(null)
        setSelectedCoinName("")
      } else {
        toast.error(result.message || "Failed to delete coin reward")
      }
    } catch (error: any) {
      console.error("Failed to delete coin:", error)
      toast.error(error?.data?.message || "Failed to delete coin reward")
    }
  }

  return (
    <div className="mx-6 sm:mx-12">
      <div className="flex justify-between items-center my-6">
        <h3 className="text-3xl font-bold text-gray-900">Coin Reward System</h3>

        <Button
          onClick={openAdd}
          className="bg-[#FFCC00] cursor-pointer text-black text-lg px-6 py-3 font-semibold gap-2 hover:bg-yellow-500"
          disabled={isAdding || isUpdating || isDeleting}
        >
          Add Coin Reward
        </Button>
      </div>

      {/* Table */}
      <CoinSystemTable 
        data={coins}
        onEdit={openEdit} 
        onDelete={openDelete}
        isLoading={isLoading}
      />

      {/* Add/Edit Dialog */}
      <CoinDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        mode={dialogMode}
        defaultValues={editData}
        onSubmit={handleSubmit}
        isLoading={dialogMode === "add" ? isAdding : isUpdating}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={openDeleteModal}
        onClose={() => {
          setOpenDeleteModal(false)
          setSelectedId(null)
          setSelectedCoinName("")
        }}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Delete Coin Reward"
        description={`Are you sure you want to delete the "${selectedCoinName}" coin reward? This action cannot be undone.`}
      />
    </div>
  )
}

export default CoinSystem