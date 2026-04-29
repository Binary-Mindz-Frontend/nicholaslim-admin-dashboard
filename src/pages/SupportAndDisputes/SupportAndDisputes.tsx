import CustomTable from "@/components/Dashboard/DataTable/DataTable";
import { useState } from "react";
import { useSupportDisputeColumns } from "./SupportAndDisputesTable/SupportAndDisputesTable";
import {
  useDeleteDisputeMutation,
  useGetDisputesQuery,
} from "@/redux/features/disputes/disputesApi";
import FilterSection from "./FilterSection/FilterSection";
import Pagination from "./Pagination/Pagination";
import DeleteConfirmationModal from "./DeleteConfirmationModal/DeleteConfirmationModal";
import { useNavigate } from "react-router-dom";
import NewDynamicChangeLogTable from "@/components/Shared/DynamicChangeLogTable/NewDynamicChangeLogTable";
import { Edit, Trash2, ShieldAlert } from "lucide-react";
import {
  useCreateDisputeTypeMutation,
  useDeleteDisputeTypeMutation,
  useGetDisputeTypesQuery,
  useUpdateDisputeTypeMutation,
} from "@/redux/features/disputetypes/disputetypesApi";
import toast from "react-hot-toast";
import DisputeTypeModal from "./DisputeTypeModal/DisputeTypeModal";
import UpdateDisputeTypeModal from "./UpdateDisputeTypeModal/UpdateDisputeTypeModal";

export default function SupportAndDisputes() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [disputeTypeId, setDisputeTypeId] = useState("");
  const [participantType, setParticipantType] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string | number;
    type: "dispute" | "type";
  } | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTypeData, setSelectedTypeData] = useState<any>(null);

  const {
    data: disputesData,
    isLoading,
    refetch,
  } = useGetDisputesQuery({
    page,
    limit,
    status: statusFilter && statusFilter !== "all" ? statusFilter : undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    disputeTypeId:
      disputeTypeId && disputeTypeId !== "all" ? disputeTypeId : undefined,
    participantType:
      participantType && participantType !== "all"
        ? participantType
        : undefined,
  });

  const {
    data: disputeTypesData,
    isLoading: isLoadingTypes,
    refetch: refetchTypes,
  } = useGetDisputeTypesQuery({});

  const [deleteDispute, { isLoading: isDeletingDispute }] =
    useDeleteDisputeMutation();
  const [deleteDisputeType] = useDeleteDisputeTypeMutation();
  const [createDisputeType, { isLoading: isCreatingType }] =
    useCreateDisputeTypeMutation();
  const [updateDisputeType, { isLoading: isUpdatingType }] =
    useUpdateDisputeTypeMutation();

  const rows = disputesData?.data?.data || [];
  const typeRows = disputeTypesData?.data || [];
  const meta = disputesData?.data?.meta || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  const handleViewClick = (id: number) => navigate(`/support/view/${id}`);

  const handleDeleteClick = (id: number) => {
    setDeleteTarget({ id, type: "dispute" });
    setShowDeleteModal(true);
  };

  const handleDeleteTypeClick = (id: string) => {
    setDeleteTarget({ id, type: "type" });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === "dispute") {
        const res = await deleteDispute(deleteTarget.id as number).unwrap();
        if (res.success) {
          toast.success(res.message || "Dispute deleted");
          refetch();
        }
      } else {
        const res = await deleteDisputeType(deleteTarget.id).unwrap();
        if (res.success) {
          toast.success(res.message || "Dispute type deleted");
          refetchTypes();
        }
      }
    } catch (err) {
      toast.error("Failed to delete");
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };

  const handleResetFilter = () => {
    setPage(1);
    setStatusFilter("");
    setFromDate("");
    setToDate("");
    setDisputeTypeId("");
    setParticipantType("");
  };

  const { columns } = useSupportDisputeColumns({
    data: rows,
    onDelete: handleDeleteClick,
    onView: handleViewClick,
  });

  return (
    <div className="px-8 sm:p-6 bg-[#F5F7FA]">
      <div className="w-full mx-auto space-y-4 mb-6">
        <h1 className="text-black text-2xl font-bold pt-2">
          Support & Disputes
        </h1>
        <FilterSection
          statusFilter={statusFilter}
          setStatusFilter={(s) => {
            setStatusFilter(s);
            setPage(1);
          }}
          fromDate={fromDate}
          setFromDate={(d) => {
            setFromDate(d);
            setPage(1);
          }}
          toDate={toDate}
          setToDate={(d) => {
            setToDate(d);
            setPage(1);
          }}
          disputeTypeId={disputeTypeId}
          setDisputeTypeId={(id) => {
            setDisputeTypeId(id);
            setPage(1);
          }}
          participantType={participantType}
          setParticipantType={(t) => {
            setParticipantType(t);
            setPage(1);
          }}
          handleResetFilter={handleResetFilter}
          disputeTypes={typeRows}
        />
      </div>

      <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 my-6">Dispute Queue</h1>

      <div className="mb-4">
        <CustomTable columns={columns} data={rows} isLoading={isLoading} />
      </div>

      <Pagination
        currentPage={meta.page}
        totalPages={meta.totalPages}
        totalItems={meta.total}
        itemsPerPage={meta.limit}
        onPageChange={(p: number) => setPage(p)}
        onLimitChange={(l: number) => {
          setLimit(l);
          setPage(1);
        }}
      />

      <div className="w-full mx-auto my-12 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Dispute Type</h2>
            <p className="text-sm text-gray-500">Dispute Type Configuration</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-yellow-500 text-black rounded-md py-2 px-4 hover:bg-yellow-600 transition-all text-sm font-medium flex items-center cursor-pointer"
          >
            Create New Dispute Type
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {isLoadingTypes ? (
            <div className="p-10 text-center text-gray-400">
              Loading configurations...
            </div>
          ) : (
            typeRows.map((type: any) => (
              <div
                key={type.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{type.name}</p>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${type.role === "DRIVER" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}
                    >
                      {type.role}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedTypeData(type);
                      setShowUpdateModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md cursor-pointer"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteTypeClick(type.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <NewDynamicChangeLogTable entityType="Dispute" />

      <DisputeTypeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={async (data) => {
          const res = await createDisputeType(data).unwrap();
          if (res.success) {
            toast.success("Created!");
            setShowAddModal(false);
            refetchTypes();
          }
        }}
        isLoading={isCreatingType}
      />

      <UpdateDisputeTypeModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        initialData={selectedTypeData}
        onSubmit={async (data) => {
          const res = await updateDisputeType({
            id: selectedTypeData.id,
            ...data,
          }).unwrap();
          if (res.success) {
            toast.success("Updated!");
            setShowUpdateModal(false);
            refetchTypes();
          }
        }}
        isLoading={isUpdatingType}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeletingDispute}
      />
    </div>
  );
}
