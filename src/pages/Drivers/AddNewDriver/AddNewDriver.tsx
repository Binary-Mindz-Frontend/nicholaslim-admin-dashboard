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
    className={`w-full border rounded px-3 py-2 bg-gray-100 focus:outline-none focus:border-yellow-400 ${className}`}
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
  // Determine selected country code from value, default to +65
  const selectedCountry = COUNTRY_CODES.find(c => value.startsWith(c.code)) || COUNTRY_CODES[0];

  // Strip selected country code prefix for display in the input
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
    | "nidFront"
    | "nidBack"
    | "licenseFront"
    | "licenseBack"
    | "vehicleFront"
    | "vehicleBack"
    | "driverSide"
    | "passengerSide"
    | "vehicleLog"
    | "vehiclePolicy";

  type DocumentFileState = Record<DocumentKey, File | null>;
  type DocumentUrlState = Record<DocumentKey, string>;
  type DocumentErrorState = Record<DocumentKey, string | null>;

  const [, setDocuments] = useState<DocumentFileState>({
    nidFront: null,
    nidBack: null,
    licenseFront: null,
    licenseBack: null,
    vehicleFront: null,
    vehicleBack: null,
    driverSide: null,
    passengerSide: null,
    vehicleLog: null,
    vehiclePolicy: null,
  });

  const [documentUrls, setDocumentUrls] = useState<DocumentUrlState>({
    nidFront: "",
    nidBack: "",
    licenseFront: "",
    licenseBack: "",
    vehicleFront: "",
    vehicleBack: "",
    driverSide: "",
    passengerSide: "",
    vehicleLog: "",
    vehiclePolicy: "",
  });

  const [uploadingDocs, setUploadingDocs] = useState<Set<DocumentKey>>(new Set());

  const [documentErrors, setDocumentErrors] = useState<DocumentErrorState>({
    nidFront: null,
    nidBack: null,
    licenseFront: null,
    licenseBack: null,
    vehicleFront: null,
    vehicleBack: null,
    driverSide: null,
    passengerSide: null,
    vehicleLog: null,
    vehiclePolicy: null,
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
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "+65",
      dob: "",
      gender: "",
      emergencyContact: "",
      emergencyContactNumber: "+65",
      driverId: "",
      currentaddress: "",
      currentapartment: "",
      currentcity: "",
      currentstate: "NA",
      currentpostal: "",
      permanentaddress: "",
      permanentapartment: "",
      permanentcity: "",
      permanentstate: "NA",
      permanentpostal: "",
      drivingLicense: "",
      dlIssueDate: "",
      dlExpiryDate: "",
      vehiclePlate1: "",
      vehicleType: "",
      vehiclePlate2: "NA",
      model: "",
      registrationDate: "",
      vehicleLog: "",
      vehicleIssueDate: "",
      vehicleExpiryDate: "",
      policyNumber: "",
      policyIssue: "",
      policyExpiry: "",
      bank: "",
      accountNumber: "",
    },
  });

  const phoneValue = watch("phone");
  const emergencyPhoneValue = watch("emergencyContactNumber");

  const [addRiderProfile, { isLoading }] = useAddRiderProfileMutation();
  const { data: vehicleTypesResponse } = useGetVehicleTypesQuery({});
  const vehicleTypes = [
    ...new Set(
      (Array.isArray(vehicleTypesResponse?.data?.data) ? vehicleTypesResponse.data.data : []).map((v: any) => v.vehicle_name),
    ),
  ];

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
      nidFront: null, nidBack: null, licenseFront: null, licenseBack: null,
      vehicleFront: null, vehicleBack: null, driverSide: null, passengerSide: null,
      vehicleLog: null, vehiclePolicy: null,
    };
    const requiredDocs: DocumentKey[] = [
      "nidFront", "nidBack", "licenseFront", "licenseBack",
      "vehicleFront", "vehicleBack", "driverSide", "passengerSide",
      "vehicleLog", "vehiclePolicy",
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

  const handleSelectSuggestion = (
    suggestion: OneMapSuggestion,
    postalFieldKey: string,
    addressFieldKey: string,
    cityFieldKey: string,
  ) => {
    // Fill postal code
    setValue(postalFieldKey as any, suggestion.postal_code);
    // Fill address as multi-line string
    setValue(addressFieldKey as any, suggestion.address);
    // Fill city from road name or "Singapore"
    setValue(cityFieldKey as any, "Singapore");
    setShowPostalSuggestions((prev) => ({ ...prev, [postalFieldKey]: false }));
  };

  const onSubmit = async (data: any) => {
    if (uploadingDocs.size > 0) {
      toast.error("Please wait for all images to finish uploading!");
      return;
    }
    const documentsValid = validateDocuments();
    if (!profileImageUrls.length) {
      toast.error("Please upload a profile image!");
      return;
    }
    if (!documentsValid) {
      toast.error("Please upload all required documents!");
      return;
    }

    const dateFields = [
      { value: data.dob, name: "Date of Birth" },
      { value: data.dlIssueDate, name: "License Issue Date" },
      { value: data.dlExpiryDate, name: "License Expiry Date" },
      { value: data.registrationDate, name: "Registration Date" },
      { value: data.vehicleIssueDate, name: "Vehicle Issue Date" },
      { value: data.vehicleExpiryDate, name: "Vehicle Expiry Date" },
      { value: data.policyIssue, name: "Policy Issue Date" },
      { value: data.policyExpiry, name: "Policy Expiry Date" },
    ];
    for (const field of dateFields) {
      if (!field.value || field.value.trim() === "") {
        toast.error(`${field.name} is required!`);
        return;
      }
    }

    try {
      const formData = {
        raider_name: data.firstName + " " + data.lastName,
        contact_number: data.phone,
        email_address: data.email || undefined,
        password: data.password,
        dob: formatDateToISO(data.dob),
        gender: mapGender(data.gender),
        driver_photos: profileImageUrls,
        emergency_contact_name: data.emergencyContact,
        emergency_contact_number: data.emergencyContactNumber,
        identity_card_number: data.driverId,
        nid_front_images: documentUrls.nidFront,
        nid_back_images: documentUrls.nidBack,
        driving_license_number: data.drivingLicense,
        driving_license_issue_date: formatDateToISO(data.dlIssueDate),
        driving_license_expire_date: formatDateToISO(data.dlExpiryDate),
        driving_license_front_images: documentUrls.licenseFront,
        driving_license_back_images: documentUrls.licenseBack,
        vehicle_plate_number: data.vehiclePlate1 + "-" + data.vehiclePlate2,
        vehicle_type: data.vehicleType,
        vehicle_brand: data.model,
        registration_date: formatDateToISO(data.registrationDate),
        vehicle_front_images: documentUrls.vehicleFront,
        vehicle_back_images: documentUrls.vehicleBack,
        vehicle_driver_side_images: documentUrls.driverSide,
        vehicle_passenger_side_images: documentUrls.passengerSide,
        vehicle_log_number: data.vehicleLog,
        vehicle_log_issue_date: formatDateToISO(data.vehicleIssueDate),
        vehicle_log_expire_date: formatDateToISO(data.vehicleExpiryDate),
        vehicle_log_images: documentUrls.vehicleLog,
        vehicle_policy_number: data.policyNumber,
        vehicle_policy_issue_date: formatDateToISO(data.policyIssue),
        vehicle_policy_expire_date: formatDateToISO(data.policyExpiry),
        vehicle_policy_images: documentUrls.vehiclePolicy,
        current_address: data.currentaddress,
        current_apartment: data.currentapartment,
        current_state_province: data.currentstate,
        current_city: data.currentcity,
        current_country: "Singapore",
        current_zip_post_code: data.currentpostal,
        permanent_address: data.permanentaddress,
        permanent_apartment: data.permanentapartment,
        permanent_state_province: data.permanentstate,
        permanent_city: data.permanentcity,
        permanent_country: "Singapore",
        permanent_zip_post_code: data.permanentpostal,
        bank_name: data.bank,
        account_number: data.accountNumber,
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

  const genderOptions = ["Male", "Female", "Other"];
  const isDateField = (field: string) =>
    ["dob", "dlIssueDate", "dlExpiryDate", "registrationDate",
      "vehicleIssueDate", "vehicleExpiryDate", "policyIssue", "policyExpiry"].includes(field);
  const isPostalField = (field: string) =>
    ["currentpostal", "permanentpostal"].includes(field);
  const isPhoneField = (field: string) =>
    ["phone", "emergencyContactNumber"].includes(field);

  const allFields = [
    { key: "firstName", label: "Driver Name" },
    { key: "email", label: "Email Address" },
    { key: "password", label: "Password" },
    { key: "phone", label: "Contact Number" },
    { key: "dob", label: "Date of Birth" },
    { key: "gender", label: "Select Gender" },
    { key: "emergencyContact", label: "Emergency Contact Name" },
    { key: "emergencyContactNumber", label: "Emergency Contact Number" },
    { key: "driverId", label: "Identity Card Number" },
    { key: "currentpostal", label: "Current Postal Code" },
    { key: "currentaddress", label: "Current Address" },
    { key: "currentapartment", label: "Current Apartment" },
    { key: "currentcity", label: "Current City" },
    { key: "permanentpostal", label: "Permanent Postal Code" },
    { key: "permanentaddress", label: "Permanent Address" },
    { key: "permanentapartment", label: "Permanent Apartment" },
    { key: "permanentcity", label: "Permanent City" },
    { key: "drivingLicense", label: "Driving License Number" },
    { key: "dlIssueDate", label: "License Issue Date" },
    { key: "dlExpiryDate", label: "License Expiry Date" },
    { key: "vehiclePlate1", label: "Vehicle Number Plate" },
    { key: "vehicleType", label: "Vehicle Type" },
    { key: "model", label: "Vehicle Model" },
    { key: "registrationDate", label: "Registration Date" },
    { key: "vehicleLog", label: "Vehicle Log Number" },
    { key: "vehicleIssueDate", label: "Vehicle Issue Date" },
    { key: "vehicleExpiryDate", label: "Vehicle Expiry Date" },
    { key: "policyNumber", label: "Policy Number" },
    { key: "policyIssue", label: "Policy Issue Date" },
    { key: "policyExpiry", label: "Policy Expiry Date" },
    { key: "bank", label: "Bank Name" },
    { key: "accountNumber", label: "Account Number" },
  ];

  return (
    <div className="px-8 sm:p-6 mx-auto space-y-6 bg-[#F5F7FA]">
      <h1 className="text-2xl font-semibold text-gray-900 pt-2 sm:pt-0">
        Add New Driver
      </h1>
      <div className="border rounded-xl py-10 px-6 lg:px-32 bg-white shadow-sm relative">

        {/* Profile Image */}
        <div className="flex justify-center">
          <label className="cursor-pointer mt-8 sm:mt-0">
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
              onChange={(e) => handleProfileImageChange(e.target.files?.[0] || null)}
              disabled={isProfileUploading}
            />
          </label>
        </div>

        {/* Form Fields */}
        <div className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {allFields.map(({ key, label }) => (
              <div key={key}>
                <Label className="text-sm font-semibold pb-2">{label}</Label>

                {/* Dropdown Fields */}
                {["gender", "vehicleType"].includes(key) && (
                  <select
                    {...register(key as any, { required: `${label} is required` })}
                    className="w-full border bg-secondary rounded p-2"
                  >
                    <option value="">Select {label.split(" ").slice(-1).join(" ")}</option>
                    {key === "gender" &&
                      genderOptions.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    {key === "vehicleType" &&
                      (vehicleTypes as string[]).map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                  </select>
                )}

                {/* Date Fields */}
                {isDateField(key) && (
                  <input
                    type="date"
                    {...register(key as any, { required: `${label} is required` })}
                    className="w-full border bg-secondary rounded p-2"
                  />
                )}

                {/* Phone Fields with +65 prefix */}
                {isPhoneField(key) && (
                  <PhoneInput
                    value={key === "phone" ? phoneValue : emergencyPhoneValue}
                    onChange={(val) => setValue(key as any, val)}
                    onBlur={register(key as any).onBlur}
                    error={errors[key as keyof typeof errors]?.message}
                  />
                )}

                {/* Postal Code Fields with OneMap auto-fill */}
                {isPostalField(key) && (() => {
                  const isCurrentPostal = key === "currentpostal";
                  const addressField = isCurrentPostal ? "currentaddress" : "permanentaddress";
                  const cityField = isCurrentPostal ? "currentcity" : "permanentcity";

                  return (
                    <div className="relative">
                      <Input
                        className="bg-secondary rounded pr-8"
                        {...register(key as any, { required: `${label} is required` })}
                        onChange={(e) => {
                          register(key as any).onChange(e);
                          clearTimeout(debounceTimers.current[key]);
                          setShowPostalSuggestions((prev) => ({ ...prev, [key]: false }));
                          debounceTimers.current[key] = setTimeout(() => {
                            if (e.target.value.trim().length >= 3) {
                              fetchAddressFromPostal(e.target.value, key);
                            }
                          }, 500);
                        }}
                      />
                      {isLoadingPostal === key && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500" />
                        </div>
                      )}

                      {/* OneMap suggestion dropdown */}
                      {showPostalSuggestions[key] && postalSuggestions[key]?.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-72 overflow-y-auto">
                          <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-widest border-b">
                            Suggested Addresses
                          </div>
                          {postalSuggestions[key].map((suggestion, index) => (
                            <button
                              key={index}
                              type="button"
                              className="w-full gap-2 text-left px-4 py-3 hover:bg-[#FFFAE6] focus:bg-[#FFFAE6] focus:outline-none border-b border-gray-50 last:border-0 transition-colors"
                              onClick={() =>
                                handleSelectSuggestion(suggestion, key, addressField, cityField)
                              }
                            >
                              {/* Multi-line address format */}
                              {suggestion.displayLines.map((line, i) => (
                                <p
                                  key={i}
                                  className={
                                    i === 0
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
                  );
                })()}

                {/* Normal Input */}
                {!["gender", "vehicleType"].includes(key) &&
                  !isDateField(key) &&
                  !isPostalField(key) &&
                  !isPhoneField(key) && (
                    <Input
                      type={key === "password" ? "password" : "text"}
                      className="bg-secondary rounded"
                      {...register(
                        key as any,
                        key === "email"
                          ? {}
                          : { required: `${label} is required` },
                      )}
                    />
                  )}

                {/* Validation errors (skip phone fields — PhoneInput handles its own) */}
                {!isPhoneField(key) && errors[key as keyof typeof errors] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[key as keyof typeof errors]?.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Document Upload Sections */}
        <div className="mt-10 space-y-10">
          {/* Identity Card */}
          <div>
            <h2 className="font-semibold text-lg">Personal Documents</h2>
            <p className="text-sm text-gray-600">Upload Your Identity Card</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <UploadBox label="Front side photo of your Identity card" onChange={(f) => handleDocumentChange("nidFront", f)} error={documentErrors.nidFront} isUploading={uploadingDocs.has("nidFront")} />
              <UploadBox label="Back side photo of your Identity card" onChange={(f) => handleDocumentChange("nidBack", f)} error={documentErrors.nidBack} isUploading={uploadingDocs.has("nidBack")} />
            </div>
          </div>

          {/* Driving License */}
          <div>
            <h2 className="font-semibold text-lg">Driving License</h2>
            <p className="text-sm text-gray-600">Upload Your License</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <UploadBox label="Front side of Driving License" onChange={(f) => handleDocumentChange("licenseFront", f)} error={documentErrors.licenseFront} isUploading={uploadingDocs.has("licenseFront")} />
              <UploadBox label="Back side of Driving License" onChange={(f) => handleDocumentChange("licenseBack", f)} error={documentErrors.licenseBack} isUploading={uploadingDocs.has("licenseBack")} />
            </div>
          </div>

          {/* Vehicle Photos */}
          <div>
            <h2 className="font-semibold text-lg">Vehicle Photos</h2>
            <p className="text-sm text-gray-600">Upload Your Vehicle Images</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <UploadBox label="Vehicle Front Side" onChange={(f) => handleDocumentChange("vehicleFront", f)} error={documentErrors.vehicleFront} isUploading={uploadingDocs.has("vehicleFront")} />
              <UploadBox label="Vehicle Back Side" onChange={(f) => handleDocumentChange("vehicleBack", f)} error={documentErrors.vehicleBack} isUploading={uploadingDocs.has("vehicleBack")} />
              <UploadBox label="Driver Side of Vehicle" onChange={(f) => handleDocumentChange("driverSide", f)} error={documentErrors.driverSide} isUploading={uploadingDocs.has("driverSide")} />
              <UploadBox label="Passenger Side of Vehicle" onChange={(f) => handleDocumentChange("passengerSide", f)} error={documentErrors.passengerSide} isUploading={uploadingDocs.has("passengerSide")} />
            </div>
          </div>

          {/* Policy & Log */}
          <div>
            <h2 className="font-semibold text-lg">Vehicle Documents</h2>
            <p className="text-sm text-gray-600">Upload Vehicle Log & Policy Documents</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <UploadBox label="Vehicle Log" onChange={(f) => handleDocumentChange("vehicleLog", f)} error={documentErrors.vehicleLog} isUploading={uploadingDocs.has("vehicleLog")} buttonText="Upload" />
              <UploadBox label="Vehicle Policy" onChange={(f) => handleDocumentChange("vehiclePolicy", f)} error={documentErrors.vehiclePolicy} isUploading={uploadingDocs.has("vehiclePolicy")} buttonText="Upload" />
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

