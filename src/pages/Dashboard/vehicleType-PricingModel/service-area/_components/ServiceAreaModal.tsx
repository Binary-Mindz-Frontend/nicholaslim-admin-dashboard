import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { ServiceArea, ServiceAreaModalProps } from '@/types/serviceAreaType';

declare global {
  interface Window {
    google: any;
  }
}

const ServiceAreaModal = ({ isOpen, onClose, editData, onSave }: ServiceAreaModalProps) => {
  const [formData, setFormData] = useState<Partial<ServiceArea>>({
    name: '',
    displayName: '',
    cityZone: '',
    deliveryFee: 0,
    priority: 5,
    isActive: true,
    color: '#FF5733',
    minOrderAmount: 0,
    notes: '',
    coordinates: [],
  });

  const mapRef = useRef<HTMLDivElement>(null);
  const drawingManagerRef = useRef<any>(null);
  const currentPolygonRef = useRef<any>(null);

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({
        name: '',
        displayName: '',
        cityZone: '',
        deliveryFee: 0,
        priority: 5,
        isActive: true,
        color: '#FF5733',
        minOrderAmount: 0,
        notes: '',
        coordinates: [],
      });
    }
  }, [editData, isOpen]);

  useEffect(() => {
    if (!isOpen || !mapRef.current || !window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 23.8103, lng: 90.4125 },
      zoom: 12,
      mapTypeControl: true,
    });

    const drawingManager = new window.google.maps.drawing.DrawingManager({
      drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: {
        fillColor: formData.color,
        fillOpacity: 0.4,
        strokeWeight: 2,
        strokeColor: formData.color,
        editable: true,
      },
    });

    drawingManager.setMap(map);
    drawingManagerRef.current = drawingManager;

    // If editing, show existing polygon
    if (editData?.coordinates && editData.coordinates.length > 0) {
      const polygon = new window.google.maps.Polygon({
        paths: editData.coordinates,
        strokeColor: editData.color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: editData.color,
        fillOpacity: 0.4,
        editable: true,
        map: map,
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
      editData.coordinates.forEach((coordL : any) => bounds.extend(coordL));
      map.fitBounds(bounds);
    }

    window.google.maps.event.addListener(drawingManager, 'polygoncomplete', (polygon: any) => {
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
      if (drawingManagerRef.current) {
        drawingManagerRef.current.setMap(null);
      }
    };
  }, [isOpen, formData.color, editData]);

  const updateCoordinates = (polygon: any) => {
    const path = polygon.getPath();
    const coords: { lat: number; lng: number }[] = [];
    for (let i = 0; i < path.getLength(); i++) {
      const point = path.getAt(i);
      coords.push({ lat: point.lat(), lng: point.lng() });
    }
    setFormData((prev: Partial<ServiceArea>) => ({ ...prev, coordinates: coords }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.coordinates || formData.coordinates.length === 0) {
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
                    onChange={(e) =>
                      setFormData({ ...formData, deliveryFee: parseFloat(e.target.value) })
                    }
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
                    onChange={(e) =>
                      setFormData({ ...formData, priority: parseInt(e.target.value) })
                    }
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
                  onChange={(e) =>
                    setFormData({ ...formData, minOrderAmount: parseFloat(e.target.value) })
                  }
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
                    value={formData.isActive?.toString()}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.value === 'true' })
                    }
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

              {formData.coordinates && formData.coordinates.length > 0 && (
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
                Click on the map to draw polygon points. Complete the polygon by clicking on the first
                point.
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

export default ServiceAreaModal;