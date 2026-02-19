import { useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  useGetPromoCodesQuery,
  useAddPromoCodeMutation,
  useUpdatePromoCodeMutation,
  useDeletePromoCodeMutation,
} from "@/redux/features/promoCode/promoCodeApi";
import PromoCodeDialog from "@/components/Dashboard/PromoCode/PromoCodeDialog";
import PromoCodeTable from "@/components/Dashboard/PromoCode/PromoCodeTable";
import DeleteConfirmationModal from "@/pages/SupportAndDisputes/DeleteConfirmationModal/DeleteConfirmationModal";

const PromoCode = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [editData, setEditData] = useState<any | undefined>();
  const [selectedId, setSelectedId] = useState<number | string | null>(null);

  const { data: promoResponse, isLoading } = useGetPromoCodesQuery({});
  const [addPromo, { isLoading: isAdding }] = useAddPromoCodeMutation();
  const [updatePromo, { isLoading: isUpdating }] = useUpdatePromoCodeMutation();
  const [deletePromo, { isLoading: isDeleting }] = useDeletePromoCodeMutation();

  const promoCodes = promoResponse?.data || [];

  const openAdd = () => {
    setDialogMode("add");
    setEditData(undefined);
    setSelectedId(null);
    setOpenDialog(true);
  };

  const openEdit = (row: any) => {
    setDialogMode("edit");
    setSelectedId(row.id);
    setEditData({
      promoCode: row.promoCode,
      discountType: row.discountType,
      discountValue: row.discountValue.toString(),
      isActive: row.isActive,
      expires_at: row.expires_at ? row.expires_at.split("T")[0] : "",
    });
    setOpenDialog(true);
  };

  const openDelete = (id: number | string) => {
    setSelectedId(id);
    setOpenDeleteModal(true);
  };

  const handleSubmit = async (formData: any) => {
    try {
      const payload = {
        ...formData,
        discountValue: parseFloat(formData.discountValue) || 0,
      };

      if (dialogMode === "add") {
        const res = await addPromo(payload).unwrap();
        if (!res.success) {
          toast.error(res.message);
          return;
        }
        toast.success(res.message || "Promo code added successfully!");
      } else {
        const res = await updatePromo({ id: selectedId, ...payload }).unwrap();
        if (!res.success) {
          toast.error(res.message);
          return;
        }
        toast.success(res.message || "Promo code updated successfully!");
      }
      setOpenDialog(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Operation failed");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedId) return;
    try {
      const res = await deletePromo(selectedId).unwrap();
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message || "Promo code deleted!");
      setOpenDeleteModal(false);
    } catch (error: any) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="mx-6 sm:mx-12">
      <div className="flex justify-between items-center my-6">
        <h3 className="text-3xl font-bold text-gray-900">Promo Management</h3>
        <Button
          onClick={openAdd}
          className="bg-[#FFCC00] text-black hover:bg-yellow-500 font-semibold cursor-pointer"
        >
          Add Promo Code
        </Button>
      </div>

      <PromoCodeTable
        data={promoCodes}
        onEdit={openEdit}
        onDelete={openDelete}
        isLoading={isLoading}
      />

      <PromoCodeDialog
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
    </div>
  );
};

export default PromoCode;
