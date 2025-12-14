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
    setEditData({
      id: row.id,
      eventTrigger: row.event_triggered,
      coinAmount: row.coin_amount,
      expiryDuration: new Date(row.expire_date).toISOString().split('T')[0],
      coinValueInCent: row.coin_value_in_cent.toString()
    })
    setOpenDialog(true)
  }

  const openDelete = (id: number, eventTrigger: string) => {
    setSelectedId(id)
    setSelectedCoinName(eventTrigger)
    setOpenDeleteModal(true)
  }

  const handleSubmit = async (data: CoinFormData) => {
    try {
      const payload = {
        event_triggered: data.eventTrigger as 
          | "FIRST_SIGNUP" 
          | "DAILY_LOGIN" 
          | "SHARE_ON_SOCIAL" 
          | "REFERRAL" 
          | "COMPLETED20_ORDER",
        coin_amount: data.coinAmount,
        expire_date: new Date(data.expiryDuration).toISOString(),
        coin_value_in_cent: parseInt(data.coinValueInCent || "0")
      }

      if (dialogMode === "add") {
        const result = await addCoin(payload).unwrap()
        if (result.success) {
          toast.success("Coin added successfully!")
          refetch()
          setOpenDialog(false)
        } else {
          toast.error(result.message || "Failed to add coin")
        }
      } else {
        if (!selectedId) return
        const result = await updateCoin({ 
          id: selectedId, 
          ...payload 
        }).unwrap()
        if (result.success) {
          toast.success("Coin updated successfully!")
          refetch()
          setOpenDialog(false)
        } else {
          toast.error(result.message || "Failed to update coin")
        }
      }
    } catch (error: any) {
      console.error("Failed to submit coin:", error)
      toast.error(error?.data?.message || `Failed to ${dialogMode === "add" ? "add" : "update"} coin`)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedId) return

    try {
      const result = await deleteCoin(selectedId).unwrap()
      if (result.success) {
        toast.success("Coin deleted successfully!")
        refetch()
        setOpenDeleteModal(false)
        setSelectedId(null)
        setSelectedCoinName("")
      } else {
        toast.error(result.message || "Failed to delete coin")
      }
    } catch (error: any) {
      console.error("Failed to delete coin:", error)
      toast.error(error?.data?.message || "Failed to delete coin")
    }
  }

  return (
    <div className="mx-6 sm:mx-12">
      <div className="flex justify-between items-center my-6">
        <h3 className="text-3xl font-bold text-gray-900">Coin System</h3>

        <Button
          onClick={openAdd}
          className="bg-[#FFCC00] cursor-pointer text-black text-lg px-6 py-3 font-semibold gap-2 hover:bg-yellow-500"
          disabled={isAdding || isUpdating || isDeleting}
        >
          Add Coin
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
        title="Delete Coin"
        description={`Are you sure you want to delete the "${selectedCoinName}" coin? This action cannot be undone.`}
      />
    </div>
  )
}

export default CoinSystem