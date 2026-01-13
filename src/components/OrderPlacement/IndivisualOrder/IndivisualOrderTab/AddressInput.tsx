// components/AddressInput.tsx
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, MapPin, MapPinOff } from "lucide-react";

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  onPostalCodeChange?: (postalCode: string) => void;
}

const AddressInput = ({
  value,
  onChange,
  label,
  placeholder = "Enter address",
  required = false,
  disabled = false,
  onPostalCodeChange,
}: AddressInputProps) => {
  const [postalCode, setPostalCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showManualEdit, setShowManualEdit] = useState(false);
  const [manualAddress, setManualAddress] = useState(value);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize Google Maps Autocomplete
  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places || !inputRef.current) {
      return;
    }

    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["address"],
          componentRestrictions: { country: "us" },
          fields: ["formatted_address", "address_components", "geometry"],
        }
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.formatted_address) {
          onChange(place.formatted_address);
          setManualAddress(place.formatted_address);
          extractPostalCode(place.address_components);
          setGeocodingError(null);
        }
      });
    } catch (error) {
      console.error("Error initializing Google Maps Autocomplete:", error);
    }

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  const extractPostalCode = (components: google.maps.GeocoderAddressComponent[] = []) => {
    const postalCodeComponent = components.find(
      (component) => component.types.includes("postal_code")
    );
    if (postalCodeComponent) {
      const code = postalCodeComponent.long_name;
      setPostalCode(code);
      onPostalCodeChange?.(code);
    }
  };

  const handlePostalCodeFetch = async () => {
    if (!postalCode.trim() || !window.google?.maps?.Geocoder) {
      return;
    }

    setIsLoading(true);
    setGeocodingError(null);
    
    try {
      const geocoder = new window.google.maps.Geocoder();
      
      const result = await geocoder.geocode({ 
        address: postalCode,
        componentRestrictions: { country: "us" }
      });

      if (result.results && result.results[0]) {
        const address = result.results[0].formatted_address;
        onChange(address);
        setManualAddress(address);
        setShowManualEdit(true);
        extractPostalCode(result.results[0].address_components);
      } else {
        setGeocodingError("No address found for this postal code");
        setShowManualEdit(true);
      }
    } catch (error: any) {
      console.error("Error fetching address from postal code:", error);
      setGeocodingError("Unable to fetch address. Please enter manually.");
      setShowManualEdit(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setManualAddress(newAddress);
    onChange(newAddress);
    setGeocodingError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    onChange(newAddress);
    setManualAddress(newAddress);
    setGeocodingError(null);
  };

  const isGoogleMapsAvailable = window.google?.maps?.places;

  return (
    <div className="space-y-2">
      <Label className="flex items-center justify-between">
        <span>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
        {postalCode && isGoogleMapsAvailable && (
          <button
            type="button"
            onClick={() => setShowManualEdit(!showManualEdit)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showManualEdit ? "Use auto-fill" : "Edit manually"}
          </button>
        )}
      </Label>

      <div className="space-y-2">
        {/* Postal Code Input - Always visible */}
        <div className="relative">
          <Input
            type="text"
            value={postalCode}
            onChange={(e) => {
              setPostalCode(e.target.value);
              setGeocodingError(null);
            }}
            placeholder="Enter ZIP/Postal Code"
            disabled={disabled || isLoading}
            className="pr-10"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handlePostalCodeFetch();
              }
            }}
          />
          {isGoogleMapsAvailable && (
            <button
              type="button"
              onClick={handlePostalCodeFetch}
              disabled={!postalCode.trim() || isLoading || disabled}
              className="absolute right-2 top-1/2 -translate-y-1/2 disabled:opacity-50"
              title="Fetch address by postal code"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="h-4 w-4 text-gray-500 hover:text-gray-700" />
              )}
            </button>
          )}
        </div>

        {/* Error message */}
        {geocodingError && (
          <div className="text-sm text-red-600">
            {geocodingError}
          </div>
        )}

        {/* Address Input */}
        {showManualEdit && isGoogleMapsAvailable ? (
          <Input
            ref={inputRef}
            value={manualAddress}
            onChange={handleManualAddressChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
          />
        ) : (
          <Input
            ref={isGoogleMapsAvailable ? inputRef : undefined}
            value={value}
            onChange={handleInputChange}
            placeholder={isGoogleMapsAvailable ? placeholder : "Enter address (manual entry only)"}
            disabled={disabled}
            required={required}
          />
        )}
      </div>
    </div>
  );
};

export default AddressInput;