/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Loader2 } from "lucide-react";
import { ServiceArea, ServiceAreaModalProps } from "@/types/serviceAreaType";

declare global {
  interface Window {
    google: any;
  }
}

const ServiceAreaModal = ({
  isOpen,
  onClose,
  editData,
  onSave,
  isLoading = false,
}: ServiceAreaModalProps & { isLoading?: boolean }) => {
  const [formData, setFormData] = useState<Partial<ServiceArea>>({
    name: "",
    displayName: "",
    cityZone: "",
    deliveryFee: 0,
    priority: 5,
    isActive: true,
    color: "#FF5733",
    minOrderAmount: 0,
    notes: "",
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
        name: "",
        displayName: "",
        cityZone: "",
        deliveryFee: 0,
        priority: 5,
        isActive: true,
        color: "#FF5733",
        minOrderAmount: 0,
        notes: "",
        coordinates: [],
      });
    }
  }, [editData, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      if (currentPolygonRef.current) {
        currentPolygonRef.current.setMap(null);
        currentPolygonRef.current = null;
      }
      if (drawingManagerRef.current) {
        drawingManagerRef.current.setMap(null);
        drawingManagerRef.current = null;
      }
      return;
    }

    const initializeMap = () => {
      if (!mapRef.current || !window.google) return;

      const map = new window.google.maps.Map(mapRef.current, {
        // center: { lat: 23.8103, lng: 90.4125 },
        center: { lat: 1.3521, lng: 103.8198 },
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

        window.google.maps.event.addListener(
          polygon.getPath(),
          "set_at",
          () => {
            updateCoordinates(polygon);
          },
        );
        window.google.maps.event.addListener(
          polygon.getPath(),
          "insert_at",
          () => {
            updateCoordinates(polygon);
          },
        );

        const bounds = new window.google.maps.LatLngBounds();
        editData.coordinates.forEach((coordL: any) => bounds.extend(coordL));
        map.fitBounds(bounds);
      }

      window.google.maps.event.addListener(
        drawingManager,
        "polygoncomplete",
        (polygon: any) => {
          if (currentPolygonRef.current) {
            currentPolygonRef.current.setMap(null);
          }

          currentPolygonRef.current = polygon;
          drawingManager.setDrawingMode(null);

          updateCoordinates(polygon);

          window.google.maps.event.addListener(
            polygon.getPath(),
            "set_at",
            () => {
              updateCoordinates(polygon);
            },
          );
          window.google.maps.event.addListener(
            polygon.getPath(),
            "insert_at",
            () => {
              updateCoordinates(polygon);
            },
          );
        },
      );
    };

    if (window.google) {
      initializeMap();
    } else {
      const checkGoogle = setInterval(() => {
        if (window.google) {
          clearInterval(checkGoogle);
          initializeMap();
        }
      }, 100);

      return () => clearInterval(checkGoogle);
    }

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
    setFormData((prev: any) => ({
      ...prev,
      coordinates: coords,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.cityZone ||
      !formData.coordinates ||
      formData.coordinates.length === 0
    ) {
      return;
    }

    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50000 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">
            {editData
              ? `Edit Service Area (ID: ${editData.id})`
              : "Create New Service Area"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="flex items-center">
                  Internal Name <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  disabled={isLoading}
                  placeholder="Enter internal name for the zone"
                />
              </div>

              <div>
                <Label htmlFor="cityZone" className="flex items-center">
                  Zone Name <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="cityZone"
                  value={formData.cityZone}
                  onChange={(e) =>
                    setFormData({ ...formData, cityZone: e.target.value })
                  }
                  required
                  disabled={isLoading}
                  placeholder="Enter display name for the zone"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deliveryFee" className="flex items-center">
                    Delivery Fee ($){" "}
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="deliveryFee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.deliveryFee}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deliveryFee: parseFloat(e.target.value) || 0,
                      })
                    }
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="priority" className="flex items-center">
                    Priority (1-10) <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="priority"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: parseInt(e.target.value) || 5,
                      })
                    }
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="minOrderAmount">Minimum Order Amount ($)</Label>
                <Input
                  id="minOrderAmount"
                  type="number"
                  min="0"
                  value={formData.minOrderAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minOrderAmount: parseFloat(e.target.value) || 0,
                    })
                  }
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="color">Zone Color</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      disabled={isLoading}
                      className="w-12 h-10 p-1"
                    />
                    <span className="text-sm text-gray-600">
                      {formData.color}
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="isActive">Status</Label>
                  <select
                    id="isActive"
                    value={formData.isActive?.toString()}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isActive: e.target.value === "true",
                      })
                    }
                    className="w-full p-2 border rounded bg-white"
                    disabled={isLoading}
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
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  rows={3}
                  disabled={isLoading}
                  placeholder="Add any additional notes about this service zone..."
                />
              </div>

              {formData.coordinates && formData.coordinates.length > 0 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <div className="flex items-center text-green-700">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">
                      ✓ Polygon drawn with {formData.coordinates.length} points
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label className="flex items-center">
                Draw Service Area on Map{" "}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <div
                ref={mapRef}
                className="w-full h-[500px] rounded-lg border mt-2"
              />
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-600">
                  • Click the polygon tool (✓) in the top center of the map
                </p>
                <p className="text-sm text-gray-600">
                  • Click on the map to create polygon points
                </p>
                <p className="text-sm text-gray-600">
                  • Complete the polygon by clicking on the first point
                </p>
                <p className="text-sm text-gray-600">
                  • Drag points to adjust the shape
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="px-6 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 px-6 cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {editData ? "Updating..." : "Creating..."}
              </>
            ) : editData ? (
              "Update Service Area"
            ) : (
              "Create Service Area"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceAreaModal;
