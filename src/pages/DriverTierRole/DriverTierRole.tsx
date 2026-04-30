import React, { useState } from "react";
import {
  useGetDriverTiersQuery,
  useUpdateDriverTiersMutation,
} from "@/redux/features/driverTiers/driverTiersApi";
import CustomTable from "@/components/Dashboard/DataTable/DataTable";
import AdminTablePagination from "@/components/Shared/CustomPagination/AdminTablePagination";
import TableSkeletonLoader from "@/components/Shared/TableSkeletonLoader/TableSkeletonLoader";
import {
  useTierColumns,
  TDriverTier,
} from "./_components/useTierColumns/useTierColumns";
import NewDynamicChangeLogTable from "@/components/Shared/DynamicChangeLogTable/NewDynamicChangeLogTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const DriverTierRole: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<TDriverTier | null>(null);
  const [formData, setFormData] = useState<any>({});

  // API Queries
  const { data: response, isLoading } = useGetDriverTiersQuery({});
  const [updateTier, { isLoading: isUpdating }] =
    useUpdateDriverTiersMutation();

  const handleEdit = (tier: TDriverTier) => {
    setSelectedTier(tier);
    setFormData({
      name: tier.name,
      description: tier.description,
      isActive: tier.isActive,
      minOrders: tier.minOrders,
      minRating: Number(tier.minRating),
      minCompletionRate: tier.minCompletionRate || 0,
      maxCancellationRate: tier.maxCancellationRate,
      requiresBranding: tier.requiresBranding,
      isInvitationOnly: tier.isInvitationOnly,
    });
    setIsModalOpen(true);
  };

  const { tierColumns } = useTierColumns({ onEdit: handleEdit });

  const tiers = response?.data || [];
  const totalItems = tiers.length || 0;

  const handleUpdateSubmit = async () => {
    if (!selectedTier) return;
    try {
      const res = await updateTier({
        id: selectedTier.id,
        ...formData,
      }).unwrap();

      if (res.success) {
        toast.success(res.message || "Tier updated successfully");
        setIsModalOpen(false);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 bg-[#F5F7FA] min-h-screen space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-black text-xl sm:text-2xl font-bold">
            Driver Tier Management
          </h1>
          <p className="text-sm text-gray-500">
            Configure and manage driver performance tiers
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <TableSkeletonLoader />
          </div>
        ) : (
          <>
            <CustomTable columns={tierColumns} data={tiers} />
            <div className="p-4 border-t">
              <AdminTablePagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Driver Tier: {selectedTier?.name}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Tier Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Min Orders</Label>
              <Input
                type="number"
                value={formData.minOrders}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minOrders: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Min Rating</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.minRating}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minRating: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Max Cancellation Rate (%)</Label>
              <Input
                type="number"
                value={formData.maxCancellationRate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxCancellationRate: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="flex items-center space-x-4 p-2 border rounded-md">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(v) =>
                  setFormData({ ...formData, isActive: v })
                }
              />
              <Label>Active Status</Label>
            </div>
            <div className="flex items-center space-x-4 p-2 border rounded-md">
              <Switch
                checked={formData.requiresBranding}
                onCheckedChange={(v) =>
                  setFormData({ ...formData, requiresBranding: v })
                }
              />
              <Label>Requires Branding</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-yellow-400 text-black hover:bg-yellow-500"
              onClick={handleUpdateSubmit}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <NewDynamicChangeLogTable entityType="RaiderTier" />
    </div>
  );
};

export default DriverTierRole;
