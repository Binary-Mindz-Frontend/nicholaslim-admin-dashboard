/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Upload, X, Loader2, MapPin, CheckCircle2, Navigation, Search, ChevronRight } from "lucide-react";

// --- START: Shared Constants ---

export const LICENSE_CLASSES = [
  "Class 2B",
  "Class 2A",
  "Class 2",
  "Class 3",
  "Class 3A",
  "Class 4",
  "Class 5",
];

export const COUNTRIES = [
  "Singapore",
  "Malaysia",
  "India",
  "Bangladesh",
  "Indonesia",
  "Thailand",
  "Vietnam",
];

export const RANKS = ["BRONZE", "SILVER", "GOLD", "PLATINUM", "PREMIUM"];

export const COUNTRY_CODES = [
  { code: "+65", label: "🇸🇬 +65", country: "SG" },
  { code: "+60", label: "🇲🇾 +60", country: "MY" },
  { code: "+91", label: "🇮🇳 +91", country: "IN" },
];

// --- START: Shared UI Components ---

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const Button = ({ children, className = "", ...props }: ButtonProps) => (
  <button
    className={`px-4 py-2 rounded font-medium transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = ({ className = "", ...props }: InputProps) => (
  <input
    className={`w-full border rounded px-3 py-2 bg-secondary focus:outline-none focus:border-yellow-400 ${className}`}
    {...props}
  />
);

export interface LabelProps {
  children: React.ReactNode;
  className?: string;
}

export const Label = ({ children, className = "" }: LabelProps) => (
  <label className={`block text-sm font-semibold mb-2 ${className}`}>
    {children}
  </label>
);

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-6 mt-10">
    {children}
  </h2>
);

export const InputWrapper = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <Label className="text-sm font-semibold">{label}</Label>
    {children}
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

export interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: any;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export const PhoneInput = ({
  value,
  onChange,
  onBlur,
  placeholder = "XXXX XXXX",
  error,
  disabled,
}: PhoneInputProps) => {
  const selectedCountry = COUNTRY_CODES.find(c => String(value).startsWith(c.code)) || COUNTRY_CODES[0];

  const localValue = String(value).startsWith(selectedCountry.code)
    ? String(value).slice(selectedCountry.code.length).trimStart()
    : value;

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value;
    onChange(`${newCode}${localValue ? " " + localValue : ""}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9\s]/g, ""); // digits and spaces only
    onChange(`${selectedCountry.code}${raw ? " " + raw : ""}`);
  };

  return (
    <div>
      <div
        className={`flex items-center w-full border rounded bg-[#FFFAE6] focus-within:border-yellow-400 overflow-hidden ${error ? "border-red-400" : "border-gray-300"}`}
      >
        <select
          value={selectedCountry.code}
          onChange={handleCountryChange}
          disabled={disabled}
          className="flex items-center gap-1.5 px-2 py-2 bg-[#FFFAE6] border-r border-gray-300 text-sm font-semibold text-gray-700 whitespace-nowrap outline-none cursor-pointer shrink-0"
        >
          {COUNTRY_CODES.map((country) => (
            <option key={country.code} value={country.code}>
              {country.label}
            </option>
          ))}
        </select>
        <input
          type="tel"
          value={localValue}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 px-3 py-2 focus:outline-none text-sm bg-transparent"
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export interface UploadBoxProps {
  label: string;
  onChange: (file: File | null) => void;
  error?: string | null;
  isUploading?: boolean;
  currentPreviewUrl?: string | null;
  buttonText?: string;
}

export const UploadBox = ({
  label,
  onChange,
  error,
  isUploading,
  currentPreviewUrl,
  buttonText = "Upload Photo",
}: UploadBoxProps) => {
  const [localFileUrl, setLocalFileUrl] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLocallyCleared, setIsLocallyCleared] = useState(false);

  useEffect(() => {
    // Reset local clear state when a new remote URL is provided
    if (currentPreviewUrl && !localFileUrl) {
      setIsLocallyCleared(false);
      const isRemotePdf = String(currentPreviewUrl).toLowerCase().split('?')[0].endsWith(".pdf");
      setIsPdf(isRemotePdf);
      setFileName(isRemotePdf ? "Uploaded PDF Document" : null);
    }
  }, [currentPreviewUrl, localFileUrl]);

  const preview = isLocallyCleared ? null : (localFileUrl || currentPreviewUrl);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    setIsLocallyCleared(false);
    if (file.type === "application/pdf") {
      if (localFileUrl) URL.revokeObjectURL(localFileUrl);
      setLocalFileUrl(null);
      setIsPdf(true);
      setFileName(file.name);
    } else if (file.type.startsWith("image/")) {
      if (localFileUrl) URL.revokeObjectURL(localFileUrl);
      setLocalFileUrl(URL.createObjectURL(file));
      setIsPdf(false);
      setFileName(null);
    }
    onChange(file);
  };

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLocallyCleared(true);
    if (localFileUrl) {
      URL.revokeObjectURL(localFileUrl);
      setLocalFileUrl(null);
    }
    setIsPdf(false);
    setFileName(null);
    onChange(null);
    const inputElement = document.getElementById(
      `upload-${label.replace(/\s+/g, "-")}`,
    ) as HTMLInputElement;
    if (inputElement) inputElement.value = "";
  };

  return (
    <div>
      <Label>{label}</Label>
      <div className="relative">
        <input
          type="file"
          className="hidden"
          id={`upload-${label.replace(/\s+/g, "-")}`}
          accept="image/*,.pdf"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <label
          htmlFor={`upload-${label.replace(/\s+/g, "-")}`}
          className={`border-2 border-dashed rounded-xl p-6 w-full flex flex-col items-center justify-center text-center cursor-pointer transition min-h-[180px] relative overflow-hidden ${error ? "border-red-400 bg-red-50 hover:bg-red-100" : "border-green-500 bg-white hover:bg-green-50"} ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Upload size={24} className="text-green-600 animate-pulse" />
              <p className="text-sm text-gray-700">Uploading...</p>
            </div>
          ) : isPdf ? (
            <>
              <div className="flex flex-col items-center gap-2 p-4">
                <div className="bg-red-100 rounded-lg p-3">
                  <Upload size={32} className="text-red-500" />
                </div>
                <p className="text-sm font-medium text-gray-800 break-all text-center">
                  {fileName}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 z-10 shadow-lg"
              >
                <X size={16} />
              </button>
            </>
          ) : preview ? (
            <>
              <img
                src={preview}
                alt="preview"
                className="absolute inset-0 w-full h-full object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 z-10 shadow-lg"
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-700 mb-2">{label}</p>
              <span className="flex items-center gap-0.5 justify-center border border-green-500 rounded-md px-2 py-1">
                <Camera className="text-green-600" size={22} />
                <span className="text-xs sm:text-sm text-gray-700">
                  {buttonText}
                </span>
              </span>
              <p className="text-xs text-gray-400 mt-2">PNG, JPG or PDF</p>
            </>
          )}
        </label>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

// --- START: OneMap API & Constants ---

export const SG_CENTER: [number, number] = [1.3521, 103.8198];
export const ONEMAP_SEARCH = "https://www.onemap.gov.sg/api/common/elastic/search";
export const ONEMAP_REVERSE = "https://www.onemap.gov.sg/api/public/revgeocode";

export interface OneMapResult {
  SEARCHVAL: string;
  BLK_NO: string;
  ROAD_NAME: string;
  BUILDING: string;
  ADDRESS: string;
  POSTAL: string;
  X: string;
  Y: string;
  LATITUDE: string;
  LONGITUDE: string;
}

export interface ResolvedAddress {
  postal_code: string;
  address: string;
  lat: number;
  lng: number;
}

export interface AddressSuggestion {
  label: string;
  building: string;
  road: string;
  postal_code: string;
  lat: number;
  lng: number;
}

export function formatOneMapAddress(r: OneMapResult): string {
  const parts: string[] = [];
  const building = r.BUILDING?.trim();
  if (building && building.toUpperCase() !== "NIL" && building !== r.BLK_NO) {
    parts.push(building);
  }
  const street = [r.BLK_NO?.trim(), r.ROAD_NAME?.trim()]
    .filter(Boolean)
    .join(" ");
  if (street) parts.push(street);
  if (r.POSTAL && r.POSTAL !== "NIL") {
    parts.push(`Singapore ${r.POSTAL}`);
  } else {
    parts.push("Singapore");
  }
  return parts.join("\n");
}

export function formatOneMapAddressLine(r: OneMapResult): string {
  return formatOneMapAddress(r).replace(/\n/g, ", ");
}

export async function fetchOneMapPage(query: string, page: number): Promise<{ results: OneMapResult[]; totalNumPages: number }> {
  const url = `${ONEMAP_SEARCH}?searchVal=${encodeURIComponent(query)}&returnGeom=Y&getAddrDetails=Y&pageNum=${page}`;
  const res = await fetch(url);
  if (!res.ok) return { results: [], totalNumPages: 1 };
  const data = await res.json();
  return {
    results: data.results ?? [],
    totalNumPages: data.totalNumPages ?? 1,
  };
}

export async function searchOneMap(query: string): Promise<OneMapResult[]> {
  const first = await fetchOneMapPage(query, 1);
  if (first.totalNumPages <= 1) return first.results;
  const extraPages = Math.min(first.totalNumPages - 1, 5);
  const rest = await Promise.all(
    Array.from({ length: extraPages }, (_, i) => fetchOneMapPage(query, i + 2)),
  );
  return [first.results, ...rest.map((p) => p.results)].flat();
}

export async function reverseOneMap(lat: number, lng: number): Promise<OneMapResult | null> {
  const url = `${ONEMAP_REVERSE}?location=${lat},${lng}&buffer=40&addressType=All&otherFeatures=N`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const info = data.GeocodeInfo;
  if (!info || !info.length) return null;
  const g = info[0];
  return {
    SEARCHVAL: g.BUILDINGNAME || g.ROAD || "",
    BLK_NO: g.BLOCK || "",
    ROAD_NAME: g.ROAD || "",
    BUILDING: g.BUILDINGNAME || "",
    ADDRESS: g.ADDRESS || "",
    POSTAL: g.POSTALCODE || "",
    X: "",
    Y: "",
    LATITUDE: String(lat),
    LONGITUDE: String(lng),
  };
}

export function toSuggestions(results: OneMapResult[]): AddressSuggestion[] {
  const seen = new Set<string>();
  return results
    .filter((r: any) => r.POSTAL && r.POSTAL !== "NIL" && r.LATITUDE && r.LONGITUDE)
    .map((r: any) => {
      const label = formatOneMapAddressLine(r);
      if (seen.has(label)) return null;
      seen.add(label);
      return {
        label,
        building: r.BUILDING?.toUpperCase() === "NIL" ? "" : r.BUILDING,
        road: r.ROAD_NAME,
        postal_code: r.POSTAL,
        lat: parseFloat(r.LATITUDE),
        lng: parseFloat(r.LONGITUDE),
      } as AddressSuggestion;
    })
    .filter(Boolean) as AddressSuggestion[];
}

// singleton leaflet loader
export function loadLeaflet(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).L) { resolve(); return; }
    if (!(window as any).__leafletCallbacks) (window as any).__leafletCallbacks = [];
    (window as any).__leafletCallbacks.push(resolve);
    if (document.getElementById("leaflet-css")) {
      // CSS already injected, just wait for JS
    } else {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    if (document.getElementById("leaflet-js")) return;

    const script = document.createElement("script");
    script.id = "leaflet-js";
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => {
      (window as any).__leafletLoaded = true;
      (window as any).__leafletCallbacks?.forEach((cb: any) => cb());
      (window as any).__leafletCallbacks = [];
    };
    script.onerror = () => reject(new Error("Leaflet failed to load"));
    document.head.appendChild(script);
  });
}

// --- START: Map Modal Components ---

export interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (resolved: ResolvedAddress) => void;
  initialPostalCode?: string;
}

export const MapModal: React.FC<MapModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialPostalCode,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const [postalInput, setPostalInput] = useState("");
  const [pending, setPending] = useState<ResolvedAddress | null>(null);
  const [searching, setSearching] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debounceRef = useRef<any>(0);
  const initialSearchDoneRef = useRef(false);

  function dropPin(lat: number, lng: number) {
    const L = (window as any).L;
    if (!mapRef.current) return;
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
    }
    mapRef.current.panTo([lat, lng]);
  }

  const runSearch = useCallback(async (query: string) => {
    if (!query.trim() || query.trim().length < 3) return;
    setSearching(true);
    setError(null);
    setSuggestions([]);
    setShowSuggestions(false);
    try {
      const results = await searchOneMap(query);
      if (!results.length) {
        setPending(null);
        setError("No location found. Try a building name, road, or postal code.");
        return;
      }

      const suggs = toSuggestions(results);

      if (!suggs.length) {
        setError("No results with valid postal codes found.");
        return;
      }

      setSuggestions(suggs);
      setShowSuggestions(true);

      const first = suggs[0];
      dropPin(first.lat, first.lng);
      if (mapRef.current) mapRef.current.setZoom(17);

      setPending({
        postal_code: first.postal_code,
        address: first.label,
        lat: first.lat,
        lng: first.lng,
      });
      setPostalInput(first.postal_code);
    } catch {
      setError("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    setPostalInput(initialPostalCode ?? "");
    setPending(null);
    setError(null);
    setMapReady(false);
    setSuggestions([]);
    setShowSuggestions(false);
    initialSearchDoneRef.current = false;

    loadLeaflet()
      .then(() => setMapReady(true))
      .catch(() => setError("Failed to load map library."));

    return () => {
      clearTimeout(debounceRef.current);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [isOpen, initialPostalCode]);

  useEffect(() => {
    if (!mapReady || !mapContainerRef.current || mapRef.current) return;

    const L = (window as any).L;

    const map = L.map(mapContainerRef.current, {
      center: SG_CENTER,
      zoom: 11,
      zoomControl: true,
    });

    L.tileLayer(
      "https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png",
      {
        attribution:
          '<img src="https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png" style="height:20px;width:20px;"/> OneMap | Map data &copy; contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>',
        maxZoom: 19,
        minZoom: 11,
      },
    ).addTo(map);

    mapRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    map.on("click", async (e: { latlng: { lat: number; lng: number } }) => {
      const { lat, lng } = e.latlng;
      dropPin(lat, lng);
      setSearching(true);
      setError(null);
      setShowSuggestions(false);
      try {
        const result = await reverseOneMap(lat, lng);
        if (result) {
          const address = formatOneMapAddressLine(result);
          setPending({ postal_code: result.POSTAL, address, lat, lng });
          setPostalInput(result.POSTAL || "");
        } else {
          setError("Couldn't detect address here. Try clicking nearby.");
        }
      } catch {
        setError("Address lookup failed.");
      } finally {
        setSearching(false);
      }
    });

    if (!initialSearchDoneRef.current && initialPostalCode && initialPostalCode.length >= 3) {
      initialSearchDoneRef.current = true;
      runSearch(initialPostalCode);
    }
  }, [mapReady, initialPostalCode, runSearch, isOpen]);

  function selectSuggestion(s: AddressSuggestion) {
    setPending({
      postal_code: s.postal_code,
      address: s.label,
      lat: s.lat,
      lng: s.lng,
    });
    setPostalInput(s.postal_code);
    dropPin(s.lat, s.lng);
    if (mapRef.current) mapRef.current.setZoom(18);
    setShowSuggestions(false);
  }

  const handlePostalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPostalInput(val);
    setSuggestions([]);
    setShowSuggestions(false);
    clearTimeout(debounceRef.current);
    if (val.trim().length >= 3) {
      debounceRef.current = setTimeout(() => runSearch(val), 700);
    } else {
      setPending(null);
    }
  };

  const handleSearchClick = () => {
    clearTimeout(debounceRef.current);
    runSearch(postalInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      clearTimeout(debounceRef.current);
      runSearch(postalInput);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden"
        style={{ maxHeight: "90vh" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-yellow-400 flex items-center justify-center shadow-sm">
              <MapPin size={16} className="text-black" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-tight">
                Select Location
              </p>
              <p className="text-xs text-gray-400 mt-px">
                Search by postal code, building name, or road — powered by OneMap
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 shrink-0">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                value={postalInput}
                onChange={handlePostalChange}
                onKeyDown={handleKeyDown}
                placeholder="e.g. 544750 or Compassvale or The Luxurie"
                autoFocus
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
              />
            </div>
            <button
              type="button"
              onClick={handleSearchClick}
              disabled={searching || postalInput.trim().length < 3}
              className="px-4 py-2.5 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed
                         rounded-lg text-black font-semibold text-sm flex items-center gap-1.5 transition-colors shrink-0"
            >
              {searching ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Search size={14} />
              )}
              Search
            </button>
          </div>

          {error ? (
            <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
              <span>⚠</span> {error}
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-gray-400">
              {showSuggestions
                ? `${suggestions.length} address${suggestions.length !== 1 ? "es" : ""} found — pick one below or click the map.`
                : "Search by postal code, building name, or road name."}
            </p>
          )}
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div
            className="px-6 py-3 border-b border-gray-100 bg-white shrink-0 overflow-y-auto"
            style={{ maxHeight: "220px" }}
          >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Results
            </p>
            <ul className="space-y-1">
              {suggestions.map((s, i) => {
                const isSelected =
                  pending?.postal_code === s.postal_code &&
                  pending?.address === s.label;
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => selectSuggestion(s)}
                      className={`w-full text-left flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm transition-all
                        ${
                          isSelected
                            ? "bg-yellow-50 border border-yellow-300 text-gray-900"
                            : "hover:bg-gray-50 border border-transparent text-gray-700"
                        }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <MapPin
                          size={14}
                          className={`shrink-0 mt-0.5 ${isSelected ? "text-yellow-500" : "text-gray-400"}`}
                        />
                        <div className="min-w-0">
                          {s.building && (
                            <p className="font-semibold text-gray-900 truncate leading-tight">
                              {s.building}
                            </p>
                          )}
                          <p className="text-gray-600 truncate text-xs leading-tight">
                            {[s.road && `${s.road}`, `Singapore ${s.postal_code}`]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        size={14}
                        className={`shrink-0 ${isSelected ? "text-yellow-500" : "text-gray-300"}`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="relative shrink-0" style={{ height: "450px" }}>
          {!mapReady && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-gray-100">
              <Loader2 size={28} className="animate-spin text-yellow-400" />
              <p className="text-sm text-gray-500">Loading map…</p>
            </div>
          )}
          <div ref={mapContainerRef} className="w-full h-full" style={{ zIndex: 0 }} />

          {mapReady && !pending && !searching && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-10">
              <div className="bg-white/95 border border-gray-200 shadow rounded-full px-4 py-2 flex items-center gap-2 text-xs text-gray-500 whitespace-nowrap">
                <MapPin size={12} className="text-yellow-500 shrink-0" />
                Search or click the map to select
              </div>
            </div>
          )}

          {searching && (
            <div className="absolute inset-0 bg-white/40 flex items-center justify-center pointer-events-none z-10">
              <div className="bg-white rounded-xl shadow-md px-4 py-3 flex items-center gap-2 text-sm text-gray-600">
                <Loader2 size={16} className="animate-spin text-yellow-500" />
                Finding addresses…
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 shrink-0">
          {pending ? (
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                  Selected Address
                </p>
                <div className="text-sm font-semibold text-gray-900 leading-snug">
                  {pending.address.split("\n").map((line, i) => (
                    <p key={i} className={i === 0 ? "font-bold" : "font-normal text-gray-700"}>
                      {line}
                    </p>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Postal Code:{" "}
                  <span className="font-medium">{pending.postal_code}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onConfirm(pending);
                  onClose();
                }}
                className="shrink-0 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-sm"
              >
                <CheckCircle2 size={16} />
                Confirm
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-0.5">
              {searching
                ? "Detecting address…"
                : "No location selected yet. Search or click the map."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export const PostalCodeField: React.FC<{
  postalCode: string;
  address: string;
  isDetecting?: boolean;
  onChangeRequest: () => void;
}> = ({ postalCode, address, isDetecting = false, onChangeRequest }) => (
  <div>
    <Label className="mb-2">Postal Code</Label>
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Input
          readOnly
          value={isDetecting ? "" : postalCode}
          placeholder={isDetecting ? "Detecting location…" : "Not set"}
          className="pr-10 bg-gray-50 cursor-default select-none"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {isDetecting ? (
            <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
          ) : postalCode ? (
            <Navigation className="h-4 w-4 text-yellow-500" />
          ) : null}
        </div>
      </div>
      <button
        type="button"
        onClick={onChangeRequest}
        disabled={isDetecting}
        className="text-sm font-semibold text-yellow-600 hover:text-yellow-700 underline underline-offset-2 shrink-0 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {postalCode ? "Change" : "Select"}
      </button>
    </div>
    {!isDetecting && address && (
      <p className="text-xs text-gray-500 mt-1 truncate">{address}</p>
    )}
  </div>
);

export const DetectingAddressInput: React.FC<{
  value: string;
  isDetecting: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}> = ({ value, isDetecting, onChange, placeholder = "Auto-filled from map" }) => (
  <div className="relative">
    <Input
      value={isDetecting ? "" : value}
      onChange={onChange}
      placeholder={isDetecting ? "Detecting your location…" : placeholder}
      readOnly={isDetecting}
      className={isDetecting ? "bg-gray-50 text-gray-400 italic" : ""}
    />
    {isDetecting && (
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        <Loader2 className="h-4 w-4 animate-spin text-gray-300" />
      </div>
    )}
  </div>
);
