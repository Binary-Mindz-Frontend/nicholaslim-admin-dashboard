/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Loader2 } from 'lucide-react';
import { FiTrash } from 'react-icons/fi';
import React, { useState } from 'react';
import { StatusSwitch } from '../Dashboard/vehicleType-PricingModel/vehicle-types/_components/StatusSwitch';
import SCustomTable from '../Dashboard/_components/CutomTable';
import toast from 'react-hot-toast';
import {
  useGetNotificationRulesQuery,
  useToggleNotificationRuleMutation
} from '@/redux/features/notificationRules/notificationRulesApi';
import { NotificationRule } from '@/types/notificationRules';
import NotificationRuleModal from './_components/NotificationRuleModal';
import DeleteConfirmModal from './_components/DeleteConfirmModal';
import TablePagination from '../Dashboard/_components/TablePagination';
import NewDynamicChangeLogTable from '@/components/Shared/DynamicChangeLogTable/NewDynamicChangeLogTable';

const AutomatedAlertRule: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<NotificationRule | null>(null);
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);

  const { data: notificationRulesData, isLoading } = useGetNotificationRulesQuery({});
  const [toggleStatus] = useToggleNotificationRuleMutation();

  const handleAddClick = () => {
    setSelectedRule(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (row: NotificationRule) => {
    setSelectedRule(row);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setRuleToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleStatusChange = async (id: string) => {
    try {
      const res = await toggleStatus(id).unwrap();

      if (!res.success) {
        return toast.error(res.message || 'Failed to toggle status');
      }

      toast.success(res.message || 'Status toggled successfully');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to toggle status');
    }
  };

  const rulesList = notificationRulesData?.data || [];
  const totalItems = rulesList.length;
  const paginatedData = rulesList.slice((page - 1) * limit, page * limit);

  const columns = [
    { 
      key: "name" as const, 
      label: "Rule Name",
      render: (name: string, row: NotificationRule) => (
        <div>
          <div className="font-semibold text-gray-900">{name}</div>
          {row.notifTitle && (
            <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[250px]">
              Title: {row.notifTitle}
            </div>
          )}
        </div>
      )
    },
    {
      key: "condition" as const,
      label: "Trigger Condition",
      render: (_: any, row: NotificationRule) => (
        <div className="flex items-center space-x-1.5 text-xs">
          <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-700 font-semibold">
            {row.triggerTag}
          </span>
          <span className="text-gray-500 font-medium">{row.operator}</span>
          <span className="font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
            {row.targetValue}
          </span>
        </div>
      ),
    },
    {
      key: "stopScope" as const,
      label: "Scope",
      render: (stopScope: string, row: NotificationRule) => (
        <span className="text-xs font-medium text-gray-600">
          {stopScope === "FIXED" ? `Fixed Stop (${row.fixedStopIndex})` : "Dynamic Stop"}
        </span>
      ),
    },
    {
      key: "recipients" as const,
      label: "Recipients",
      render: (_: any, row: NotificationRule) => {
        const list = [];
        if (row.sendToSender) list.push("Sender");
        if (row.sendToRecipient) list.push("Recipient");
        
        return (
          <div className="flex gap-1">
            {list.length > 0 ? (
              list.map((r) => (
                <span key={r} className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {r}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400">-</span>
            )}
          </div>
        );
      },
    },
    {
      key: "channels" as const,
      label: "Channels",
      render: (_: any, row: NotificationRule) => {
        const channels = [];
        if (row.viaPush) channels.push("Push");
        if (row.viaWhatsApp) channels.push("WhatsApp");
        if (row.viaSMS) channels.push("SMS");
        
        return (
          <div className="flex gap-1 flex-wrap">
            {channels.length > 0 ? (
              channels.map((c) => (
                <span key={c} className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {c}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400">-</span>
            )}
          </div>
        );
      },
    },
    {
      key: "isActive" as const,
      label: "Status",
      render: (isActive: boolean, row: NotificationRule) => (
        <StatusSwitch
          key={`${row.id}-${isActive}`}
          status={isActive ? "Active" : "Inactive"}
          onChange={() => handleStatusChange(row.id)}
        />
      ),
    },
    {
      key: "actions" as const,
      label: "Actions",
      render: (_: any, row: NotificationRule) => (
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
          <h1 className="text-3xl font-bold text-gray-900">Automated Alert Rules</h1>
          <p className="text-sm text-gray-500">
            Configure automated rules and templates for sending notifications.
          </p>
        </div>
        <Button
          onClick={handleAddClick}
          className="bg-primary hover:bg-primary/90 text-black flex gap-2 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Alert Rule
        </Button>
      </div>

      <div className="bg-white rounded-t-lg shadow-sm border overflow-hidden">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <SCustomTable data={paginatedData} columns={columns} />
        )}
      </div>

      {!isLoading && totalItems > 0 && (
        <TablePagination
          currentPage={page}
          totalItems={totalItems}
          itemsPerPage={limit}
          onPageChange={setPage}
        />
      )}

      <NotificationRuleModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        initialData={selectedRule}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        id={ruleToDelete}
      />

      <NewDynamicChangeLogTable entityType="NotificationRule" />
    </div>
  );
};

export default AutomatedAlertRule;
