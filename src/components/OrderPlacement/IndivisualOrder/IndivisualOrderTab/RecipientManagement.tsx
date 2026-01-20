/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useRef } from "react";
import { X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

interface RecipientData {
  id: string;
  contact_name: string;
  contact_number: string;
  address: string;
  floor_unit: string;
  note_to_driver: string;
  postal_code: string;
}

interface RecipientManagementProps {
  sender: Omit<RecipientData, "id">;
  recipients: RecipientData[];
  handleSenderInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => void;
  handleRecipientInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    recipientId: string,
    field: string
  ) => void;
  addRecipient: () => void;
  removeRecipient: (recipientId: string) => void;
}

interface AddressSuggestion {
  formatted_address: string;
  place_id: string;
}

// Google Maps API Response Types
interface GeocodeResult {
  results: Array<{
    formatted_address: string;
    place_id: string;
    address_components: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }>;
  status: string;
}

const RecipientManagement: React.FC<RecipientManagementProps> = ({
  sender,
  recipients,
  handleSenderInputChange,
  handleRecipientInputChange,
  addRecipient,
  removeRecipient,
}) => {
  const [isLoadingAddress, setIsLoadingAddress] = useState<string | null>(null);
  const [addressSuggestions, setAddressSuggestions] = useState<{
    [key: string]: AddressSuggestion[];
  }>({});
  const [showSuggestions, setShowSuggestions] = useState<{
    [key: string]: boolean;
  }>({});

  const debounceTimers = useRef<{
    [key: string]: ReturnType<typeof setTimeout>;
  }>({});

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach((timer) =>
        clearTimeout(timer)
      );
    };
  }, []);

  // Function to fetch address from postal code using Google Maps Geocoding API
  const fetchAddressFromPostalCode = useCallback(
    async (postalCode: string, fieldId: string) => {
      if (!postalCode || postalCode.length < 3) {
        setAddressSuggestions((prev) => ({ ...prev, [fieldId]: [] }));
        setShowSuggestions((prev) => ({ ...prev, [fieldId]: false }));
        return;
      }

      setIsLoadingAddress(fieldId);

      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            postalCode
          )}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
        );

        console.log("===========mapKey is coming=========", import.meta.env.VITE_GOOGLE_MAPS_API_KEY)

        const data: GeocodeResult = await response.json();

        if (data.status === "OK" && data.results.length > 0) {
          const suggestions = data.results.map((result) => ({
            formatted_address: result.formatted_address,
            place_id: result.place_id,
          }));

          setAddressSuggestions((prev) => ({
            ...prev,
            [fieldId]: suggestions,
          }));
          setShowSuggestions((prev) => ({ ...prev, [fieldId]: true }));
        } else {
          setAddressSuggestions((prev) => ({ ...prev, [fieldId]: [] }));
          setShowSuggestions((prev) => ({ ...prev, [fieldId]: false }));
        }
      } catch (error) {
        console.error("Error fetching address from Google Maps:", error);
        setAddressSuggestions((prev) => ({ ...prev, [fieldId]: [] }));
        setShowSuggestions((prev) => ({ ...prev, [fieldId]: false }));
      } finally {
        setIsLoadingAddress(null);
      }
    },
    []
  );

  // Debounced function to handle postal code changes
  const handlePostalCodeChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      context: "sender" | "recipient",
      recipientId?: string
    ) => {
      const { value } = e.target;
      const fieldId =
        context === "sender"
          ? "sender-postal"
          : `recipient-${recipientId}-postal`;

      // Clear existing timer
      if (debounceTimers.current[fieldId]) {
        clearTimeout(debounceTimers.current[fieldId]);
      }

      // Update the postal code immediately
      if (context === "sender") {
        handleSenderInputChange(e, "postal_code");
      } else if (recipientId) {
        handleRecipientInputChange(e, recipientId, "postal_code");
      }

      // Debounce the API call
      debounceTimers.current[fieldId] = setTimeout(() => {
        if (value.trim().length >= 3) {
          fetchAddressFromPostalCode(value, fieldId);
        } else {
          setAddressSuggestions((prev) => ({ ...prev, [fieldId]: [] }));
          setShowSuggestions((prev) => ({ ...prev, [fieldId]: false }));
        }
      }, 500);
    },
    [
      fetchAddressFromPostalCode,
      handleSenderInputChange,
      handleRecipientInputChange,
    ]
  );

  // Function to handle address selection from suggestions
  const handleAddressSelect = useCallback(
    (
      address: string,
      fieldId: string,
      context: "sender" | "recipient",
      recipientId?: string
    ) => {
      // Create a synthetic event
      const syntheticEvent = {
        target: { value: address },
      } as React.ChangeEvent<HTMLInputElement>;

      // Update the address field
      if (context === "sender") {
        handleSenderInputChange(syntheticEvent, "address");
      } else if (recipientId) {
        handleRecipientInputChange(syntheticEvent, recipientId, "address");
      }

      // Close suggestions
      setShowSuggestions((prev) => ({ ...prev, [fieldId]: false }));
    },
    [handleSenderInputChange, handleRecipientInputChange]
  );

  // Function to handle manual address input (close suggestions)
  const handleManualAddressChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      context: "sender" | "recipient",
      recipientId?: string
    ) => {
      const fieldId =
        context === "sender"
          ? "sender-postal"
          : `recipient-${recipientId}-postal`;

      // Update address
      if (context === "sender") {
        handleSenderInputChange(e, "address");
      } else if (recipientId) {
        handleRecipientInputChange(e, recipientId, "address");
      }

      // Close suggestions if user starts typing manually
      setShowSuggestions((prev) => ({ ...prev, [fieldId]: false }));
    },
    [handleSenderInputChange, handleRecipientInputChange]
  );

  // Component for address suggestions dropdown
  const AddressSuggestionsDropdown: React.FC<{
    suggestions: AddressSuggestion[];
    fieldId: string;
    context: "sender" | "recipient";
    recipientId?: string;
  }> = ({ suggestions, fieldId, context, recipientId }) => {
    if (!suggestions || suggestions.length === 0) return null;

    return (
      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
        <div className="p-2 text-sm text-gray-500 border-b">
          Suggested addresses:
        </div>
        {suggestions.map((suggestion, index) => (
          <button
            key={suggestion.place_id}
            type="button"
            className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            onClick={() =>
              handleAddressSelect(
                suggestion.formatted_address,
                fieldId,
                context,
                recipientId
              )
            }
          >
            <div className="text-sm text-gray-800">
              {suggestion.formatted_address}
            </div>
            {index < suggestions.length - 1 && (
              <div className="border-t my-1" />
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Sender Info */}
      <div className="bg-white rounded-lg p-8 border border-gray-200 mb-6">
        <h3 className="text-lg font-medium mb-4">Sender Info</h3>
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div>
            <Label className="mb-2">Name</Label>
            <Input
              value={sender.contact_name}
              onChange={(e) => handleSenderInputChange(e, "contact_name")}
              placeholder="Enter Name"
              required
            />
          </div>
          <div>
            <Label className="mb-2">Number</Label>
            <Input
              type="tel"
              value={sender.contact_number}
              onChange={(e) => handleSenderInputChange(e, "contact_number")}
              placeholder="Enter Number"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="relative">
            <Label className="mb-2">Postal Code</Label>
            <div className="relative">
              <Input
                type="text"
                value={sender.postal_code}
                onChange={(e) => handlePostalCodeChange(e, "sender")}
                placeholder="Enter postal code"
                required
                className="pr-10"
              />
              {isLoadingAddress === "sender-postal" && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                </div>
              )}
            </div>
            {showSuggestions["sender-postal"] &&
              addressSuggestions["sender-postal"]?.length > 0 && (
                <AddressSuggestionsDropdown
                  suggestions={addressSuggestions["sender-postal"]}
                  fieldId="sender-postal"
                  context="sender"
                />
              )}
          </div>

          <div>
            <Label className="mb-2">Address</Label>
            <Input
              value={sender.address}
              onChange={(e) => handleManualAddressChange(e, "sender")}
              placeholder="Address will auto-fill from postal code"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter postal code first for auto-fill
            </p>
          </div>

          <div>
            <Label className="mb-2">Floor or Unit no.</Label>
            <Input
              value={sender.floor_unit}
              onChange={(e) => handleSenderInputChange(e, "floor_unit")}
              placeholder="Floor or Unit no."
            />
          </div>
        </div>

        <div>
          <Label className="mb-2">Note to driver</Label>
          <Textarea
            value={sender.note_to_driver}
            onChange={(e) => handleSenderInputChange(e, "note_to_driver")}
            className="h-32"
            placeholder="Note to driver"
          />
        </div>
      </div>

      {/* Recipients Info */}
      {recipients.map((recipient, index) => {
        const fieldId = `recipient-${recipient.id}-postal`;

        return (
          <div
            key={recipient.id}
            className="bg-white rounded-lg p-8 border border-gray-200 mb-6 relative"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">
                Recipient Info {index + 1}
              </h3>
              {recipients.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeRecipient(recipient.id)}
                  className="flex items-center gap-2"
                >
                  <X size={16} />
                  
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <Label className="mb-2">Recipient</Label>
                <Input
                  value={recipient.contact_name}
                  onChange={(e) =>
                    handleRecipientInputChange(e, recipient.id, "contact_name")
                  }
                  placeholder="Enter Recipient"
                  required
                />
              </div>
              <div>
                <Label className="mb-2">Number</Label>
                <Input
                  value={recipient.contact_number}
                  onChange={(e) =>
                    handleRecipientInputChange(
                      e,
                      recipient.id,
                      "contact_number"
                    )
                  }
                  placeholder="Enter Number"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="relative">
                <Label className="mb-2">Postal Code</Label>
                <div className="relative">
                  <Input
                    type="text"
                    value={recipient.postal_code}
                    onChange={(e) =>
                      handlePostalCodeChange(e, "recipient", recipient.id)
                    }
                    placeholder="Enter postal code"
                    required
                    className="pr-10"
                  />
                  {isLoadingAddress === fieldId && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    </div>
                  )}
                </div>
                {showSuggestions[fieldId] &&
                  addressSuggestions[fieldId]?.length > 0 && (
                    <AddressSuggestionsDropdown
                      suggestions={addressSuggestions[fieldId]}
                      fieldId={fieldId}
                      context="recipient"
                      recipientId={recipient.id}
                    />
                  )}
              </div>

              <div>
                <Label className="mb-2">Address</Label>
                <Input
                  value={recipient.address}
                  onChange={(e) =>
                    handleManualAddressChange(e, "recipient", recipient.id)
                  }
                  placeholder="Address will auto-fill from postal code"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter postal code first for auto-fill
                </p>
              </div>

              <div>
                <Label className="mb-2">Floor or Unit no.</Label>
                <Input
                  value={recipient.floor_unit}
                  onChange={(e) =>
                    handleRecipientInputChange(e, recipient.id, "floor_unit")
                  }
                  placeholder="Floor or Unit no."
                />
              </div>
            </div>

            <div>
              <Label className="mb-2">Note to driver</Label>
              <Textarea
                value={recipient.note_to_driver}
                onChange={(e) =>
                  handleRecipientInputChange(e, recipient.id, "note_to_driver")
                }
                className="h-32"
                placeholder="Note to driver"
              />
            </div>
          </div>
        );
      })}

      <Button
        type="button"
        onClick={addRecipient}
        className="mb-6 bg-yellow-400 text-lg py-3 font-semibold cursor-pointer mx-auto block text-black hover:bg-yellow-500 rounded-md"
      >
        Add Stop
      </Button>
    </>
  );
};

export default RecipientManagement;
