/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Camera, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  useAddRiderProfileMutation,
  useUploadImageMutation,
} from "@/redux/features/drivers/driversApi";
import { useNavigate } from "react-router-dom";
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

  const preview = currentPreviewUrl || localFileUrl;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

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

// ─── OneMap API Helpers ───────────────────────────────────────────────────────

const ONEMAP_SEARCH = "https://www.onemap.gov.sg/api/common/elastic/search";

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

interface OneMapSuggestion {
  /** Multi-line display:
   *  Line 1: Building name (if any)
   *  Line 2: Block + Road
   *  Line 3: Singapore XXXXXX
   */
  displayLines: string[];
  /** Single line for list display */
  label: string;
  postal_code: string;
  address: string; // full single-line for form field
}

function formatOneMapResult(r: OneMapResult): OneMapSuggestion {
  const lines: string[] = [];

  const building = r.BUILDING?.trim();
  if (building && building.toUpperCase() !== "NIL" && building !== r.BLK_NO) {
    lines.push(building);
  }

  const street = [r.BLK_NO?.trim(), r.ROAD_NAME?.trim()]
    .filter(Boolean)
    .join(" ");
  if (street) lines.push(street);

  if (r.POSTAL && r.POSTAL !== "NIL") {
    lines.push(`Singapore ${r.POSTAL}`);
  } else {
    lines.push("Singapore");
  }

  return {
    displayLines: lines,
    label: lines.join(", "),
    postal_code: r.POSTAL !== "NIL" ? r.POSTAL : "",
    address: lines.join("\n"),
  };
}

async function fetchOneMapPage(
  query: string,
  page: number,
): Promise<{ results: OneMapResult[]; totalNumPages: number }> {
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
  const extraPages = Math.min(first.totalNumPages - 1, 4);
  const rest = await Promise.all(
    Array.from({ length: extraPages }, (_, i) =>
      fetchOneMapPage(query, i + 2),
    ),
  );
  return [first.results, ...rest.map((p) => p.results)].flat();
}

// ─── Phone Input with +65 prefix ─────────────────────────────────────────────

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

// ─── Constants ─────────────────────────────────────────────────────────────

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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AddNewDriver() {
  const [uploadImage] = useUploadImageMutation();
  const [, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profileImageUrls, setProfileImageUrls] = useState<string[]>([]);
  const [isProfileUploading, setIsProfileUploading] = useState(false);
  const navigate = useNavigate();

  // ── OneMap postal suggestion state ──
  const [isLoadingPostal, setIsLoadingPostal] = useState<string | null>(null);
  const [postalSuggestions, setPostalSuggestions] = useState<{
    [key: string]: OneMapSuggestion[];
  }>({});
  const [showPostalSuggestions, setShowPostalSuggestions] = useState<{
    [key: string]: boolean;
  }>({});
  const debounceTimers = useRef<{ [key: string]: ReturnType<typeof setTimeout> }>({});

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

  type DocumentFileState = Record<DocumentKey, File | null>;
  type DocumentUrlState = Record<DocumentKey, string>;
  type DocumentErrorState = Record<DocumentKey, string | null>;

  const [, setDocuments] = useState<DocumentFileState>({
    nricFront: null,
    nricBack: null,
    licenseFront: null,
    licenseBack: null,
    vehicleFront: null,
    vehicleRear: null,
    driverSide: null,
    passengerSide: null,
    vehicleLog: null,
    insurancePolicy: null,
  });

  const [documentUrls, setDocumentUrls] = useState<DocumentUrlState>({
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

  const [documentErrors, setDocumentErrors] = useState<DocumentErrorState>({
    nricFront: null,
    nricBack: null,
    licenseFront: null,
    licenseBack: null,
    vehicleFront: null,
    vehicleRear: null,
    driverSide: null,
    passengerSide: null,
    vehicleLog: null,
    insurancePolicy: null,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      raider_name: "",
      email_address: "",
      password: "",
      contact_number: "+65",
      dob: "",
      gender: "",
      emergency_contact_name: "",
      emergency_contact_number: "+65",
      identity_card_number: "",
      identity_card_issue_date: "",
      driving_license_number: "",
      driving_license_issue_date: "",
      driving_license_expire_date: "",
      license_class: "",
      vehicle_plate_number: "",
      vehicle_type_id: "",
      vehicle_brand: "",
      vehicle_model: "",
      registration_date: "",
      chassis_number: "",
      insurance_policy_number: "",
      insurance_issue_date: "",
      insurance_expiry_date: "",
      current_postal_code: "",
      current_address: "",
      current_unit: "",
      current_country: "Singapore",
      permanent_postal_code: "",
      permanent_address: "",
      permanent_unit: "",
      permanent_country: "Singapore",
      bank_name: "",
      account_number: "",
      driver_rank: "",
    },
  });

  const [addRiderProfile, { isLoading }] = useAddRiderProfileMutation();
  const { data: vehicleTypesResponse } = useGetVehicleTypesQuery({});

  const handleProfileImageChange = (file: File | null) => {
    setProfileFile(file);
    setProfilePreview(file ? URL.createObjectURL(file) : null);
    if (file) {
      handleImageUpload([file]);
    } else {
      setProfileImageUrls([]);
    }
  };

  const handleImageUpload = async (files: File[]) => {
    if (files.length === 0) { setProfileImageUrls([]); return; }
    setIsProfileUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      const response = await uploadImage(formData).unwrap();
      setProfileImageUrls(response.data);
    } catch (error: any) {
      toast.error("Failed to upload profile image.");
      setProfileFile(null);
      setProfilePreview(null);
      setProfileImageUrls([]);
    } finally {
      setIsProfileUploading(false);
    }
  };

  const handleDocumentUpload = async (key: DocumentKey, file: File | null) => {
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
      toast.error(`Failed to upload ${key}`);
      setDocumentUrls((prev) => ({ ...prev, [key]: "" }));
      setDocuments((prev) => ({ ...prev, [key]: null }));
      setDocumentErrors((prev) => ({ ...prev, [key]: `Failed to upload ${key}` }));
    } finally {
      setUploadingDocs((prev) => { const s = new Set(prev); s.delete(key); return s; });
    }
  };

  const handleDocumentChange = (key: DocumentKey, file: File | null) => {
    handleDocumentUpload(key, file);
  };

  const validateDocuments = () => {
    const errs: DocumentErrorState = {
      nricFront: null,
      nricBack: null,
      licenseFront: null,
      licenseBack: null,
      vehicleFront: null,
      vehicleRear: null,
      driverSide: null,
      passengerSide: null,
      vehicleLog: null,
      insurancePolicy: null,
    };
    const requiredDocs: DocumentKey[] = [
      "nricFront",
      "nricBack",
      "licenseFront",
      "licenseBack",
      "vehicleFront",
      "vehicleRear",
      "driverSide",
      "passengerSide",
      "vehicleLog",
      "insurancePolicy",
    ];
    requiredDocs.forEach((doc) => {
      if (!documentUrls[doc]) errs[doc] = "This document is required";
    });
    setDocumentErrors(errs);
    return Object.values(errs).every((v) => v === null);
  };

  const formatDateToISO = (dateString: string) => {
    if (!dateString || dateString.trim() === "") return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString();
  };

  const mapGender = (gender: string) => {
    const genderMap: { [key: string]: string } = { Male: "MALE", Female: "FEMALE", Other: "OTHER" };
    return genderMap[gender] || gender.toUpperCase();
  };

  // ── OneMap address lookup ──
  const fetchAddressFromPostal = useCallback(
    async (postalCode: string, fieldKey: string) => {
      if (!postalCode || postalCode.trim().length < 3) return;
      setIsLoadingPostal(fieldKey);
      try {
        const results = await searchOneMap(postalCode);
        if (results.length > 0) {
          // Deduplicate by postal+building
          const seen = new Set<string>();
          const suggestions: OneMapSuggestion[] = [];
          for (const r of results) {
            if (!r.POSTAL || r.POSTAL === "NIL") continue;
            const key = `${r.POSTAL}-${r.BUILDING}-${r.BLK_NO}`;
            if (seen.has(key)) continue;
            seen.add(key);
            suggestions.push(formatOneMapResult(r));
          }
          setPostalSuggestions((prev) => ({ ...prev, [fieldKey]: suggestions }));
          setShowPostalSuggestions((prev) => ({ ...prev, [fieldKey]: suggestions.length > 0 }));
        } else {
          setPostalSuggestions((prev) => ({ ...prev, [fieldKey]: [] }));
          setShowPostalSuggestions((prev) => ({ ...prev, [fieldKey]: false }));
        }
      } catch (error) {
        console.error("OneMap error:", error);
      } finally {
        setIsLoadingPostal(null);
      }
    },
    [],
  );

  const onSubmit = async (data: any) => {
    if (uploadingDocs.size > 0) {
      toast.error("Please wait for all images to finish uploading!");
      return;
    }

    // Validate Documents
    const documentsValid = validateDocuments();

    // Validate Profile Photo
    if (!profileImageUrls.length) {
      toast.error("Profile photo is required!");
      return;
    }

    if (!documentsValid) {
      toast.error("Please upload all required documents!");
      return;
    }

    try {
      const formData = {
        raider_name: data.raider_name,
        contact_number: data.contact_number,
        email_address: data.email_address || undefined,
        password: data.password,
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
        driving_license_issue_date: formatDateToISO(
          data.driving_license_issue_date,
        ),
        driving_license_expire_date: formatDateToISO(
          data.driving_license_expire_date,
        ),
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

      const result = await addRiderProfile(formData).unwrap();
      if (!result.success) {
        toast.error(result.message || "Failed to create rider profile");
        return;
      }
      toast.success(result.message || "Rider profile created successfully!");
      navigate("/driver-list");
    } catch (error: any) {
      console.error("API Submission Error:", error);
      toast.error(error?.data?.message || "Failed to create rider profile");
    }
  };

  return (
    <div className="px-8 sm:p-6 mx-auto space-y-6 bg-[#F5F7FA]">
      <style dangerouslySetInnerHTML={{
        __html: `
        input[type="date"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          filter: invert(72%) sepia(98%) saturate(1450%) hue-rotate(352deg) brightness(101%) contrast(98%);
        }
        input[type="date"]::-webkit-calendar-picker-indicator:hover {
          opacity: 0.8;
        }
      ` }} />
      <h1 className="text-2xl font-semibold text-gray-900 pt-2 sm:pt-0">
        Add New Driver
      </h1>
      <div className="border rounded-xl py-10 px-6 lg:px-32 bg-white shadow-sm relative">
        {/* Profile Image */}
        <div className="flex flex-col items-center justify-center">
          <label className="cursor-pointer">
            <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center border overflow-hidden">
              {profilePreview || profileImageUrls[0] ? (
                <img
                  src={profilePreview || profileImageUrls[0]}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : isProfileUploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500" />
              ) : (
                <Camera size={32} className="text-gray-500" />
              )}
            </div>
            <input
              type="file"
              className="hidden"
              id="upload-images"
              accept="image/*"
              onChange={(e) =>
                handleProfileImageChange(e.target.files?.[0] || null)
              }
              disabled={isProfileUploading}
            />
          </label>
          <p className="text-xs font-semibold mt-2">Profile Photo*</p>
        </div>

        <div className="mt-10">
          {/* General Information */}
          <SectionTitle>General Information</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputWrapper label="Driver Name*" error={errors.raider_name?.message}>
              <Input
                {...register("raider_name", { required: "Driver Name is required" })}
              />
            </InputWrapper>
            <InputWrapper
              label="Email Address*"
              error={errors.email_address?.message}
            >
              <Input
                {...register("email_address", {
                  required: "Email Address is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
            </InputWrapper>
            <InputWrapper label="Password" error={errors.password?.message}>
              <Input
                type="password"
                {...register("password")}
              />
            </InputWrapper>
            <InputWrapper label="Contact Number*" error={errors.contact_number?.message}>
              <PhoneInput
                value={watch("contact_number")}
                onChange={(val) => {
                  setValue("contact_number", val, { shouldValidate: true });
                }}
              />
              <input type="hidden" {...register("contact_number", { required: "Contact Number is required" })} />
            </InputWrapper>
            <InputWrapper label="Date of Birth*" error={errors.dob?.message}>
              <Input
                type="date"
                {...register("dob", { required: "Date of Birth is required" })}
              />
            </InputWrapper>
            <InputWrapper label="Select Gender*" error={errors.gender?.message}>
              <select
                {...register("gender", { required: "Gender is required" })}
                className="w-full border bg-secondary rounded p-2 text-sm"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </InputWrapper>
            <InputWrapper
              label="Emergency Contact Name*"
              error={errors.emergency_contact_name?.message}
            >
              <Input
                {...register("emergency_contact_name", {
                  required: "Emergency Contact Name is required",
                })}
              />
            </InputWrapper>
            <InputWrapper
              label="Emergency Contact Number*"
              error={errors.emergency_contact_number?.message}
            >
              <PhoneInput
                value={watch("emergency_contact_number")}
                onChange={(val) => {
                  setValue("emergency_contact_number", val, { shouldValidate: true });
                }}
              />
              <input type="hidden" {...register("emergency_contact_number", { required: "Emergency Contact Number is required" })} />
            </InputWrapper>
            <InputWrapper label="Driver Rank" error={errors.driver_rank?.message}>
              <select
                {...register("driver_rank")}
                className="w-full border bg-secondary rounded p-2 text-sm"
              >
                <option value="">Select Rank</option>
                {RANKS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </InputWrapper>
          </div>

          {/* 1. Identity Card */}
          <SectionTitle>Identity Card</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputWrapper label="NRIC Number*" error={errors.identity_card_number?.message}>
              <Input
                {...register("identity_card_number", {
                  required: "NRIC is required",
                })}
              />
            </InputWrapper>
            <InputWrapper
              label="Issue Date*"
              error={errors.identity_card_issue_date?.message}
            >
              <Input
                type="date"
                {...register("identity_card_issue_date", {
                  required: "Issue date is required",
                })}
              />
            </InputWrapper>
          </div>

          {/* 2. Driving License */}
          <SectionTitle>Driving License</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputWrapper
              label="Driving License Number*"
              error={errors.driving_license_number?.message}
            >
              <Input
                {...register("driving_license_number", {
                  required: "License number is required",
                })}
              />
            </InputWrapper>
            <InputWrapper
              label="Issue Date*"
              error={errors.driving_license_issue_date?.message}
            >
              <Input
                type="date"
                {...register("driving_license_issue_date", {
                  required: "Issue date is required",
                })}
              />
            </InputWrapper>
            <InputWrapper
              label="Expiry Date*"
              error={errors.driving_license_expire_date?.message}
            >
              <Input
                type="date"
                {...register("driving_license_expire_date", {
                  required: "Expiry date is required",
                })}
              />
            </InputWrapper>
            <InputWrapper label="License Class*" error={errors.license_class?.message}>
              <select
                {...register("license_class", {
                  required: "License class is required",
                })}
                className="w-full border bg-secondary rounded p-2 text-sm"
              >
                <option value="">Select Class</option>
                {LICENSE_CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </InputWrapper>
          </div>

          {/* 3. Vehicle Details */}
          <SectionTitle>Vehicle Details</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputWrapper
              label="Vehicle Plate Number*"
              error={errors.vehicle_plate_number?.message}
            >
              <Input
                {...register("vehicle_plate_number", {
                  required: "Plate number is required",
                })}
              />
            </InputWrapper>
            <InputWrapper label="Vehicle Type*" error={errors.vehicle_type_id?.message}>
              <select
                {...register("vehicle_type_id", {
                  required: "Vehicle type is required",
                })}
                className="w-full border bg-secondary rounded p-2 text-sm"
              >
                <option value="">Select Type</option>
                {vehicleTypesResponse?.data?.data?.map((v: any) => (
                  <option key={v.id} value={v.id}>
                    {v.vehicle_name}
                  </option>
                ))}
              </select>
            </InputWrapper>
            <InputWrapper label="Vehicle Brand*" error={errors.vehicle_brand?.message}>
              <Input
                {...register("vehicle_brand", { required: "Brand is required" })}
              />
            </InputWrapper>
            <InputWrapper label="Vehicle Model*" error={errors.vehicle_model?.message}>
              <Input
                {...register("vehicle_model", { required: "Model is required" })}
              />
            </InputWrapper>
            <InputWrapper
              label="Registration Date*"
              error={errors.registration_date?.message}
            >
              <Input
                type="date"
                {...register("registration_date", {
                  required: "Registration date is required",
                })}
              />
            </InputWrapper>
          </div>

          {/* 4. Vehicle Log Card */}
          <SectionTitle>Vehicle Log Card</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputWrapper label="Chassis Number*" error={errors.chassis_number?.message}>
              <Input
                {...register("chassis_number", {
                  required: "Chassis number is required",
                })}
              />
            </InputWrapper>
          </div>

          {/* 5. Vehicle Insurance Policy */}
          <SectionTitle>Vehicle Insurance Policy</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputWrapper
              label="Insurance Policy Number*"
              error={errors.insurance_policy_number?.message}
            >
              <Input
                {...register("insurance_policy_number", {
                  required: "Policy number is required",
                })}
              />
            </InputWrapper>
            <InputWrapper
              label="Issue Date*"
              error={errors.insurance_issue_date?.message}
            >
              <Input
                type="date"
                {...register("insurance_issue_date", {
                  required: "Issue date is required",
                })}
              />
            </InputWrapper>
            <InputWrapper
              label="Expiry Date*"
              error={errors.insurance_expiry_date?.message}
            >
              <Input
                type="date"
                {...register("insurance_expiry_date", {
                  required: "Expiry date is required",
                })}
              />
            </InputWrapper>
          </div>

          {/* 6. Current Address */}
          <SectionTitle>Current Address</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputWrapper label="Postal Code*" error={errors.current_postal_code?.message}>
              <div className="relative">
                <Input
                  {...register("current_postal_code", {
                    required: "Postal code is required",
                  })}
                  onChange={(e) => {
                    register("current_postal_code").onChange(e);
                    const val = e.target.value;
                    clearTimeout(debounceTimers.current["currentpostal"]);
                    setShowPostalSuggestions((prev) => ({
                      ...prev,
                      currentpostal: false,
                    }));
                    debounceTimers.current["currentpostal"] = setTimeout(() => {
                      if (val.trim().length >= 3) {
                        fetchAddressFromPostal(val, "currentpostal");
                      }
                    }, 500);
                  }}
                />
                {isLoadingPostal === "currentpostal" && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500" />
                  </div>
                )}
                {showPostalSuggestions["currentpostal"] &&
                  postalSuggestions["currentpostal"]?.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-72 overflow-y-auto">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-widest border-b">
                        Suggested Addresses
                      </div>
                      {postalSuggestions["currentpostal"].map((s, i) => (
                        <button
                          key={i}
                          type="button"
                          className="w-full text-left px-4 py-3 hover:bg-[#FFFAE6] border-b last:border-0"
                          onClick={() => {
                            setValue("current_postal_code", s.postal_code);
                            setValue("current_address", s.address);
                            setShowPostalSuggestions((prev) => ({
                              ...prev,
                              currentpostal: false,
                            }));
                          }}
                        >
                          {s.displayLines.map((line, idx) => (
                            <p
                              key={idx}
                              className={
                                idx === 0
                                  ? "text-sm font-semibold text-gray-900 leading-tight"
                                  : "text-xs text-gray-500 leading-tight mt-0.5"
                              }
                            >
                              <span className="block">{line}</span>
                            </p>
                          ))}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            </InputWrapper>
            <InputWrapper label="Address*" error={errors.current_address?.message}>
              <Input
                {...register("current_address", { required: "Address is required" })}
              />
            </InputWrapper>
            <InputWrapper
              label="Apartment, Suite, Unit, Building, Floor, etc."
              error={errors.current_unit?.message}
            >
              <Input {...register("current_unit")} />
            </InputWrapper>
            <InputWrapper label="Country" error={errors.current_country?.message}>
              <select
                {...register("current_country")}
                className="w-full border bg-secondary rounded p-2 text-sm"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </InputWrapper>
          </div>

          {/* 7. Permanent Address */}
          <SectionTitle>Permanent Address</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputWrapper label="Postal Code*" error={errors.permanent_postal_code?.message}>
              <div className="relative">
                <Input
                  {...register("permanent_postal_code", {
                    required: "Postal code is required",
                  })}
                  onChange={(e) => {
                    register("permanent_postal_code").onChange(e);
                    const val = e.target.value;
                    clearTimeout(debounceTimers.current["permanentpostal"]);
                    setShowPostalSuggestions((prev) => ({
                      ...prev,
                      permanentpostal: false,
                    }));
                    debounceTimers.current["permanentpostal"] = setTimeout(() => {
                      if (val.trim().length >= 3) {
                        fetchAddressFromPostal(val, "permanentpostal");
                      }
                    }, 500);
                  }}
                />
                {isLoadingPostal === "permanentpostal" && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500" />
                  </div>
                )}
                {showPostalSuggestions["permanentpostal"] &&
                  postalSuggestions["permanentpostal"]?.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-72 overflow-y-auto">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-widest border-b">
                        Suggested Addresses
                      </div>
                      {postalSuggestions["permanentpostal"].map((s, i) => (
                        <button
                          key={i}
                          type="button"
                          className="w-full text-left px-4 py-3 hover:bg-[#FFFAE6] border-b last:border-0"
                          onClick={() => {
                            setValue("permanent_postal_code", s.postal_code);
                            setValue("permanent_address", s.address);
                            setShowPostalSuggestions((prev) => ({
                              ...prev,
                              permanentpostal: false,
                            }));
                          }}
                        >
                          {s.displayLines.map((line, idx) => (
                            <p
                              key={idx}
                              className={
                                idx === 0
                                  ? "text-sm font-semibold text-gray-900 leading-tight"
                                  : "text-xs text-gray-500 leading-tight mt-0.5"
                              }
                            >
                              <span className="block">{line}</span>
                            </p>
                          ))}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            </InputWrapper>
            <InputWrapper label="Address*" error={errors.permanent_address?.message}>
              <Input
                {...register("permanent_address", { required: "Address is required" })}
              />
            </InputWrapper>
            <InputWrapper
              label="Apartment, Suite, Unit, Building, Floor, etc."
              error={errors.permanent_unit?.message}
            >
              <Input {...register("permanent_unit")} />
            </InputWrapper>
            <InputWrapper label="Country" error={errors.permanent_country?.message}>
              <select
                {...register("permanent_country")}
                className="w-full border bg-secondary rounded p-2 text-sm"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </InputWrapper>
          </div>

          {/* 8. Bank Details */}
          <SectionTitle>Bank Details</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputWrapper label="Bank Name" error={errors.bank_name?.message}>
              <Input {...register("bank_name")} />
            </InputWrapper>
            <InputWrapper label="Account Number" error={errors.account_number?.message}>
              <Input {...register("account_number")} />
            </InputWrapper>
          </div>
        </div>

        {/* Document Upload Sections */}
        <div className="mt-10 space-y-10">
          <div>
            <SectionTitle>Identity Card Documents*</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <UploadBox
                label="NRIC Front*"
                onChange={(f) => handleDocumentChange("nricFront", f)}
                error={documentErrors.nricFront}
                isUploading={uploadingDocs.has("nricFront")}
              />
              <UploadBox
                label="NRIC Back*"
                onChange={(f) => handleDocumentChange("nricBack", f)}
                error={documentErrors.nricBack}
                isUploading={uploadingDocs.has("nricBack")}
              />
            </div>
          </div>

          <div>
            <SectionTitle>Driving License Documents*</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <UploadBox
                label="Driving License Front*"
                onChange={(f) => handleDocumentChange("licenseFront", f)}
                error={documentErrors.licenseFront}
                isUploading={uploadingDocs.has("licenseFront")}
              />
              <UploadBox
                label="Driving License Back*"
                onChange={(f) => handleDocumentChange("licenseBack", f)}
                error={documentErrors.licenseBack}
                isUploading={uploadingDocs.has("licenseBack")}
              />
            </div>
          </div>

          <div>
            <SectionTitle>Vehicle Photos*</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <UploadBox
                label="Front View of Vehicle*"
                onChange={(f) => handleDocumentChange("vehicleFront", f)}
                error={documentErrors.vehicleFront}
                isUploading={uploadingDocs.has("vehicleFront")}
              />
              <UploadBox
                label="Rear View of Vehicle*"
                onChange={(f) => handleDocumentChange("vehicleRear", f)}
                error={documentErrors.vehicleRear}
                isUploading={uploadingDocs.has("vehicleRear")}
              />
              <UploadBox
                label="Driver Side View*"
                onChange={(f) => handleDocumentChange("driverSide", f)}
                error={documentErrors.driverSide}
                isUploading={uploadingDocs.has("driverSide")}
              />
              <UploadBox
                label="Passenger Side View*"
                onChange={(f) => handleDocumentChange("passengerSide", f)}
                error={documentErrors.passengerSide}
                isUploading={uploadingDocs.has("passengerSide")}
              />
            </div>
          </div>

          <div>
            <SectionTitle>Vehicle Documents*</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <UploadBox
                label="Vehicle Log Card*"
                onChange={(f) => handleDocumentChange("vehicleLog", f)}
                error={documentErrors.vehicleLog}
                isUploading={uploadingDocs.has("vehicleLog")}
                buttonText="Upload"
              />
              <UploadBox
                label="Insurance Policy*"
                onChange={(f) => handleDocumentChange("insurancePolicy", f)}
                error={documentErrors.insurancePolicy}
                isUploading={uploadingDocs.has("insurancePolicy")}
                buttonText="Upload"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-10">
          <Button
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-10 py-3 text-lg rounded-lg"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading || uploadingDocs.size > 0 || isProfileUploading}
          >
            {isLoading || uploadingDocs.size > 0 || isProfileUploading
              ? "Adding..."
              : "Add Now"}
          </Button>
        </div>
      </div>
    </div>
  );
}
