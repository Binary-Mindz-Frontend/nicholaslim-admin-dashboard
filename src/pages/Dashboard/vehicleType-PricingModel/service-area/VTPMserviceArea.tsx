import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Eye, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { ServiceArea } from "@/types/serviceAreaType";
import MetricCard from "./_components/MetricCard";
import GoogleMapDisplay from "./_components/GoogleMapDisplay";
import ServiceAreaModal from "./_components/ServiceAreaModal";
import ServiceZoneDetailsModal from "./_components/ServiceZoneDetailsModal";
import {
  useGetServiceZonesQuery,
  useAddServiceZoneMutation,
  useDeleteServiceZoneMutation,
  useUpdateServiceZoneMutation,
  useUpdateServiceZoneStatusMutation,
} from "@/redux/features/serviceZone/serviceZoneApi";
import { showConfirmDialog, showErrorToast, showSuccessToast } from "@/assets/utils/toast";

const VTPMServiceArea = () => {
  const { data: apiResponse, isLoading, refetch } = useGetServiceZonesQuery("");
  const [addServiceZone, { isLoading: isCreating }] = useAddServiceZoneMutation();
  const [deleteServiceZone, { isLoading: isDeleting }] = useDeleteServiceZoneMutation();
  const [updateServiceZone, { isLoading: isUpdating }] = useUpdateServiceZoneMutation();
  const [updateServiceZoneStatus, { isLoading: isStatusUpdating }] = useUpdateServiceZoneStatusMutation();

  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [selectedArea, setSelectedArea] = useState<ServiceArea | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailsZone, setDetailsZone] = useState<ServiceArea | null>(null);
  const [editData, setEditData] = useState<ServiceArea | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalZones, setTotalZones] = useState(0);
  const [activeZones, setActiveZones] = useState(0);
  const [inactiveZones, setInactiveZones] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    if (apiResponse?.success && apiResponse.data?.data) {
      const zonesData = apiResponse.data.data;
      setTotalZones(zonesData.totalZone || 0);
      setActiveZones(zonesData.activeZone || 0);
      setInactiveZones(zonesData.inactiveZone || 0);

      const transformedAreas = zonesData.data.map((zone: any) => ({
        id: zone.id,
        name: zone.name,
        displayName: zone.zoneName,
        cityZone: zone.zoneName,
        deliveryFee: zone.deliveryFee,
        priority: zone.priority,
        isActive: zone.isActive,
        color: zone.color || "#FF5733",
        minOrderAmount: zone.minOrderAmmount,
        notes: zone.notes,
        coordinates: zone.coordinates || [],
        createdAt: zone.createdAt,
        updatedAt: zone.updatedAt,
      }));
      setServiceAreas(transformedAreas);
    }
  }, [apiResponse]);

  const handleSave = async (data: Partial<ServiceArea>) => {
    try {
      if (!data.name || !data.cityZone || !data.coordinates || data.coordinates.length === 0) {
        showErrorToast("Please fill all required fields and draw a polygon on the map");
        return;
      }

      const apiData = {
        name: data.name || "",
        zoneName: data.cityZone || "",
        coordinates: data.coordinates || [],
        deliveryFee: data.deliveryFee || 0,
        priority: data.priority || 5,
        color: data.color || "#FF5733",
        minOrderAmmount: data.minOrderAmount || 0,
        isActive: data.isActive !== false,
        notes: data.notes || "",
      };

      let result;
      if (editData) {
        result = await updateServiceZone({ id: editData.id, ...apiData }).unwrap();
        if (result.success) {
          showSuccessToast(result.message || "Service zone updated successfully!");
        }
      } else {
        result = await addServiceZone(apiData).unwrap();
        if (result.success) {
          showSuccessToast(result.message || "Service zone created successfully!");
        }
      }

      refetch();
      setIsModalOpen(false);
      setEditData(null);
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to save service zone. Please try again.";
      showErrorToast(errorMessage);
    }
  };

  const handleEdit = (area: ServiceArea) => {
    setEditData(area);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await showConfirmDialog(
      "Delete Service Zone",
      "Are you sure you want to delete this service area? This action cannot be undone."
    );

    if (confirmed) {
      try {
        const result = await deleteServiceZone(id).unwrap();
        if (result.success) {
          setServiceAreas((prev) => prev.filter((area) => area.id !== id));
          if (selectedArea?.id === id) setSelectedArea(null);
          if (detailsZone?.id === id) {
            setIsDetailsModalOpen(false);
            setDetailsZone(null);
          }
          showSuccessToast(result.message || "Service zone deleted successfully!");
          refetch();
        }
      } catch (error: any) {
        const errorMessage = error?.data?.message || "Failed to delete service zone";
        showErrorToast(errorMessage);
      }
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      setServiceAreas((prev) =>
        prev.map((area) => (area.id === id ? { ...area, isActive: !currentStatus } : area))
      );

      const result = await updateServiceZoneStatus(id).unwrap();

      if (result.success) {
        const updatedStatus = result.data?.data?.isActive ?? !currentStatus;
        setServiceAreas((prev) =>
          prev.map((area) => (area.id === id ? { ...area, isActive: updatedStatus } : area))
        );
        showSuccessToast(`Service zone ${updatedStatus ? "activated" : "deactivated"} successfully!`);
        refetch();
      } else {
        setServiceAreas((prev) =>
          prev.map((area) => (area.id === id ? { ...area, isActive: currentStatus } : area))
        );
        showErrorToast(result.message || "Failed to update status");
      }
    } catch (error: any) {
      setServiceAreas((prev) =>
        prev.map((area) => (area.id === id ? { ...area, isActive: currentStatus } : area))
      );
      const errorMessage = error?.data?.message || "Failed to update service zone status";
      showErrorToast(errorMessage);
    }
  };

  const handleViewOnMap = (area: ServiceArea) => {
    setSelectedArea(area);
  };

  const handleViewDetails = (area: ServiceArea) => {
    setDetailsZone(area);
    setIsDetailsModalOpen(true);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayData = serviceAreas.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-6 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service areas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Service Areas Configuration</h1>

        <div className="flex flex-wrap justify-center gap-4">
          <MetricCard title="Total Zones" value={totalZones} icon={MapPin} color="#0088FF" bgColor="#0088FF20" />
          <MetricCard title="Active Zones" value={activeZones} icon={MapPin} color="#34C759" bgColor="#34C75920" />
          <MetricCard title="Inactive Zones" value={inactiveZones} icon={MapPin} color="#FF3B30" bgColor="#FF3B3020" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MapPin size={20} />
                <span>Service Coverage Map</span>
                {selectedArea && (
                  <span className="text-sm font-normal text-gray-600">- Viewing: {selectedArea.name}</span>
                )}
              </div>
              <div className="flex gap-2">
                {selectedArea && (
                  <Button variant="outline" size="sm" onClick={() => setSelectedArea(null)}>
                    Clear Selection
                  </Button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] rounded-lg overflow-hidden border">
              <GoogleMapDisplay
                serviceAreas={serviceAreas}
                selectedArea={selectedArea}
                onAreaClick={handleViewOnMap}
              />
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Click on any zone to view details. Different colors represent different service areas.
            </p>
          </CardContent>
        </Card>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Service Area List</h2>
            <Button
              onClick={() => {
                setEditData(null);
                setIsModalOpen(true);
              }}
              className="bg-[#FFCC00] hover:bg-[#E6B800] text-black font-semibold py-2 px-4 rounded flex items-center gap-2 disabled:bg-[#FFCC00] cursor-pointer"
              disabled={isCreating || isUpdating}
            >
              <Plus size={20} className="mr-2" />
              Add New Area
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Zone Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery Fee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {displayData.map((area) => (
                      <tr key={area.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: area.color }} />
                            <div>
                              <span className="font-medium block">{area.name}</span>
                              <span className="text-xs text-gray-500">ID: {area.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{area.cityZone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">${area.deliveryFee}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{area.priority}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="flex items-center gap-2"
                          >
                            <Switch
                              checked={area.isActive}
                              onCheckedChange={() => handleToggleStatus(area.id, area.isActive)}
                              className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300 cursor-pointer"
                              disabled={isStatusUpdating}
                            />
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                area.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {area.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(area)}
                              className="p-2 hover:bg-blue-50 cursor-pointer"
                              title="View Details"
                              disabled={isDeleting}
                            >
                              <Eye size={16} className="text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(area)}
                              className="p-2 hover:bg-blue-50 cursor-pointer"
                              title="Edit"
                              disabled={isDeleting || isCreating || isUpdating}
                            >
                              <Pencil size={16} className="text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(area.id)}
                              className="p-2 hover:bg-red-50 cursor-pointer"
                              title="Delete"
                              disabled={isDeleting}
                            >
                              <Trash2 size={16} className="text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {serviceAreas.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No service zones found. Click "Add New Area" to create your first service zone.
                </div>
              )}
            </CardContent>
          </Card>

          {serviceAreas.length > itemsPerPage && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-sm">
                Page {currentPage} of {Math.ceil(serviceAreas.length / itemsPerPage)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(Math.ceil(serviceAreas.length / itemsPerPage), p + 1))
                }
                disabled={currentPage >= Math.ceil(serviceAreas.length / itemsPerPage)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>

      <ServiceAreaModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditData(null);
        }}
        editData={editData}
        onSave={handleSave}
        isLoading={isCreating || isUpdating}
      />

      <ServiceZoneDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setDetailsZone(null);
        }}
        zoneData={detailsZone}
      />
    </div>
  );
};

export default VTPMServiceArea;