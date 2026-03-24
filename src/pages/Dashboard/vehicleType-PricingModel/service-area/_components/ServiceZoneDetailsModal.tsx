import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MapPin,
  DollarSign,
  Hash,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceArea } from "@/types/serviceAreaType";

interface ServiceZoneDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  zoneData: ServiceArea | null;
}

export default function ServiceZoneDetailsModal({
  isOpen,
  onClose,
  zoneData,
}: ServiceZoneDetailsModalProps) {
  if (!zoneData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[75vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <MapPin className="h-6 w-6 text-blue-600" />
                Service Zone Details
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className="h-8 w-8 rounded"
                  style={{ backgroundColor: zoneData.color }}
                />
                <div>
                  <p className="text-sm text-gray-500">Zone Name</p>
                  <p className="font-semibold">{zoneData.name}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">City/Zone</p>
                <p className="font-semibold">{zoneData.cityZone}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Zone ID</p>
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-400" />
                  <p className="font-mono font-semibold">{zoneData.id}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <div className="flex items-center gap-2">
                  {zoneData.isActive ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-400" />
                  )}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      zoneData.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {zoneData.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Financial Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Price Multiplier*</p>
                <p className="text-xl font-bold text-green-600">
                  {zoneData.deliveryFee}x
                </p>
              </div>
              {/* Hiding Min Order Amount as per request */}
              {/* <div>
                <p className="text-sm text-gray-500">Min Order Amount</p>
                <p className="text-xl font-bold">${zoneData.minOrderAmount}</p>
              </div> */}
              <div>
                <p className="text-sm text-gray-500">Priority</p>
                <p className="text-2xl font-bold text-blue-600">
                  {zoneData.priority}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {zoneData.notes && (
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Notes
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {zoneData.notes}
              </p>
            </div>
          )}

          {/* Coordinates Info */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Coordinates</h3>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-600 mb-2">
                Polygon has {zoneData.coordinates?.length || 0} points
              </p>
              <div className="max-h-40 overflow-y-auto">
                {zoneData.coordinates?.map((coord, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm py-1 border-b last:border-0"
                  >
                    <span>Point {index + 1}</span>
                    <span className="font-mono">
                      {coord.lat.toFixed(6)}, {coord.lng.toFixed(6)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="cursor-pointer">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
