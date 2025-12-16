import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, MapPin, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Mock data for service areas
const initialServiceAreas = [
  {
    id: 1,
    name: "Downtown Zone",
    displayName: "Downtown",
    cityZone: "Dhaka North",
    deliveryFee: 10,
    priority: 8,
    isActive: true,
    color: "#FF5733",
    minOrderAmount: 5,
    notes: "High priority zone",
    coordinates: [
      { lat: 23.8103, lng: 90.4125 },
      { lat: 23.8203, lng: 90.4225 },
      { lat: 23.8153, lng: 90.4325 },
      { lat: 23.8103, lng: 90.4125 }
    ]
  },
  {
    id: 2,
    name: "North Delivery Area",
    displayName: "North Zone",
    cityZone: "Dhaka North",
    deliveryFee: 15,
    priority: 5,
    isActive: true,
    color: "#3498DB",
    minOrderAmount: 10,
    notes: "Standard zone",
    coordinates: [
      { lat: 23.8300, lng: 90.4200 },
      { lat: 23.8400, lng: 90.4300 },
      { lat: 23.8350, lng: 90.4400 },
      { lat: 23.8300, lng: 90.4200 }
    ]
  },
  {
    id: 3,
    name: "South Delivery Area",
    displayName: "South Zone",
    cityZone: "Dhaka South",
    deliveryFee: 12,
    priority: 6,
    isActive: false,
    color: "#27C840",
    minOrderAmount: 8,
    notes: "Pending activation",
    coordinates: [
      { lat: 23.7900, lng: 90.4100 },
      { lat: 23.8000, lng: 90.4200 },
      { lat: 23.7950, lng: 90.4300 },
      { lat: 23.7900, lng: 90.4100 }
    ]
  }
];

// Metric Card Component
const MetricCard = ({ title, value, icon: Icon, color, bgColor }) => (
  <Card className="w-80 h-35 border-gray-300 shadow-lg">
    <CardContent className="py-3 px-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xl mb-1">{title}</p>
          <p style={{ color: color }} className="text-2xl font-bold">{value}</p>
        </div>
        <div className="p-3 rounded-md" style={{ backgroundColor: bgColor, border: `1px solid ${color}` }}>
          <Icon size={24} color={color} />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Google Map Component
const GoogleMapDisplay = ({ serviceAreas, selectedArea, onAreaClick }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const polygonsRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    // Initialize map
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 23.8103, lng: 90.4125 },
      zoom: 12,
      mapTypeControl: true,
      streetViewControl: false
    });

    mapInstanceRef.current = map;

    // Clear existing polygons
    polygonsRef.current.forEach(p => p.setMap(null));
    polygonsRef.current = [];

    // Draw all polygons
    serviceAreas.forEach(area => {
      const polygon = new window.google.maps.Polygon({
        paths: area.coordinates,
        strokeColor: area.color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: area.color,
        fillOpacity: selectedArea?.id === area.id ? 0.5 : 0.35,
        map: map
      });

      // Add click listener
      polygon.addListener('click', () => {
        onAreaClick(area);
      });

      // Add hover effect
      polygon.addListener('mouseover', () => {
        polygon.setOptions({ fillOpacity: 0.6 });
      });

      polygon.addListener('mouseout', () => {
        polygon.setOptions({
          fillOpacity: selectedArea?.id === area.id ? 0.5 : 0.35
        });
      });

      polygonsRef.current.push(polygon);
    });

    // Fit bounds to show all polygons
    if (serviceAreas.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      serviceAreas.forEach(area => {
        area.coordinates.forEach(coord => {
          bounds.extend(coord);
        });
      });
      map.fitBounds(bounds);
    }

  }, [serviceAreas, selectedArea]);

  return (
    <div ref={mapRef} className="w-full h-full rounded-lg" />
  );
};

// Create/Edit Modal
const ServiceAreaModal = ({ isOpen, onClose, editData, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    cityZone: '',
    deliveryFee: '',
    priority: 5,
    isActive: true,
    color: '#FF5733',
    minOrderAmount: '',
    notes: '',
    coordinates: []
  });

  const mapRef = useRef(null);
  const drawingManagerRef = useRef(null);
  const currentPolygonRef = useRef(null);

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({
        name: '',
        displayName: '',
        cityZone: '',
        deliveryFee: '',
        priority: 5,
        isActive: true,
        color: '#FF5733',
        minOrderAmount: '',
        notes: '',
        coordinates: []
      });
    }
  }, [editData, isOpen]);

  useEffect(() => {
    if (!isOpen || !mapRef.current || !window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 23.8103, lng: 90.4125 },
      zoom: 12,
      mapTypeControl: true
    });

    const drawingManager = new window.google.maps.drawing.DrawingManager({
      drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [window.google.maps.drawing.OverlayType.POLYGON]
      },
      polygonOptions: {
        fillColor: formData.color,
        fillOpacity: 0.4,
        strokeWeight: 2,
        strokeColor: formData.color,
        editable: true
      }
    });

    drawingManager.setMap(map);
    drawingManagerRef.current = drawingManager;

    // If editing, show existing polygon
    if (editData?.coordinates?.length > 0) {
      const polygon = new window.google.maps.Polygon({
        paths: editData.coordinates,
        strokeColor: editData.color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: editData.color,
        fillOpacity: 0.4,
        editable: true,
        map: map
      });

      currentPolygonRef.current = polygon;

      // Listen for polygon edits
      window.google.maps.event.addListener(polygon.getPath(), 'set_at', () => {
        updateCoordinates(polygon);
      });
      window.google.maps.event.addListener(polygon.getPath(), 'insert_at', () => {
        updateCoordinates(polygon);
      });

      const bounds = new window.google.maps.LatLngBounds();
      editData.coordinates.forEach(coord => bounds.extend(coord));
      map.fitBounds(bounds);
    }

    window.google.maps.event.addListener(drawingManager, 'polygoncomplete', (polygon) => {
      if (currentPolygonRef.current) {
        currentPolygonRef.current.setMap(null);
      }

      currentPolygonRef.current = polygon;
      drawingManager.setDrawingMode(null);

      updateCoordinates(polygon);

      window.google.maps.event.addListener(polygon.getPath(), 'set_at', () => {
        updateCoordinates(polygon);
      });
      window.google.maps.event.addListener(polygon.getPath(), 'insert_at', () => {
        updateCoordinates(polygon);
      });
    });

    return () => {
      if (currentPolygonRef.current) {
        currentPolygonRef.current.setMap(null);
      }
    };
  }, [isOpen, formData.color]);

  const updateCoordinates = (polygon) => {
    const path = polygon.getPath();
    const coords = [];
    for (let i = 0; i < path.getLength(); i++) {
      const point = path.getAt(i);
      coords.push({ lat: point.lat(), lng: point.lng() });
    }
    setFormData(prev => ({ ...prev, coordinates: coords }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.coordinates.length === 0) {
      alert('Please draw a polygon on the map');
      return;
    }
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">
            {editData ? 'Edit Service Area' : 'Create New Service Area'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Internal Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="cityZone">City/Zone Name *</Label>
                <Input
                  id="cityZone"
                  value={formData.cityZone}
                  onChange={(e) => setFormData({ ...formData, cityZone: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deliveryFee">Delivery Fee ($) *</Label>
                  <Input
                    id="deliveryFee"
                    type="number"
                    value={formData.deliveryFee}
                    onChange={(e) => setFormData({ ...formData, deliveryFee: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="priority">Priority (1-10) *</Label>
                  <Input
                    id="priority"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="minOrderAmount">Min Order Amount ($)</Label>
                <Input
                  id="minOrderAmount"
                  type="number"
                  value={formData.minOrderAmount}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="color">Color (for map)</Label>
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="isActive">Status</Label>
                  <select
                    id="isActive"
                    value={formData.isActive.toString()}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>

              {formData.coordinates.length > 0 && (
                <div className="text-sm text-green-600">
                  ✓ Polygon drawn with {formData.coordinates.length} points
                </div>
              )}
            </div>

            {/* Map Section */}
            <div>
              <Label>Draw Service Area on Map *</Label>
              <div ref={mapRef} className="w-full h-[500px] rounded-lg border mt-2" />
              <p className="text-sm text-gray-500 mt-2">
                Click on the map to draw polygon points. Complete the polygon by clicking on the first point.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            {editData ? 'Update' : 'Create'} Service Area
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const VTPMServiceArea = () => {
  const [serviceAreas, setServiceAreas] = useState(initialServiceAreas);
  const [selectedArea, setSelectedArea] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const activeZones = serviceAreas.filter(a => a.isActive).length;
  const pendingZones = serviceAreas.filter(a => !a.isActive).length;

  const handleSave = (data) => {
    if (editData) {
      setServiceAreas(prev => prev.map(area =>
        area.id === editData.id ? { ...data, id: editData.id } : area
      ));
    } else {
      setServiceAreas(prev => [...prev, { ...data, id: Date.now() }]);
    }
    setEditData(null);
  };

  const handleEdit = (area) => {
    setEditData(area);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this service area?')) {
      setServiceAreas(prev => prev.filter(area => area.id !== id));
      if (selectedArea?.id === id) setSelectedArea(null);
    }
  };

  const handleView = (area) => {
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedArea(null)}
                  >
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          ${area.deliveryFee}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {area.priority}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${area.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                            }`}>
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
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
                onClick={() => setCurrentPage(p => Math.min(Math.ceil(serviceAreas.length / itemsPerPage), p + 1))}
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