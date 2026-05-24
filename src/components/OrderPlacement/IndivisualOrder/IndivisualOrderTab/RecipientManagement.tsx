/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  Loader2,
  MapPin,
  CheckCircle2,
  Navigation,
  Search,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

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
    field: string,
  ) => void;
  handleRecipientInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    recipientId: string,
    field: string,
  ) => void;
  addRecipient: () => void;
  removeRecipient: (recipientId: string) => void;
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

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    L: any;
    __leafletLoaded?: boolean;
    __leafletCallbacks?: Array<() => void>;
  }
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SG_CENTER: [number, number] = [1.3521, 103.8198];
const ONEMAP_SEARCH = "https://www.onemap.gov.sg/api/common/elastic/search";
const ONEMAP_REVERSE = "https://www.onemap.gov.sg/api/public/revgeocode";

// ─── Leaflet Loader (singleton) ───────────────────────────────────────────────

function loadLeaflet(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.L) { resolve(); return; }
    if (!window.__leafletCallbacks) window.__leafletCallbacks = [];
    window.__leafletCallbacks.push(resolve);
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
      window.__leafletLoaded = true;
      window.__leafletCallbacks?.forEach((cb) => cb());
      window.__leafletCallbacks = [];
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
    .filter((r) => r.POSTAL && r.POSTAL !== "NIL" && r.LATITUDE && r.LONGITUDE)
    .map((r) => {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);

  const [postalInput, setPostalInput] = useState("");
  const [pending, setPending] = useState<ResolvedAddress | null>(null);
  const [searching, setSearching] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(0);
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
  }, [isOpen]);

  useEffect(() => {
    if (!mapReady || !mapContainerRef.current || mapRef.current) return;

    const L = window.L;

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
  }, [mapReady]);

  function dropPin(lat: number, lng: number) {
    const L = window.L;
    if (!mapRef.current) return;
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
    }
    mapRef.current.panTo([lat, lng]);
  }

  async function runSearch(query: string) {
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
  }

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
              <Button
                type="button"
                onClick={() => {
                  onConfirm(pending);
                  onClose();
                }}
                className="shrink-0 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-sm"
              >
                <CheckCircle2 size={16} />
                Confirm
              </Button>
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
  isDetecting: boolean;
  onChangeRequest: () => void;
}> = ({ postalCode, address, isDetecting, onChangeRequest }) => (
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
    {isDetecting && (
      <p className="text-xs text-yellow-600 mt-1 flex items-center gap-1">
        <Loader2 size={10} className="animate-spin" />
        Auto-detecting your current location…
      </p>
    )}
    {!isDetecting && !postalCode && (
      <p className="text-xs text-gray-400 mt-1">
        Click <span className="font-medium text-yellow-600">Select</span> to
        pick on map.
      </p>
    )}
  </div>
);

// ─── DetectingAddressInput ────────────────────────────────────────────────────
// Address input with built-in detecting state overlay for sender

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

// ─── Main Component ───────────────────────────────────────────────────────────

const RecipientManagement: React.FC<RecipientManagementProps> = ({
  sender,
  recipients,
  handleSenderInputChange,
  handleRecipientInputChange,
  addRecipient,
  removeRecipient,
}) => {
  const [isDetecting, setIsDetecting] = useState(true);
  const [modalTarget, setModalTarget] = useState<string | null>(null);

  // ── Geolocation on mount (reverse via OneMap) ──
  useEffect(() => {
    if (!navigator.geolocation) { setIsDetecting(false); return; }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const result = await reverseOneMap(coords.latitude, coords.longitude);
          if (result) {
            const address = formatOneMapAddressLine(result);
            const ev = (v: string) =>
              ({ target: { value: v } }) as React.ChangeEvent<HTMLInputElement>;
            handleSenderInputChange(ev(result.POSTAL), "postal_code");
            handleSenderInputChange(ev(address), "address");
          }
        } catch { /* ignore */ }
        finally { setIsDetecting(false); }
      },
      () => setIsDetecting(false),
      { timeout: 8000 },
    );
  }, []);

  const handleModalConfirm = useCallback(
    (resolved: ResolvedAddress, target: string) => {
      const ev = (v: string) =>
        ({ target: { value: v } }) as React.ChangeEvent<HTMLInputElement>;
      if (target === "sender") {
        handleSenderInputChange(ev(resolved.postal_code), "postal_code");
        handleSenderInputChange(ev(resolved.address), "address");
      } else {
        handleRecipientInputChange(ev(resolved.postal_code), target, "postal_code");
        handleRecipientInputChange(ev(resolved.address), target, "address");
      }
    },
    [handleSenderInputChange, handleRecipientInputChange],
  );

  const currentModalPostal =
    modalTarget === "sender"
      ? sender.postal_code
      : (recipients.find((r) => r.id === modalTarget)?.postal_code ?? "");

  return (
    <>
      {/* ── Sender Info ── */}
      <div className="bg-white rounded-lg p-8 border border-gray-200 mb-6">
        <h3 className="text-lg font-medium mb-4">Sender Info</h3>
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div>
            <Label className="mb-2">Name</Label>
            <Input
              type="name"
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

        {/* ── Postal + Address + Floor row ── */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Postal Code — shows spinner + "detecting" while locating */}
          <PostalCodeField
            postalCode={sender.postal_code}
            address={sender.address}
            isDetecting={isDetecting}
            onChangeRequest={() => setModalTarget("sender")}
          />

          {/* Address — also shows detecting state */}
          <div>
            <Label className="mb-2">Address</Label>
            <DetectingAddressInput
              value={sender.address}
              isDetecting={isDetecting}
              onChange={(e) => handleSenderInputChange(e, "address")}
              placeholder="Auto-filled from map"
            />
            {isDetecting && (
              <p className="text-xs text-yellow-600 mt-1 flex items-center gap-1">
                <Loader2 size={10} className="animate-spin" />
                Fetching address…
              </p>
            )}
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

      {/* ── Recipients ── */}
      {recipients.map((recipient, index) => (
        <div
          key={recipient.id}
          className="bg-white rounded-lg p-8 border border-gray-200 mb-6 relative"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Recipient Info {index + 1}</h3>
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
              type="tel"
                value={recipient.contact_number}
                onChange={(e) =>
                  handleRecipientInputChange(e, recipient.id, "contact_number")
                }
                placeholder="Enter Number"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 mb-6">
            <PostalCodeField
              postalCode={recipient.postal_code}
              address={recipient.address}
              isDetecting={false}
              onChangeRequest={() => setModalTarget(recipient.id)}
            />
            <div>
              <Label className="mb-2">Address</Label>
              <Input
                value={recipient.address}
                onChange={(e) =>
                  handleRecipientInputChange(e, recipient.id, "address")
                }
                placeholder="Auto-filled from map"
                required
              />
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
      ))}

      <Button
        type="button"
        onClick={addRecipient}
        className="mb-6 bg-yellow-400 text-lg py-3 font-semibold cursor-pointer mx-auto block text-black hover:bg-yellow-500 rounded-md"
      >
        Add Stop
      </Button>

      {modalTarget !== null && (
        <MapModal
          key={modalTarget}
          isOpen
          onClose={() => setModalTarget(null)}
          onConfirm={(resolved) => handleModalConfirm(resolved, modalTarget)}
          initialPostalCode={currentModalPostal}
        />
      )}
    </>
  );
};

export default RecipientManagement;