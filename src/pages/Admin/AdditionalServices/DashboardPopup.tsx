/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { 
  useGetDashboardPopupsQuery, 
  useAddDashboardPopupMutation, 
  useUpdateDashboardPopupMutation, 
  useDeleteDashboardPopupMutation 
} from "@/redux/features/dashboardPopup/dashboardPopupApi"
import DashboardPopupDialog from "@/components/Dashboard/DashboardPopup/DashboardPopupDialog"
import DashboardPopupTable from "@/components/Dashboard/DashboardPopup/DashboardPopupTable"
import DeleteConfirmationModal from "@/pages/SupportAndDisputes/DeleteConfirmationModal/DeleteConfirmationModal";
import NewDynamicChangeLogTable from "@/components/Shared/DynamicChangeLogTable/NewDynamicChangeLogTable"

const DashboardPopup = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
  const [editData, setEditData] = useState<any | undefined>()
  const [selectedId, setSelectedId] = useState<number | string | null>(null)

  const { data: popupsResponse, isLoading } = useGetDashboardPopupsQuery({})
  const [addPopup, { isLoading: isAdding }] = useAddDashboardPopupMutation()
  const [updatePopup, { isLoading: isUpdating }] = useUpdateDashboardPopupMutation()
  const [deletePopup, { isLoading: isDeleting }] = useDeleteDashboardPopupMutation()

  const popups = popupsResponse?.data || []

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
      title: row.title,
      desc: row.desc,
      redirect_link: row.redirect_link,
      isActive: row.isActive
    })
    setOpenDialog(true)
  }

  const openDelete = (id: number | string) => {
    setSelectedId(id)
    setOpenDeleteModal(true)
  }

  const handleSubmit = async (formData: any) => {
    try {
      const payload = {
        title: formData.title,
        desc: formData.desc,
        redirect_link: formData.redirect_link,
        isActive: formData.isActive
      }

      if (dialogMode === "add") {
        const res = await addPopup(payload).unwrap()
        if (!res.success) {
          toast.error(res.message)
          return
        }
        toast.success(res.message || "Popup created successfully!")
      } else {
        if (!selectedId) return
        const res = await updatePopup({ id: selectedId, ...payload }).unwrap()

        if (!res.message) {
          toast.error(res.message)
          return
        }

        toast.success(res.message || "Popup updated successfully!")
      }
      setOpenDialog(false)
    } catch (error: any) {
      toast.error(error?.data?.message || "Operation failed")
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedId) return
    try {
      const res = await deletePopup(selectedId).unwrap()
      if (!res.success) {
        toast.error(res.message)
        return
      }
      toast.success(res.message || "Popup deleted successfully!")
      setOpenDeleteModal(false)
    } catch (error: any) {
      toast.error(error?.data?.message || "Delete failed")
    }
  }

  return (
    <div className="mx-6 sm:mx-12">
      <div className="flex justify-between items-center my-6">
        <h3 className="text-3xl font-bold text-gray-900">Dashboard Popups</h3>
        <Button
          onClick={openAdd}
          className="bg-[#FFCC00] text-black text-lg px-6 py-3 font-semibold hover:bg-yellow-500 cursor-pointer"
          disabled={isAdding || isUpdating}
        >
          Add New Popup
        </Button>
      </div>

      <DashboardPopupTable
        data={popups}
        onEdit={openEdit}
        onDelete={openDelete}
        isLoading={isLoading}
      />

      <DashboardPopupDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        mode={dialogMode}
        defaultValues={editData}
        onSubmit={handleSubmit}
        isLoading={isAdding || isUpdating}
      />

      <DeleteConfirmationModal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />

      <div>
        <NewDynamicChangeLogTable entityType="DashboardPopup" />
      </div>
    </div>
  );
}

export default DashboardPopup
