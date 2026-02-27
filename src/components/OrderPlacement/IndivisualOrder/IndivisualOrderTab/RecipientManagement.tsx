/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  Loader2,
  MapPin,
  CheckCircle2,
  Navigation,
  Search,
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

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
    __googleMapsLoaded?: boolean;
    __googleMapsCallbacks?: Array<() => void>;
  }
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
const SG_CENTER = { lat: 1.3521, lng: 103.8198 };

// ─── Maps Loader (singleton) ──────────────────────────────────────────────────

function loadGoogleMaps(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Already loaded
    if (window.google?.maps) {
      resolve();
      return;
    }

    // Queue callbacks while loading
    if (!window.__googleMapsCallbacks) {
      window.__googleMapsCallbacks = [];
    }
    window.__googleMapsCallbacks.push(resolve);

    // Only inject once
    if (document.getElementById("gm-script")) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__gmInit = () => {
      window.__googleMapsLoaded = true;
      window.__googleMapsCallbacks?.forEach((cb) => cb());
      window.__googleMapsCallbacks = [];
    };

    const script = document.createElement("script");
    script.id = "gm-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&callback=__gmInit`;
    script.async = true;
    script.defer = true;
    script.onerror = () =>
      reject(new Error("Google Maps script failed to load"));
    document.head.appendChild(script);
  });
}

// ─── Address Helpers ──────────────────────────────────────────────────────────

type AC = { long_name: string; short_name: string; types: string[] };

function getComponent(components: AC[], type: string): string {
  return components.find((c) => c.types.includes(type))?.long_name ?? "";
}

/**
 * Format: "{street_number} {neighborhood/route}, {country}"
 * e.g. "157 Serangoon, Singapore"
 */
function formatAddress(components: AC[], fallback: string): string {
  const num = getComponent(components, "street_number");
  const neighborhood =
    getComponent(components, "neighborhood") ||
    getComponent(components, "sublocality_level_1") ||
    getComponent(components, "sublocality") ||
    getComponent(components, "route") ||
    getComponent(components, "locality");
  const country = getComponent(components, "country");
  const street = [num, neighborhood].filter(Boolean).join(" ");
  return [street, country].filter(Boolean).join(", ") || fallback;
}

function extractPostalCode(components: AC[]): string {
  return getComponent(components, "postal_code");
}

// ─── Geocode Helpers ──────────────────────────────────────────────────────────

interface GeoResult {
  address_components: AC[];
  formatted_address: string;
  geometry: { location: { lat: number; lng: number } };
}

async function geocode(query: string): Promise<GeoResult[]> {
  const r = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${MAPS_KEY}`,
  );
  const d = await r.json();
  return d.status === "OK" ? d.results : [];
}

async function reverseGeocode(lat: number, lng: number): Promise<GeoResult[]> {
  const r = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAPS_KEY}`,
  );
  const d = await r.json();
  return d.status === "OK" ? d.results : [];
}

function toResolved(results: GeoResult[]): ResolvedAddress | null {
  if (!results.length) return null;
  const r = results[0];
  return {
    lat: r.geometry.location.lat,
    lng: r.geometry.location.lng,
    postal_code: extractPostalCode(r.address_components),
    address: formatAddress(r.address_components, r.formatted_address),
  };
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

  // Keep map, marker, listener in refs so they survive re-renders
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clickListenerRef = useRef<any>(null);

  const [postalInput, setPostalInput] = useState("");
  const [pending, setPending] = useState<ResolvedAddress | null>(null);
  const [searching, setSearching] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(0);
  const initialSearchDoneRef = useRef(false);

  // ── On open: reset state and load map ──
  useEffect(() => {
    if (!isOpen) return;

    // Reset
    setPostalInput(initialPostalCode ?? "");
    setPending(null);
    setError(null);
    setMapReady(false);
    initialSearchDoneRef.current = false;

    // Load SDK then init map
    loadGoogleMaps()
      .then(() => setMapReady(true))
      .catch(() => setError("Failed to load Google Maps. Check your API key."));

    return () => {
      // Cleanup map when modal unmounts/closes
      clearTimeout(debounceRef.current);
      if (clickListenerRef.current) {
        window.google?.maps?.event?.removeListener(clickListenerRef.current);
        clickListenerRef.current = null;
      }
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      mapRef.current = null;
    };
  }, [isOpen]);
  

  // ── Init map once SDK is ready AND container div is mounted ──
  useEffect(() => {
    if (!mapReady || !mapContainerRef.current) return;

    const map = new window.google.maps.Map(mapContainerRef.current, {
      center: SG_CENTER,
      zoom: 11,
      disableDefaultUI: false,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      clickableIcons: true,
    });

    mapRef.current = map;

    // Click anywhere on the map → place pin + reverse geocode
    clickListenerRef.current = map.addListener(
      "click",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async (event: any) => {
        const lat: number = event.latLng.lat();
        const lng: number = event.latLng.lng();
        dropPin(lat, lng);
        setSearching(true);
        setError(null);
        try {
          const results = await reverseGeocode(lat, lng);
          const resolved = toResolved(results);
          if (resolved) {
            setPending(resolved);
            setPostalInput(resolved.postal_code || postalInputRef.current);
          } else {
            setError("Couldn't detect address here. Try clicking nearby.");
          }
        } catch {
          setError("Address lookup failed. Please try again.");
        } finally {
          setSearching(false);
        }
      },
    );

    // Auto-search initial postal code once map is ready
    if (
      !initialSearchDoneRef.current &&
      initialPostalCode &&
      initialPostalCode.length >= 3
    ) {
      initialSearchDoneRef.current = true;
      runSearch(initialPostalCode);
    }
  }, [mapReady]);

  // Keep a ref of postalInput for use inside the click closure
  const postalInputRef = useRef(postalInput);
  useEffect(() => {
    postalInputRef.current = postalInput;
  }, [postalInput]);

  // ── Drop / move pin ──
  function dropPin(lat: number, lng: number) {
    if (!mapRef.current) return;
    if (markerRef.current) {
      markerRef.current.setPosition({ lat, lng });
    } else {
      markerRef.current = new window.google.maps.Marker({
        position: { lat, lng },
        map: mapRef.current,
        animation: window.google.maps.Animation.DROP,
        cursor: "pointer",
      });
    }
    mapRef.current.panTo({ lat, lng });
  }

  // ── Search a postal code string ──
  async function runSearch(query: string) {
    if (!query.trim() || query.trim().length < 3) return;
    setSearching(true);
    setError(null);
    try {
      const results = await geocode(query);
      const resolved = toResolved(results);
      if (resolved) {
        setPending(resolved);
        setPostalInput(resolved.postal_code || query);
        dropPin(resolved.lat, resolved.lng);
        // Zoom into the postal code area so user can click precisely
        if (mapRef.current) {
          mapRef.current.setZoom(16);
        }
      } else {
        setPending(null);
        setError("No location found for this postal code.");
      }
    } catch {
      setError("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  }

  const handlePostalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPostalInput(val);
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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div
        className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: "90vh" }}
      >
        {/* ── Header ── */}
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
                Search a postal code, then click the map to pinpoint
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

        {/* ── Search bar ── */}
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
                placeholder="Enter postal code — e.g. 538547"
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
              After searching, click anywhere on the map to pick a precise spot.
            </p>
          )}
        </div>

        {/* ── Map container ── */}
        <div className="relative shrink-0" style={{ height: "380px" }}>
          {/* Loading overlay */}
          {!mapReady && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-gray-100">
              <Loader2 size={28} className="animate-spin text-yellow-400" />
              <p className="text-sm text-gray-500">Loading map…</p>
            </div>
          )}

          {/* The actual Google Map renders here */}
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* "No pin yet" hint */}
          {mapReady && !pending && !searching && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
              <div className="bg-white/95 border border-gray-200 shadow rounded-full px-4 py-2 flex items-center gap-2 text-xs text-gray-500 whitespace-nowrap">
                <MapPin size={12} className="text-yellow-500 shrink-0" />
                Search a postal code, then click the map to select
              </div>
            </div>
          )}

          {/* Searching spinner overlay on map */}
          {searching && (
            <div className="absolute inset-0 bg-white/40 flex items-center justify-center pointer-events-none">
              <div className="bg-white rounded-xl shadow-md px-4 py-3 flex items-center gap-2 text-sm text-gray-600">
                <Loader2 size={16} className="animate-spin text-yellow-500" />
                Finding location…
              </div>
            </div>
          )}
        </div>

        {/* ── Footer: address preview + confirm ── */}
        <div className="px-6 py-4 border-t border-gray-100 shrink-0">
          {pending ? (
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                  Selected Address
                </p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {pending.address}
                </p>
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

// ─── PostalCodeField (read-only with Change/Select button) ───────────────────

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
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          ) : postalCode ? (
            <Navigation className="h-4 w-4 text-yellow-500" />
          ) : null}
        </div>
      </div>
      <button
        type="button"
        onClick={onChangeRequest}
        className="text-sm font-semibold text-yellow-600 hover:text-yellow-700 underline underline-offset-2 shrink-0 transition-colors"
      >
        {postalCode ? "Change" : "Select"}
      </button>
    </div>
    {!isDetecting && address && (
      <p className="text-xs text-gray-500 mt-1 truncate">{address}</p>
    )}
    {!isDetecting && !postalCode && (
      <p className="text-xs text-gray-400 mt-1">
        Click <span className="font-medium text-yellow-600">Select</span> to
        pick on map.
      </p>
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
  // null = closed | "sender" | recipientId
  const [modalTarget, setModalTarget] = useState<string | null>(null);

  // ── Auto-detect sender location on mount ──
  useEffect(() => {
    if (!navigator.geolocation) {
      setIsDetecting(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const results = await reverseGeocode(
            coords.latitude,
            coords.longitude,
          );
          const resolved = toResolved(results);
          if (resolved) {
            const ev = (v: string) =>
              ({ target: { value: v } }) as React.ChangeEvent<HTMLInputElement>;
            handleSenderInputChange(ev(resolved.postal_code), "postal_code");
            handleSenderInputChange(ev(resolved.address), "address");
          }
        } catch {
          /* ignore */
        } finally {
          setIsDetecting(false);
        }
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
        handleRecipientInputChange(
          ev(resolved.postal_code),
          target,
          "postal_code",
        );
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
          <PostalCodeField
            postalCode={sender.postal_code}
            address={sender.address}
            isDetecting={isDetecting}
            onChangeRequest={() => setModalTarget("sender")}
          />
          <div>
            <Label className="mb-2">Address</Label>
            <Input
              value={sender.address}
              onChange={(e) => handleSenderInputChange(e, "address")}
              placeholder="Auto-filled from map"
              required
            />
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

      {/* ── Map Modal (keyed so it fully remounts each open) ── */}
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
