/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Camera, Upload, X, ArrowLeft, Star, Medal, Wifi, Loader2, MapPin, CheckCircle2, Navigation, Search, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetRiderProfileByIdQuery,
  useUpdateRiderProfileMutation,
  useUploadImageMutation,
} from "@/redux/features/drivers/driversApi";
import { useNavigate, useParams } from "react-router-dom";
import { useGetVehicleTypesQuery } from "@/redux/features/vehicleType/vehicleTypeApi";

// --- START: Component Interfaces ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const Button = ({ children, className = "", ...props }: ButtonProps) => (
  <button
    className={`px-4 py-2 rounded font-medium transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = ({ className = "", ...props }: InputProps) => (
  <input
    className={`w-full border rounded px-3 py-2 bg-secondary focus:outline-none focus:border-yellow-400 ${className}`}
    {...props}
  />
);

interface LabelProps {
  children: React.ReactNode;
  className?: string;
}

const Label = ({ children, className = "" }: LabelProps) => (
  <label className={`block text-sm font-semibold mb-2 ${className}`}>
    {children}
  </label>
);

interface UploadBoxProps {
  label: string;
  onChange: (file: File | null) => void;
  error?: string | null;
  isUploading?: boolean;
  currentPreviewUrl?: string | null;
  buttonText?: string;
}

const UploadBox = ({
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
      const isRemotePdf = currentPreviewUrl.toLowerCase().split('?')[0].endsWith(".pdf");
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

// ─── Constants ────────────────────────────────────────────────────────────────

const SG_CENTER: [number, number] = [1.3521, 103.8198];
const ONEMAP_SEARCH = "https://www.onemap.gov.sg/api/common/elastic/search";
const ONEMAP_REVERSE = "https://www.onemap.gov.sg/api/public/revgeocode";

// ─── Leaflet Loader (singleton) ───────────────────────────────────────────────

function loadLeaflet(): Promise<void> {
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

// ─── OneMap API Helpers ───────────────────────────────────────────────────────

interface OneMapResult {
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

interface ResolvedAddress {
  postal_code: string;
  address: string;
  lat: number;
  lng: number;
}

interface AddressSuggestion {
  label: string;
  building: string;
  road: string;
  postal_code: string;
  lat: number;
  lng: number;
}

function formatOneMapAddress(r: OneMapResult): string {
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

function formatOneMapAddressLine(r: OneMapResult): string {
  return formatOneMapAddress(r).replace(/\n/g, ", ");
}

async function fetchOneMapPage(query: string, page: number): Promise<{ results: OneMapResult[]; totalNumPages: number }> {
  const url = `${ONEMAP_SEARCH}?searchVal=${encodeURIComponent(query)}&returnGeom=Y&getAddrDetails=Y&pageNum=${page}`;
  const res = await fetch(url);
  if (!res.ok) return { results: [], totalNumPages: 1 };
  const data = await res.json();
  return {
    results: data.results ?? [],
    totalNumPages: data.totalNumPages ?? 1,
  };
}

async function searchOneMap(query: string): Promise<OneMapResult[]> {
  const first = await fetchOneMapPage(query, 1);
  if (first.totalNumPages <= 1) return first.results;
  const extraPages = Math.min(first.totalNumPages - 1, 5);
  const rest = await Promise.all(
    Array.from({ length: extraPages }, (_, i) => fetchOneMapPage(query, i + 2)),
  );
  return [first.results, ...rest.map((p) => p.results)].flat();
}

async function reverseOneMap(lat: number, lng: number): Promise<OneMapResult | null> {
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

function toSuggestions(results: OneMapResult[]): AddressSuggestion[] {
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

// ─── Interactive Map Modal ────────────────────────────────────────────────────

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (resolved: ResolvedAddress) => void;
  initialPostalCode?: string;
}

const MapModal: React.FC<MapModalProps> = ({
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

    // Ensure map renders correctly by recalculating its size after a short delay
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

// ─── PostalCodeField ──────────────────────────────────────────────────────────

const PostalCodeField: React.FC<{
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

// ─── DetectingAddressInput ────────────────────────────────────────────────────

const DetectingAddressInput: React.FC<{
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
      className={isDetecting ? "pr-10 bg-gray-50 cursor-not-allowed text-gray-400" : ""}
      required={!isDetecting}
    />
    {isDetecting && (
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
      </div>
    )}
  </div>
);

// --- Phone Input ---
interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: any;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

const COUNTRY_CODES = [
  { code: "+65", label: "🇸🇬 +65", country: "SG" },
  { code: "+60", label: "🇲🇾 +60", country: "MY" },
  { code: "+91", label: "🇮🇳 +91", country: "IN" },
];

const PhoneInput = ({
  value,
  onChange,
  onBlur,
  placeholder = "XXXX XXXX",
  error,
  disabled,
}: PhoneInputProps) => {
  const selectedCountry = COUNTRY_CODES.find(c => value.startsWith(c.code)) || COUNTRY_CODES[0];
  const localValue = value.startsWith(selectedCountry.code)
    ? value.slice(selectedCountry.code.length).trimStart()
    : value;

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value;
    onChange(`${newCode}${localValue ? " " + localValue : ""}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9\s]/g, "");
    onChange(`${selectedCountry.code}${raw ? " " + raw : ""}`);
  };

  return (
    <div>
      <div className={`flex items-center w-full border rounded bg-[#FFFAE6] focus-within:border-yellow-400 overflow-hidden ${error ? "border-red-400" : "border-gray-300"}`}>
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

// --- Constants ---
const LICENSE_CLASSES = [
  "Class 2B",
  "Class 2A",
  "Class 2",
  "Class 3",
  "Class 3A",
  "Class 4",
  "Class 5",
];

const COUNTRIES = [
  "Singapore",
  "Malaysia",
  "India",
  "Bangladesh",
  "Indonesia",
  "Thailand",
  "Vietnam",
];

const RANKS = ["BRONZE", "SILVER", "GOLD", "PLATINUM", "PREMIUM"];

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-6 mt-10">
    {children}
  </h2>
);

const InputWrapper = ({
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

// --- Main Component ---
export default function EditDriverProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [uploadImage] = useUploadImageMutation();
  const [addRiderProfile, { isLoading: isUpdating }] = useUpdateRiderProfileMutation();
  const { data: vehicleTypesResponse } = useGetVehicleTypesQuery({});
  const { data: driverResponse, isLoading: isFetching } = useGetRiderProfileByIdQuery(Number(id), { skip: !id });
console.log("check driver data", driverResponse);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profileImageUrls, setProfileImageUrls] = useState<string[]>([]);
  const [isProfileUploading, setIsProfileUploading] = useState(false);

  const [modalTarget, setModalTarget] = useState<string | null>(null);

  type DocumentKey =
    | "nricFront"
    | "nricBack"
    | "licenseFront"
    | "licenseBack"
    | "vehicleFront"
    | "vehicleRear"
    | "driverSide"
    | "passengerSide"
    | "vehicleLog"
    | "insurancePolicy";

  const [documentUrls, setDocumentUrls] = useState<Record<DocumentKey, string>>({
    nricFront: "",
    nricBack: "",
    licenseFront: "",
    licenseBack: "",
    vehicleFront: "",
    vehicleRear: "",
    driverSide: "",
    passengerSide: "",
    vehicleLog: "",
    insurancePolicy: "",
  });

  const [uploadingDocs, setUploadingDocs] = useState<Set<DocumentKey>>(new Set());
  const [documentErrors, setDocumentErrors] = useState<Record<DocumentKey, string | null>>({
    nricFront: null, nricBack: null, licenseFront: null, licenseBack: null,
    vehicleFront: null, vehicleRear: null, driverSide: null, passengerSide: null,
    vehicleLog: null, insurancePolicy: null
  });

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    mode: "onSubmit",
    defaultValues: {
      raider_name: "", email_address: "", password: "", contact_number: "+65",
      dob: "", gender: "", emergency_contact_name: "", emergency_contact_number: "+65",
      identity_card_number: "", identity_card_issue_date: "",
      driving_license_number: "", driving_license_issue_date: "", driving_license_expire_date: "",
      license_class: "", vehicle_plate_number: "", vehicle_type_id: "",
      vehicle_brand: "", vehicle_model: "", registration_date: "", chassis_number: "",
      insurance_policy_number: "", insurance_issue_date: "", insurance_expiry_date: "",
      current_postal_code: "", current_address: "", current_unit: "", current_country: "Singapore",
      permanent_postal_code: "", permanent_address: "", permanent_unit: "", permanent_country: "Singapore",
      bank_name: "", account_number: "", driver_rank: "",
    },
  });

  // Populate data
  useEffect(() => {
    if (driverResponse?.data) {
      const reg = driverResponse.data.registrations?.[0] || driverResponse.data;
      if (!reg) return;

      const formatDate = (iso: string) => (iso ? iso.split("T")[0] : "");

      reset({
        raider_name: reg.raider_name || "",
        email_address: reg.email_address || "",
        password: "", // Usually not returned
        contact_number: reg.contact_number || "+65",
        dob: formatDate(reg.dob),
        gender: reg.gender === "MALE" ? "Male" : reg.gender === "FEMALE" ? "Female" : reg.gender === "OTHER" ? "Other" : "",
        emergency_contact_name: reg.emergency_contact_name || "",
        emergency_contact_number: reg.emergency_contact_number || "+65",
        identity_card_number: reg.identity_card_number || "",
        identity_card_issue_date: formatDate(reg.identity_card_issue_date),
        driving_license_number: reg.driving_license_number || "",
        driving_license_issue_date: formatDate(reg.driving_license_issue_date),
        driving_license_expire_date: formatDate(reg.driving_license_expire_date),
        license_class: LICENSE_CLASSES.find(lc => lc.toUpperCase().replace(/\s+/g, "_") === reg.license_class) || (reg.license_class || "").replace(/_/g, " "),
        vehicle_plate_number: reg.vehicle_plate_number || "",
        vehicle_type_id: String(reg.vehicle_type_id || ""),
        vehicle_brand: reg.vehicle_brand || "",
        vehicle_model: reg.vehicle_model || "",
        registration_date: formatDate(reg.registration_date),
        chassis_number: reg.chassis_number || "",
        insurance_policy_number: reg.insurance_policy_number || "",
        insurance_issue_date: formatDate(reg.insurance_issue_date),
        insurance_expiry_date: formatDate(reg.insurance_expiry_date),
        current_postal_code: reg.current_postal_code || "",
        current_address: reg.current_address || "",
        current_unit: reg.current_unit || "",
        current_country: reg.current_country || "Singapore",
        permanent_postal_code: reg.permanent_postal_code || "",
        permanent_address: reg.permanent_address || "",
        permanent_unit: reg.permanent_unit || "",
        permanent_country: reg.permanent_country || "Singapore",
        bank_name: reg.bank_name || "",
        account_number: reg.account_number || "",
        driver_rank: driverResponse.data.rank || "",
      });

      if (reg.driver_photos?.[0]) setProfileImageUrls([reg.driver_photos[0]]);
      setDocumentUrls({
        nricFront: reg.nric_front_images || "",
        nricBack: reg.nric_back_images || "",
        licenseFront: reg.driving_license_front_images || "",
        licenseBack: reg.driving_license_back_images || "",
        vehicleFront: reg.vehicle_front_images || "",
        vehicleRear: reg.vehicle_back_images || "",
        driverSide: reg.vehicle_driver_side_images || "",
        passengerSide: reg.vehicle_passenger_side_images || "",
        vehicleLog: reg.vehicle_log_images || "",
        insurancePolicy: reg.insurance_policy_images || "",
      });
    }
  }, [driverResponse, reset]);

  const handleProfileImageChange = (file: File | null) => {
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
      handleImageUpload([file]);
    }
  };

  const handleImageUpload = async (files: File[]) => {
    setIsProfileUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      const response = await uploadImage(formData).unwrap();
      setProfileImageUrls(response.data);
    } catch (error: any) {
      toast.error("Failed to upload profile image.");
    } finally {
      setIsProfileUploading(false);
    }
  };

  const handleDocumentChange = async (key: DocumentKey, file: File | null) => {
    if (!file) {
      setDocumentUrls((prev) => ({ ...prev, [key]: "" }));
      setUploadingDocs((prev) => { const s = new Set(prev); s.delete(key); return s; });
      setDocumentErrors((prev) => ({ ...prev, [key]: "This document is required" }));
      return;
    }
    try {
      setUploadingDocs((prev) => new Set(prev).add(key));
      const formData = new FormData();
      formData.append("images", file);
      const response = await uploadImage(formData).unwrap();
      setDocumentUrls((prev) => ({ ...prev, [key]: response.data[0] }));
      setDocumentErrors((prev) => ({ ...prev, [key]: null }));
    } catch (error: any) {
      toast.error(`Failed to upload document`);
      setDocumentUrls((prev) => ({ ...prev, [key]: "" }));
      setDocumentErrors((prev) => ({ ...prev, [key]: `Failed to upload ${key}` }));
    } finally {
      setUploadingDocs((prev) => { const s = new Set(prev); s.delete(key); return s; });
    }
  };

  const validateDocuments = () => {
    const errs: any = {};
    const docs: DocumentKey[] = ["nricFront", "nricBack", "licenseFront", "licenseBack", "vehicleFront", "vehicleRear", "driverSide", "passengerSide", "vehicleLog", "insurancePolicy"];
    docs.forEach(doc => { if (!documentUrls[doc]) errs[doc] = "Document is required"; });
    setDocumentErrors(errs);
    return Object.values(errs).every(v => v === null);
  };

  const formatDateToISO = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "" : date.toISOString();
  };

  const mapGender = (gender: string) => {
    const map: any = { Male: "MALE", Female: "FEMALE", Other: "OTHER" };
    return map[gender] || gender;
  };

  const handleModalConfirm = useCallback(
    (resolved: ResolvedAddress, target: string) => {
      if (target === "current") {
        setValue("current_postal_code", resolved.postal_code);
        setValue("current_address", resolved.address);
      } else {
        setValue("permanent_postal_code", resolved.postal_code);
        setValue("permanent_address", resolved.address);
      }
    },
    [setValue],
  );

  const onSubmit = async (data: any) => {
    if (!profileImageUrls.length) { toast.error("Profile photo is required!"); return; }
    if (!validateDocuments()) { toast.error("Please upload all required documents!"); return; }
    if (uploadingDocs.size > 0) { toast.error("Please wait for images to finish uploading!"); return; }

    try {
      const formData = {
        raider_name: data.raider_name,
        contact_number: data.contact_number,
        email_address: data.email_address,
        dob: formatDateToISO(data.dob),
        gender: mapGender(data.gender),
        driver_photos: profileImageUrls,
        emergency_contact_name: data.emergency_contact_name,
        emergency_contact_number: data.emergency_contact_number,
        identity_card_number: data.identity_card_number,
        identity_card_issue_date: formatDateToISO(data.identity_card_issue_date),
        nric_front_images: documentUrls.nricFront,
        nric_back_images: documentUrls.nricBack,
        driving_license_number: data.driving_license_number,
        driving_license_issue_date: formatDateToISO(data.driving_license_issue_date),
        driving_license_expire_date: formatDateToISO(data.driving_license_expire_date),
        license_class: data.license_class.toUpperCase().replace(/\s+/g, "_"),
        driving_license_front_images: documentUrls.licenseFront,
        driving_license_back_images: documentUrls.licenseBack,
        vehicle_plate_number: data.vehicle_plate_number,
        vehicle_type_id: Number(data.vehicle_type_id),
        vehicle_brand: data.vehicle_brand,
        vehicle_model: data.vehicle_model,
        registration_date: formatDateToISO(data.registration_date),
        vehicle_front_images: documentUrls.vehicleFront,
        vehicle_back_images: documentUrls.vehicleRear,
        vehicle_driver_side_images: documentUrls.driverSide,
        vehicle_passenger_side_images: documentUrls.passengerSide,
        chassis_number: data.chassis_number,
        vehicle_log_images: documentUrls.vehicleLog,
        insurance_policy_number: data.insurance_policy_number,
        insurance_issue_date: formatDateToISO(data.insurance_issue_date),
        insurance_expiry_date: formatDateToISO(data.insurance_expiry_date),
        insurance_policy_images: documentUrls.insurancePolicy,
        current_postal_code: data.current_postal_code,
        current_address: data.current_address,
        current_unit: data.current_unit,
        current_country: data.current_country,
        permanent_postal_code: data.permanent_postal_code,
        permanent_address: data.permanent_address,
        permanent_unit: data.permanent_unit,
        permanent_country: data.permanent_country,
        bank_name: data.bank_name,
        account_number: data.account_number,
        driver_rank: data.driver_rank,
      };

      await addRiderProfile({ id: Number(id), data: formData }).unwrap();
      toast.success("Driver profile updated successfully!");
      navigate("/driver-list");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

console.log("driverResponse", driverResponse )
  if (isFetching) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="px-8 sm:p-6 mx-auto space-y-6 bg-[#F5F7FA]">
      <style dangerouslySetInnerHTML={{ __html: `
        input[type="date"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          filter: invert(72%) sepia(98%) saturate(1450%) hue-rotate(352deg) brightness(101%) contrast(98%);
        }
      ` }} />
      <h1 onClick={() => navigate("/driver-list")} className="flex items-center gap-2 cursor-pointer text-2xl font-semibold text-gray-900">
        <ArrowLeft /> Back to Driver List
      </h1>
      <div className="border rounded-xl py-10 px-6 lg:px-32 bg-white shadow-sm relative">
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <label className="cursor-pointer">
              <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center border overflow-hidden relative group">
                {profilePreview || profileImageUrls[0] ? (
                  <img src={profilePreview || profileImageUrls[0]} alt="Profile" className="w-full h-full object-cover" />
                ) : isProfileUploading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500" />
                ) : (
                  <Camera size={32} className="text-gray-500" />
                )}
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleProfileImageChange(e.target.files?.[0] || null)} />
            </label>
          </div>
          <p className="text-xs font-semibold mt-2">Profile Photo*</p>
        </div>

        {/* PROFILE INFO / STATS */}
        <div className="text-center mt-4">
          <div className="flex justify-center items-center gap-6 text-sm font-medium">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#FFFAE6] rounded-full border border-yellow-200">
              <Star className="text-yellow-500 fill-yellow-500" size={18} />
              <span className="text-gray-800 font-semibold">{driverResponse?.data?.formattedAverage ?? 0} / 5</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#F0F7FF] rounded-full border border-blue-200">
              <Medal className="text-blue-500" size={18} />
              <span className="text-gray-800 font-semibold">{driverResponse?.data?.rank || "NO RANK"}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#F6FFF6] rounded-full border border-green-200">
              <Wifi className="text-green-500" size={18} />
              <span className="text-gray-800 font-semibold">{driverResponse?.data?.completed_orders || 0} Followers</span>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <SectionTitle>General Information</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputWrapper label="Driver Name*" error={errors.raider_name?.message}><Input {...register("raider_name", { required: "Driver Name is required" })} /></InputWrapper>
            <InputWrapper label="Email Address*" error={errors.email_address?.message}>
              <Input {...register("email_address", { required: "Email is required", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email" } })} />
            </InputWrapper>
            <InputWrapper label="Contact Number*" error={errors.contact_number?.message}>
              <PhoneInput value={watch("contact_number")} onChange={(v) => setValue("contact_number", v, { shouldValidate: true })} />
              <input type="hidden" {...register("contact_number", { required: "Required" })} />
            </InputWrapper>
            <InputWrapper label="Date of Birth*" error={errors.dob?.message}><Input type="date" {...register("dob", { required: "Required" })} /></InputWrapper>
            <InputWrapper label="Select Gender*" error={errors.gender?.message}>
              <select {...register("gender", { required: "Required" })} className="w-full border bg-secondary rounded p-2 text-sm">
                <option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
              </select>
            </InputWrapper>
            <InputWrapper label="Emergency Contact Name*" error={errors.emergency_contact_name?.message}><Input {...register("emergency_contact_name", { required: "Required" })} /></InputWrapper>
            <InputWrapper label="Emergency Contact Number*" error={errors.emergency_contact_number?.message}>
              <PhoneInput value={watch("emergency_contact_number")} onChange={(v) => setValue("emergency_contact_number", v, { shouldValidate: true })} />
              <input type="hidden" {...register("emergency_contact_number", { required: "Required" })} />
            </InputWrapper>
            <InputWrapper label="Driver Rank" error={errors.driver_rank?.message}>
              <select {...register("driver_rank")} className="w-full border bg-secondary rounded p-2 text-sm">
                <option value="">Select Rank</option>{RANKS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </InputWrapper>
          </div>

          <SectionTitle>Identity Card</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputWrapper label="NRIC Number*" error={errors.identity_card_number?.message}><Input {...register("identity_card_number", { required: "Required" })} /></InputWrapper>
            <InputWrapper label="Issue Date*" error={errors.identity_card_issue_date?.message}><Input type="date" {...register("identity_card_issue_date", { required: "Required" })} /></InputWrapper>
          </div>

          <SectionTitle>Driving License</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputWrapper label="Driving License Number*" error={errors.driving_license_number?.message}><Input {...register("driving_license_number", { required: "Required" })} /></InputWrapper>
            <InputWrapper label="Issue Date*" error={errors.driving_license_issue_date?.message}><Input type="date" {...register("driving_license_issue_date", { required: "Required" })} /></InputWrapper>
            <InputWrapper label="Expiry Date*" error={errors.driving_license_expire_date?.message}><Input type="date" {...register("driving_license_expire_date", { required: "Required" })} /></InputWrapper>
            <InputWrapper label="License Class*" error={errors.license_class?.message}>
              <select {...register("license_class", { required: "Required" })} className="w-full border bg-secondary rounded p-2 text-sm">
                <option value="">Select Class</option>{LICENSE_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </InputWrapper>
          </div>

          <SectionTitle>Vehicle Details</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputWrapper label="Vehicle Plate Number*" error={errors.vehicle_plate_number?.message}><Input {...register("vehicle_plate_number", { required: "Required" })} /></InputWrapper>
            <InputWrapper label="Vehicle Type*" error={errors.vehicle_type_id?.message}>
              <select {...register("vehicle_type_id", { required: "Required" })} className="w-full border bg-secondary rounded p-2 text-sm">
                <option value="">Select Type</option>{vehicleTypesResponse?.data?.data?.map((v: any) => <option key={v.id} value={String(v.id)}>{v.vehicle_name}</option>)}
              </select>
            </InputWrapper>
            <InputWrapper label="Vehicle Brand*" error={errors.vehicle_brand?.message}><Input {...register("vehicle_brand", { required: "Required" })} /></InputWrapper>
            <InputWrapper label="Vehicle Model*" error={errors.vehicle_model?.message}><Input {...register("vehicle_model", { required: "Required" })} /></InputWrapper>
            <InputWrapper label="Registration Date*" error={errors.registration_date?.message}><Input type="date" {...register("registration_date", { required: "Required" })} /></InputWrapper>
            <InputWrapper label="Chassis Number*" error={errors.chassis_number?.message}><Input {...register("chassis_number", { required: "Required" })} /></InputWrapper>
          </div>

          <SectionTitle>Vehicle Insurance Policy</SectionTitle>          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputWrapper label="Insurance Policy Number*" error={errors.insurance_policy_number?.message}><Input {...register("insurance_policy_number", { required: "Required" })} /></InputWrapper>
            <InputWrapper label="Issue Date*" error={errors.insurance_issue_date?.message}><Input type="date" {...register("insurance_issue_date", { required: "Required" })} /></InputWrapper>
            <InputWrapper label="Expiry Date*" error={errors.insurance_expiry_date?.message}><Input type="date" {...register("insurance_expiry_date", { required: "Required" })} /></InputWrapper>
          </div>

          <SectionTitle>Current Address</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <PostalCodeField
              postalCode={watch("current_postal_code")}
              address={watch("current_address")}
              onChangeRequest={() => setModalTarget("current")}
            />
            <InputWrapper label="Address*" error={errors.current_address?.message}>
              <DetectingAddressInput
                value={watch("current_address")}
                isDetecting={false}
                onChange={(e) => setValue("current_address", e.target.value)}
                placeholder="Auto-filled from map"
              />
            </InputWrapper>
            <InputWrapper label="Apartment, Suite, Unit, Building, Floor, etc." error={errors.current_unit?.message}><Input {...register("current_unit")} /></InputWrapper>
            <InputWrapper label="Country" error={errors.current_country?.message}>
              <select {...register("current_country")} className="w-full border bg-secondary rounded p-2 text-sm">
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </InputWrapper>
          </div>

          <SectionTitle>Permanent Address</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <PostalCodeField
              postalCode={watch("permanent_postal_code")}
              address={watch("permanent_address")}
              onChangeRequest={() => setModalTarget("permanent")}
            />
            <InputWrapper label="Address*" error={errors.permanent_address?.message}>
              <DetectingAddressInput
                value={watch("permanent_address")}
                isDetecting={false}
                onChange={(e) => setValue("permanent_address", e.target.value)}
                placeholder="Auto-filled from map"
              />
            </InputWrapper>
            <InputWrapper label="Apartment, Suite, Unit, Building, Floor, etc." error={errors.permanent_unit?.message}><Input {...register("permanent_unit")} /></InputWrapper>
            <InputWrapper label="Country" error={errors.permanent_country?.message}>
              <select {...register("permanent_country")} className="w-full border bg-secondary rounded p-2 text-sm">
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </InputWrapper>
          </div>

          <SectionTitle>Bank Details</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputWrapper label="Bank Name"><Input {...register("bank_name")} /></InputWrapper>
            <InputWrapper label="Account Number"><Input {...register("account_number")} /></InputWrapper>
          </div>

          <div className="mt-10 space-y-10">
            <div><SectionTitle>Identity Card Documents*</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <UploadBox label="NRIC Front*" onChange={f => handleDocumentChange("nricFront", f)} currentPreviewUrl={documentUrls.nricFront} error={documentErrors.nricFront} isUploading={uploadingDocs.has("nricFront")} />
                <UploadBox label="NRIC Back*" onChange={f => handleDocumentChange("nricBack", f)} currentPreviewUrl={documentUrls.nricBack} error={documentErrors.nricBack} isUploading={uploadingDocs.has("nricBack")} />
              </div>
            </div>
            <div><SectionTitle>Driving License Documents*</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <UploadBox label="Front Side of Driving License*" onChange={f => handleDocumentChange("licenseFront", f)} currentPreviewUrl={documentUrls.licenseFront} error={documentErrors.licenseFront} isUploading={uploadingDocs.has("licenseFront")} />
                <UploadBox label="Back Side of Driving License*" onChange={f => handleDocumentChange("licenseBack", f)} currentPreviewUrl={documentUrls.licenseBack} error={documentErrors.licenseBack} isUploading={uploadingDocs.has("licenseBack")} />
              </div>
            </div>
            <div><SectionTitle>Vehicle Photos*</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <UploadBox label="Front View of Vehicle*" onChange={f => handleDocumentChange("vehicleFront", f)} currentPreviewUrl={documentUrls.vehicleFront} error={documentErrors.vehicleFront} isUploading={uploadingDocs.has("vehicleFront")} />
                <UploadBox label="Rear View of Vehicle*" onChange={f => handleDocumentChange("vehicleRear", f)} currentPreviewUrl={documentUrls.vehicleRear} error={documentErrors.vehicleRear} isUploading={uploadingDocs.has("vehicleRear")} />
                <UploadBox label="Driver Side View*" onChange={f => handleDocumentChange("driverSide", f)} currentPreviewUrl={documentUrls.driverSide} error={documentErrors.driverSide} isUploading={uploadingDocs.has("driverSide")} />
                <UploadBox label="Passenger Side View*" onChange={f => handleDocumentChange("passengerSide", f)} currentPreviewUrl={documentUrls.passengerSide} error={documentErrors.passengerSide} isUploading={uploadingDocs.has("passengerSide")} />
              </div>
            </div>
            <div><SectionTitle>Vehicle Documents*</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <UploadBox label="Vehicle Log Card*" onChange={f => handleDocumentChange("vehicleLog", f)} currentPreviewUrl={documentUrls.vehicleLog} error={documentErrors.vehicleLog} isUploading={uploadingDocs.has("vehicleLog")} buttonText="Upload" />
                <UploadBox label="Insurance Policy*" onChange={f => handleDocumentChange("insurancePolicy", f)} currentPreviewUrl={documentUrls.insurancePolicy} error={documentErrors.insurancePolicy} isUploading={uploadingDocs.has("insurancePolicy")} buttonText="Upload" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-10 py-3 text-lg rounded-lg" onClick={handleSubmit(onSubmit)} disabled={isUpdating || uploadingDocs.size > 0}>
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
        <MapModal
          isOpen={!!modalTarget}
          onClose={() => setModalTarget(null)}
          onConfirm={(resolved) => handleModalConfirm(resolved, modalTarget!)}
          initialPostalCode={
            modalTarget === "current"
              ? watch("current_postal_code")
              : watch("permanent_postal_code")
          }
        />
      </div>
    </div>
  );
}