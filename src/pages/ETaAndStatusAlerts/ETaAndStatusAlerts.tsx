/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Loader2 } from 'lucide-react';
import { FiTrash } from 'react-icons/fi';
import React, { useState } from 'react';
import { StatusSwitch } from '../Dashboard/vehicleType-PricingModel/vehicle-types/_components/StatusSwitch';
import SCustomTable from '../Dashboard/_components/CutomTable';
import toast from 'react-hot-toast';
import {
  useGetTriggerEventsQuery,
  useToggleTriggerEventMutation
} from '@/redux/features/triggerEvents/triggerEventsApi';
import { TriggerEvent } from '@/types/triggerEvents';
import TriggerEventModal from './_components/TriggerEventModal';
import DeleteConfirmModal from './_components/DeleteConfirmModal';
import TablePagination from '../Dashboard/_components/TablePagination';
import NewDynamicChangeLogTable from '@/components/Shared/DynamicChangeLogTable/NewDynamicChangeLogTable';

const ETaAndStatusAlerts: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TriggerEvent | null>(null);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  const { data: triggerEventsData, isLoading } = useGetTriggerEventsQuery({});
  const [toggleStatus] = useToggleTriggerEventMutation();

  const handleAddClick = () => {
    setSelectedEvent(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (row: TriggerEvent) => {
    setSelectedEvent(row);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setEventToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleStatusChange = async (id: string) => {
    try {
      const res = await toggleStatus(id).unwrap();
      toast.success(res.message || 'Status toggled successfully');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to toggle status');
    }
  };

  const triggerEventsList = triggerEventsData?.data || [];
  const totalItems = triggerEventsList.length;
  const paginatedData = triggerEventsList.slice((page - 1) * limit, page * limit);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ASSIGNED': return 'Assigned';
      case 'ARRIVED_AT_PICKUP': return 'Arrived at Pickup';
      case 'IN_TRANSIT': return 'In Transit';
      case 'COMPLETED': return 'Completed';
      case 'CANCELLED': return 'Cancelled';
      default: return status;
    }
  };

  const columns = [
    { 
      key: "name" as const, 
      label: "Alert Name",
      render: (name: string, row: TriggerEvent) => (
        <div>
          <div className="font-semibold text-gray-900">{name}</div>
          {row.description && (
            <div className="text-xs text-gray-500 mt-0.5 max-w-[200px] truncate">{row.description}</div>
          )}
        </div>
      )
    },
    {
      key: "backendTag" as const,
      label: "Backend Tag",
      render: (tag: string) => (
        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
          {tag}
        </span>
      ),
    },
    {
      key: "expectedValue" as const,
      label: "Expected Value",
      render: (_: any, row: TriggerEvent) => (
        <span className="font-medium text-blue-600">
          {row.expectedValue !== undefined ? `${row.expectedValue} ${row.expectedValueType || ''}` : '-'}
        </span>
      ),
    },
    {
      key: "status" as const,
      label: "Target Status",
      render: (status: string) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
          {getStatusLabel(status)}
        </span>
      ),
    },
    {
      key: "isActive" as const,
      label: "Status",
      render: (isActive: boolean, row: TriggerEvent) => (
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
      render: (_: any, row: TriggerEvent) => (
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
          <h1 className="text-3xl font-bold text-gray-900">ETA & Status Alerts</h1>
          <p className="text-sm text-gray-500">
            Manage your ETA & Status Alerts rules and notifications.
          </p>
        </div>
        <Button
          onClick={handleAddClick}
          className="bg-primary hover:bg-primary/90 text-black flex gap-2 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Alert
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

      <TriggerEventModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        initialData={selectedEvent}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        id={eventToDelete}
      />

      <NewDynamicChangeLogTable entityType="TriggerEvent" />
    </div>
  );
};

export default ETaAndStatusAlerts;