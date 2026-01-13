// components/PersonInfo.tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AddressInput from "./AddressInput";
// import AddressInput from "./AddressInput";

interface PersonInfoProps {
  type: "sender" | "receiver";
  data: {
    contact_name: string;
    contact_number: string;
    address: string;
    floor_unit: string;
    note_to_driver: string;
    postal_code?: string;
  };
  onChange: (field: keyof typeof data, value: string) => void;
  onAddressChange: (address: string, postalCode?: string) => void;
  isLast?: boolean;
  onRemove?: () => void;
}

const PersonInfo = ({
  type,
  data,
  onChange,
  onAddressChange,
  isLast = true,
  onRemove,
}: PersonInfoProps) => {
  const title = type === "sender" ? "Sender Info" : "Recipient Info";
  const isRecipient = type === "receiver";

  const handleAddressChange = (address: string, postalCode?: string) => {
    onChange("address", address);
    onAddressChange(address, postalCode);
  };

  return (
    <div className="bg-white rounded-lg p-8 border border-gray-200 mb-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        {isRecipient && !isLast && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-4">
        <div>
          <Label className="mb-2">
            {isRecipient ? "Recipient" : "Name"}
          </Label>
          <Input
            value={data.contact_name}
            onChange={(e) => onChange("contact_name", e.target.value)}
            placeholder={`Enter ${isRecipient ? "Recipient" : "Name"}`}
            required
          />
        </div>
        <div>
          <Label className="mb-2">Number</Label>
          <Input
            type="tel"
            value={data.contact_number}
            onChange={(e) => onChange("contact_number", e.target.value)}
            placeholder="Enter Number"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div>
          <AddressInput
            value={data.address}
            onChange={(address) => handleAddressChange(address)}
            label="Address"
            placeholder="Enter Address"
            required
            onPostalCodeChange={(postalCode) => {
              onChange("postal_code", postalCode);
              onAddressChange(data.address, postalCode);
            }}
          />
        </div>
        <div>
          <Label className="mb-2">Floor or Unit no.</Label>
          <Input
            value={data.floor_unit}
            onChange={(e) => onChange("floor_unit", e.target.value)}
            placeholder="Floor or Unit no."
          />
        </div>
        <div>
          <Label className="mb-2">ZIP/Postal Code</Label>
          <Input
            value={data.postal_code || ""}
            onChange={(e) => onChange("postal_code", e.target.value)}
            placeholder="Enter ZIP/Postal Code"
          />
        </div>
      </div>

      <div>
        <Label className="mb-2">Note to driver</Label>
        <Textarea
          value={data.note_to_driver}
          onChange={(e) => onChange("note_to_driver", e.target.value)}
          className="h-32"
          placeholder="Note to driver"
        />
      </div>
    </div>
  );
};

export default PersonInfo;