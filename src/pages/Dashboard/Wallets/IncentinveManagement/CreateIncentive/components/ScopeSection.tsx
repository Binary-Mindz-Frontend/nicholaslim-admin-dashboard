import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface ScopeSectionProps {
  formData: {
    serviceZoneIds: number[];
    driver_type_ids: number[];
    [key: string]: any;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  activeZones: any[];
  vehicleTypes: any[];
}

export const ScopeSection: React.FC<ScopeSectionProps> = ({
  formData,
  setFormData,
  activeZones,
  vehicleTypes,
}) => {
  return (
    <div className="col-span-2">
      <div className="border-t pt-4 mt-2 space-y-4">
        <h4 className="md:text-lg font-bold mb-3">Scope</h4>

        <div className="space-y-2 col-span-2">
          <Label>Service Zones</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {activeZones.length > 0 && (
              <Badge
                variant={
                  formData.serviceZoneIds.length === activeZones.length
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer"
                onClick={() => {
                  if (
                    formData.serviceZoneIds.length === activeZones.length
                  ) {
                    setFormData({ ...formData, serviceZoneIds: [] });
                  } else {
                    setFormData({
                      ...formData,
                      serviceZoneIds: activeZones.map((z: any) => z.id),
                    });
                  }
                }}
              >
                All Zones
              </Badge>
            )}
            {activeZones.map((zone: any) => {
              const isSelected = formData.serviceZoneIds.includes(zone.id);
              return (
                <Badge
                  key={zone.id}
                  variant={isSelected ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    setFormData((prev: any) => ({
                      ...prev,
                      serviceZoneIds: isSelected
                        ? prev.serviceZoneIds.filter((id: number) => id !== zone.id)
                        : [...prev.serviceZoneIds, zone.id],
                    }));
                  }}
                >
                  {zone.name}
                </Badge>
              );
            })}
          </div>
        </div>

        <div className="space-y-2 col-span-2">
          <Label>Vehicle Type</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {vehicleTypes.map((vt: any) => {
              const isSelected = formData.driver_type_ids.includes(vt.id);
              return (
                <Badge
                  key={vt.id}
                  variant={isSelected ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    setFormData((prev: any) => ({
                      ...prev,
                      driver_type_ids: isSelected
                        ? prev.driver_type_ids.filter((id: number) => id !== vt.id)
                        : [...prev.driver_type_ids, vt.id],
                    }));
                  }}
                >
                  {vt.vehicle_name}
                </Badge>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
