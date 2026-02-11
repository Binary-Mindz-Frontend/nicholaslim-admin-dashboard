import { useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import AdditionalServiceTable from "@/components/Dashboard/AdditionalService/AdditionalServiceTable";
import {
  useGetAdditionalServicesQuery,
  useAddAdditionalServiceMutation,
  useUpdateAdditionalServiceMutation,
  useDeleteAdditionalServiceMutation,
} from "@/redux/features/additionalServices/additionalServicesApi";
import DeleteConfirmationModal from "@/pages/SupportAndDisputes/DeleteConfirmationModal/DeleteConfirmationModal";
import AdditionalServiceDialog from "@/components/Dashboard/AdditionalService/AdditionalServiceDialog";

const AdditionalService = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [editData, setEditData] = useState<any | undefined>();
  const [selectedId, setSelectedId] = useState<string | number | null>(null);

  const { data: servicesResponse, isLoading } = useGetAdditionalServicesQuery(
    {},
  );
  const [addService, { isLoading: isAdding }] =
    useAddAdditionalServiceMutation();
  const [updateService, { isLoading: isUpdating }] =
    useUpdateAdditionalServiceMutation();
  const [deleteService, { isLoading: isDeleting }] =
    useDeleteAdditionalServiceMutation();

  const services = servicesResponse?.data || [];

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
      service_name: row.service_name,
      value: row.value.toString(),
      desc: row.desc,
      isActive: row.isActive,
    });
    setOpenDialog(true);
  };

  const openDelete = (id: string | number) => {
    setSelectedId(id);
    setOpenDeleteModal(true);
  };

  const handleSubmit = async (formData: any) => {
    try {
      const payload = {
        service_name: formData.service_name,
        value: parseFloat(formData.value) || 0,
        desc: formData.desc,
        isActive: formData.isActive,
      };

      if (dialogMode === "add") {
        const result = await addService(payload).unwrap();
        if (result.success) {
          toast.success(result.message);
          setOpenDialog(false);
        }
      } else {
        if (!selectedId) return;
        const result = await updateService({
          id: selectedId,
          ...payload,
        }).unwrap();
        if (result.success) {
          toast.success(result.message);
          setOpenDialog(false);
        }
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedId) return;
    try {
      const result = await deleteService(selectedId).unwrap();
      if (result.success) {
        toast.success(result.message);
        setOpenDeleteModal(false);
        setSelectedId(null);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete service");
    }
  };

  return (
    <div className="mx-6 sm:mx-12">
      <div className="flex justify-between items-center my-6">
        <h3 className="text-3xl font-bold text-gray-900">
          Additional Services
        </h3>
        <Button
          onClick={openAdd}
          className="bg-[#FFCC00] cursor-pointer text-black text-lg px-6 py-3 font-semibold gap-2 hover:bg-yellow-500"
          disabled={isAdding || isUpdating || isDeleting}
        >
          Add New Service
        </Button>
      </div>

      <AdditionalServiceTable
        data={services}
        onEdit={openEdit}
        onDelete={openDelete}
        isLoading={isLoading}
      />

      <AdditionalServiceDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        mode={dialogMode}
        defaultValues={editData}
        onSubmit={handleSubmit}
        isLoading={dialogMode === "add" ? isAdding : isUpdating}
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

export default AdditionalService;
