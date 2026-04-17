import { Button } from '@/components/ui/button';
import { Plus, Edit2, Loader2 } from 'lucide-react';
import { FiTrash } from 'react-icons/fi';
import React, { useState } from 'react';
import { StatusSwitch } from '../Dashboard/vehicleType-PricingModel/vehicle-types/_components/StatusSwitch';
import SCustomTable from '../Dashboard/_components/CutomTable';
import toast from 'react-hot-toast';
import {
  useGetSurgePricingRulesQuery,
  useToggleSurgePricingRuleStatusMutation
} from '@/redux/features/surgePricingRules/surgePricingRulesApi';
import { SurgeRule } from '@/types/surgePricingRules';
import SurgeRuleModal from './_components/SurgeRuleModal';
import DeleteConfirmModal from './_components/DeleteConfirmModal';
import TablePagination from '../Dashboard/_components/TablePagination';

const SurgePricingRole: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<SurgeRule | null>(null);
  const [ruleToDelete, setRuleToDelete] = useState<number | null>(null);

  const { data: surgeData, isLoading } = useGetSurgePricingRulesQuery({ page, limit });
  const [toggleStatus] = useToggleSurgePricingRuleStatusMutation();

  const totalItems = surgeData?.meta?.total || 0;

  const handleAddClick = () => {
    setSelectedRule(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (row: SurgeRule) => {
    setSelectedRule(row);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setRuleToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleStatusChange = async (id: number) => {
    try {
      const res = await toggleStatus(id).unwrap();
      toast.success(res.message || 'Status updated');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update status');
    }
  };

  const columns = [
    { 
      key: "ruleName" as const, 
      label: "Rule Name",
      render: (name: string) => <span className="font-medium">{name}</span>
    },
    {
      key: "ratio" as const,
      label: "Ratio (From - To)",
      render: (_: any, row: SurgeRule) => `${row.ratioFrom} - ${row.ratioTo}`,
    },
    {
      key: "priceMultiplier" as const,
      label: "Multiplier",
      render: (val: string) => <span className="text-blue-600 font-bold">{val}x</span>,
    },
    {
      key: "maxCap" as const,
      label: "Max Cap",
      render: (val: string) => `$${val}`,
    },
    {
      key: "status" as const,
      label: "Status",
      render: (status: string, row: SurgeRule) => (
        <StatusSwitch
          status={status === "ACTIVE" ? "Active" : "Inactive"}
          onChange={() => handleStatusChange(row.id)}
        />
      ),
    },
    {
      key: "actions" as const,
      label: "Actions",
      render: (_: any, row: SurgeRule) => (
        <div className="flex gap-2">
          <Button
            variant="ghost" size="sm"
            className="p-2 h-auto cursor-pointer border border-[#00BFFF] hover:bg-blue-50"
            onClick={() => handleEditClick(row)}
          >
            <Edit2 size={16} className="text-[#00BFFF]" />
          </Button>
          <Button
            variant="ghost" size="sm"
            className="p-2 h-auto cursor-pointer border border-[#FF4D4F] hover:bg-red-50"
            onClick={() => handleDeleteClick(row.id)}
          >
            <FiTrash size={16} className="text-[#FF4D4F]" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Surge Pricing Rules</h1>
          <p className="text-sm text-gray-500">Manage your dynamic pricing based on demand ratios.</p>
        </div>
        <Button onClick={handleAddClick} className="bg-primary hover:bg-primary/90 text-black flex gap-2 cursor-pointer">
          <Plus className="h-4 w-4" /> Add Surge Rule
        </Button>
      </div>

      <div className="bg-white rounded-t-lg shadow-sm border overflow-hidden">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <SCustomTable data={surgeData?.data || []} columns={columns} />
        )}
      </div>

      {!isLoading && (
        <TablePagination
          currentPage={page}
          totalItems={totalItems}
          itemsPerPage={limit}
          onPageChange={setPage}
        />
      )}

      <SurgeRuleModal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)} 
        initialData={selectedRule} 
      />

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        id={ruleToDelete} 
      />
    </div>
  );
};

export default SurgePricingRole;