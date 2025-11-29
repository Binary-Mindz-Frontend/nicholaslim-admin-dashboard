import { useState } from "react"
import { Button } from "@/components/ui/button"
import CoinSystemTable from "./CoinSystemTable"
import CoinDialog, { CoinFormData } from "./CoinDialog"

const CoinSystem = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
  const [editData, setEditData] = useState<CoinFormData | undefined>()

  const openAdd = () => {
    setDialogMode("add")
    setEditData(undefined)
    setOpenDialog(true)
  }

  const openEdit = (row: any) => {
    setDialogMode("edit")
    setEditData({
      id: row.id,
      eventTrigger: row.eventTrigger,
      coinAmount: row.coinAmount.toString(),
      expiryDuration: row.expiryDuration.toString(),
    })
    setOpenDialog(true)
  }

  const handleSubmit = (data: CoinFormData) => {
    console.log("FORM SUBMITTED: ", data)

    if (dialogMode === "add") {
      console.log("➡ Adding new coin")
    } else {
      console.log("✏ Updating existing coin")
    }
  }

  return (
    <div className="mx-6 sm:mx-12">
      <div className="flex justify-between items-center my-6">
        <h3 className="text-3xl font-bold text-gray-900">Coin System</h3>

        <Button
          onClick={openAdd}
          className="bg-[#FFCC00] cursor-pointer text-black text-lg px-6 py-3 font-semibold gap-2"
        >
          Add Coin
        </Button>
      </div>

      {/* Table */}
      <CoinSystemTable onEdit={openEdit} />

      {/* Dialog Component */}
      <CoinDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        mode={dialogMode}
        defaultValues={editData}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default CoinSystem
