import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, MapPin, Pencil, Plus, Trash2 } from 'lucide-react';
import { ServiceArea } from '@/types/serviceAreaType';
import { initialServiceAreas } from './_components/constants';
import MetricCard from './_components/MetricCard';
import GoogleMapDisplay from './_components/GoogleMapDisplay';
import ServiceAreaModal from './_components/ServiceAreaModal';

const VTPMServiceArea = () => {
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>(initialServiceAreas);
  const [selectedArea, setSelectedArea] = useState<ServiceArea | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<ServiceArea | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const activeZones = serviceAreas.filter((a) => a.isActive).length;
  const pendingZones = serviceAreas.filter((a) => !a.isActive).length;

  const handleSave = (data: Partial<ServiceArea>) => {
    if (editData) {
      setServiceAreas((prev) =>
        prev.map((area) =>
          area.id === editData.id ? { ...data, id: editData.id } as ServiceArea : area
        )
      );
    } else {
      const newArea: ServiceArea = {
        id: Date.now(),
        name: data.name || '',
        displayName: data.displayName || '',
        cityZone: data.cityZone || '',
        deliveryFee: data.deliveryFee || 0,
        priority: data.priority || 5,
        isActive: data.isActive || true,
        color: data.color || '#FF5733',
        minOrderAmount: data.minOrderAmount || 0,
        notes: data.notes || '',
        coordinates: data.coordinates || [],
      };
      setServiceAreas((prev) => [...prev, newArea]);
    }
    setEditData(null);
  };

  const handleEdit = (area: ServiceArea) => {
    setEditData(area);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this service area?')) {
      setServiceAreas((prev) => prev.filter((area) => area.id !== id));
      if (selectedArea?.id === id) setSelectedArea(null);
    }
  };

  const handleView = (area: ServiceArea) => {
    setSelectedArea(area);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayData = serviceAreas.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Service Areas Configuration</h1>

        {/* Metrics */}
        <div className="flex flex-wrap justify-center gap-4">
          <MetricCard
            title="Total Zones"
            value={serviceAreas.length}
            icon={MapPin}
            color="#0088FF"
            bgColor="#0088FF20"
          />
          <MetricCard
            title="Active Zones"
            value={activeZones}
            icon={MapPin}
            color="#34C759"
            bgColor="#34C75920"
          />
          <MetricCard
            title="Pending"
            value={pendingZones}
            icon={MapPin}
            color="#FFCC00"
            bgColor="#FFCC0020"
          />
        </div>

        {/* Map Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MapPin size={20} />
                <span>Service Coverage Map</span>
                {selectedArea && (
                  <span className="text-sm font-normal text-gray-600">
                    - Viewing: {selectedArea.name}
                  </span>
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
                onAreaClick={handleView}
              />
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Click on any zone to view details. Different colors represent different service areas.
            </p>
          </CardContent>
        </Card>

        {/* Service Area List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Service Area List</h2>
            <Button
              onClick={() => {
                setEditData(null);
                setIsModalOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700"
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Zone Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        City
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Delivery Fee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {displayData.map((area) => (
                      <tr key={area.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: area.color }}
                            />
                            <span className="font-medium">{area.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {area.cityZone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">${area.deliveryFee}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{area.priority}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              area.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {area.isActive ? 'Active' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(area)}
                              className="p-2 hover:bg-blue-50"
                            >
                              <Eye size={16} className="text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(area)}
                              className="p-2 hover:bg-blue-50"
                            >
                              <Pencil size={16} className="text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(area.id)}
                              className="p-2 hover:bg-red-50"
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
            </CardContent>
          </Card>

          {/* Pagination */}
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
                  setCurrentPage((p) =>
                    Math.min(Math.ceil(serviceAreas.length / itemsPerPage), p + 1)
                  )
                }
                disabled={currentPage >= Math.ceil(serviceAreas.length / itemsPerPage)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <ServiceAreaModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditData(null);
        }}
        editData={editData}
        onSave={handleSave}
      />
    </div>
  );
};

export default VTPMServiceArea;