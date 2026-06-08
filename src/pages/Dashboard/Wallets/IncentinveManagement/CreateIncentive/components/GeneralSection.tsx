import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface GeneralSectionProps {
  formData: {
    name: string;
    description: string;
    [key: string]: any;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export const GeneralSection: React.FC<GeneralSectionProps> = ({
  formData,
  setFormData,
}) => {
  return (
    <>
      <div className="col-span-2 border-t pt-4">
        <h4 className="md:text-lg font-bold">General</h4>
      </div>

      <div className="space-y-2 col-span-2">
        <Label>Incentive Name</Label>
        <Input
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          placeholder="Summer Bonus"
        />
      </div>

      <div className="space-y-2 col-span-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Incentive description"
        />
      </div>
    </>
  );
};
