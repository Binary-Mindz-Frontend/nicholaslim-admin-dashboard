/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Camera, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAddRiderProfileMutation, useUploadImageMutation } from "@/redux/features/drivers/driversApi";
import { useNavigate } from "react-router-dom";

// --- START: Component Interfaces (for all components) ---
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

// Interface specifically for UploadBox props
interface UploadBoxProps {
  label: string;
  // onChange now expects the File object OR null (for clear)
  onChange: (file: File | null) => void;
  error?: string | null;
  isUploading?: boolean;
  // IMPORTANT: This URL comes from the parent's uploaded URL state (e.g., documentUrls.nidFront)
  currentPreviewUrl?: string | null;
}

// UploadBox Component (FIXED to prioritize uploaded URL)
const UploadBox = ({ label, onChange, error, isUploading, currentPreviewUrl }: UploadBoxProps) => {
  // Local state to hold the file selected before API upload (for instant preview)
  const [localFileUrl, setLocalFileUrl] = useState<string | null>(null);

  // Determine which preview to show: 
  // 1. Uploaded URL (if available, it's the final source of truth)
  // 2. Local File URL (while waiting for API upload)
  const preview = currentPreviewUrl || localFileUrl;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    // 1. Update local preview URL
    if (file.type.startsWith("image/")) {
      // Revoke previous local object URL to prevent memory leak
      if (localFileUrl) URL.revokeObjectURL(localFileUrl);
      setLocalFileUrl(URL.createObjectURL(file));
    } else {
      setLocalFileUrl(null);
    }

    // 2. Notify parent component with the File object (to trigger API upload)
    onChange(file);

    // Clearing the input allows re-uploading the same file, but now it's less critical
    // e.target.value = ""; 
  };

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. Clear local preview if it exists
    if (localFileUrl) {
      URL.revokeObjectURL(localFileUrl);
      setLocalFileUrl(null);
    }

    // 2. Notify parent to clear the File and URL state (documentUrls[key] in parent)
    onChange(null);

    // Force clear the input element (optional, but good practice)
    const inputElement = document.getElementById(`upload-${label.replace(/\s+/g, "-")}`) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = "";
    }
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
          ) : preview ? ( // Use the determined preview URL
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
                <span className="text-xs sm:text-sm text-gray-700">Upload Photo</span>
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


export default function AddNewDriver() {
  const [uploadImage] = useUploadImageMutation();
  // 1. Profile Image States
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null); // For immediate local preview
  const [profileImageUrls, setProfileImageUrls] = useState<string[]>([]); // To store the uploaded URL(s)
  const [isProfileUploading, setIsProfileUploading] = useState(false);
  const navigate = useNavigate();

  // Type for document state for clarity
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

  // State to hold the File object before upload (used mostly for temporary local state)
  type DocumentFileState = Record<DocumentKey, File | null>;

  const [documents, setDocuments] = useState<DocumentFileState>({
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

  // State to hold the uploaded URL (this is the source of truth for submission)
  type DocumentUrlState = Record<DocumentKey, string>;

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

  // State to track currently uploading documents
  const [uploadingDocs, setUploadingDocs] = useState<Set<DocumentKey>>(new Set());

  // State to hold validation errors for documents
  type DocumentErrorState = Record<DocumentKey, string | null>;

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
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dob: "",
      gender: "",
      emergencyContact: "",
      emergencyContactNumber: "",
      driverId: "",
      currentaddress: "",
      currentapartment: "",
      currentcity: "",
      currentstate: "",
      currentpostal: "",
      permanentaddress: "",
      permanentapartment: "",
      permanentcity: "",
      permanentstate: "",
      permanentpostal: "",
      drivingLicense: "",
      dlIssueDate: "",
      dlExpiryDate: "",
      vehiclePlate1: "",
      vehicleType: "",
      vehiclePlate2: "",
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

  const [addRiderProfile, { isLoading }] = useAddRiderProfileMutation();

  // Handler for Profile Image (single)
  const handleProfileImageChange = (file: File | null) => {
    // 1. Set local file and preview immediately
    setProfileFile(file);
    setProfilePreview(file ? URL.createObjectURL(file) : null);

    // 2. Trigger API upload if a file exists
    if (file) {
      handleImageUpload([file]);
    } else {
      // Clear uploaded URL if the user clears the image
      setProfileImageUrls([]);
    }
  };

  // Single function to handle API upload for multiple images (Profile)
  const handleImageUpload = async (files: File[]) => {
    if (files.length === 0) {
      setProfileImageUrls([]);
      return;
    }

    setIsProfileUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file); // Use the correct key 'images'
      });

      const response = await uploadImage(formData).unwrap();
      const uploadedUrls = response.data; // This is expected to be array<string>

      setProfileImageUrls(uploadedUrls); // Store the uploaded URLs
      // Removed: toast.success("Profile image uploaded successfully!");
    } catch (error: any) {
      toast.error("Failed to upload profile image.");
      console.error("Upload error:", error);
      setProfileFile(null); // Clear file and URL on failure
      setProfilePreview(null);
      setProfileImageUrls([]);
    } finally {
      setIsProfileUploading(false);
    }
  };

  // Single function to handle API upload for a single document (Documents)
  const handleDocumentUpload = async (key: DocumentKey, file: File | null) => {
    if (!file) {
      // If file is null, the user is clearing the document
      setDocumentUrls((prev) => ({ ...prev, [key]: "" }));
      setUploadingDocs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
      setDocumentErrors((prev) => ({ ...prev, [key]: "This document is required" }));
      return;
    }

    try {
      setUploadingDocs((prev) => new Set(prev).add(key));

      const formData = new FormData();
      formData.append("images", file);

      const response = await uploadImage(formData).unwrap();
      const uploadedUrl = response.data[0]; // Expecting data: ["url"]

      // Update the states
      setDocumentUrls((prev) => ({ ...prev, [key]: uploadedUrl }));
      setDocumentErrors((prev) => ({ ...prev, [key]: null }));

      // **FIX: Removed the success toast here to prevent alert for every single document upload**
      // toast.success(`${key} uploaded successfully!`);
    } catch (error: any) {
      toast.error(`Failed to upload ${key}`);
      setDocumentUrls((prev) => ({ ...prev, [key]: "" })); // Clear URL on error
      setDocuments((prev) => ({ ...prev, [key]: null }));
      setDocumentErrors((prev) => ({ ...prev, [key]: `Failed to upload ${key}` }));
      console.error("Upload error:", error);
    } finally {
      setUploadingDocs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
  };

  // The change handler now just calls the upload logic
  const handleDocumentChange = (key: DocumentKey, file: File | null) => {
    handleDocumentUpload(key, file);
  };

  const validateDocuments = () => {
    const errors: DocumentErrorState = {
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
    };

    const requiredDocs: DocumentKey[] = [
      "nidFront",
      "nidBack",
      "licenseFront",
      "licenseBack",
      "vehicleFront",
      "vehicleBack",
      "driverSide",
      "passengerSide",
      "vehicleLog",
      "vehiclePolicy",
    ];

    requiredDocs.forEach((doc) => {
      if (!documentUrls[doc]) {
        errors[doc] = "This document is required";
      }
    });

    setDocumentErrors(errors);
    return Object.values(errors).every((v) => v === null);
  };

  const formatDateToISO = (dateString: string) => {
    if (!dateString || dateString.trim() === "") {
      return "";
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateString);
      return "";
    }

    // The local date string is usually in YYYY-MM-DD format. 
    // To prevent timezone issues shifting the date, we can just return the local date string 
    // if the API expects YYYY-MM-DDT00:00:00.000Z. For this example, we keep toISOString 
    // but ensure the input is valid.
    return date.toISOString();
  };

  const mapGender = (gender: string) => {
    const genderMap: { [key: string]: string } = {
      Male: "MALE",
      Female: "FEMALE",
      Other: "OTHER",
    };
    return genderMap[gender] || gender.toUpperCase();
  };

  const mapVehicleType = (vehicleType: string) => {
    const vehicleMap: { [key: string]: string } = {
      Bike: "MOTORCYCLE",
      Car: "CAR",
      Pickup: "PICKUP",
      CNG: "CNG",
      Truck: "TRUCK",
    };
    return vehicleMap[vehicleType] || vehicleType.toUpperCase();
  };

  const onSubmit = async (data: any) => {
    // 1. Check for ongoing uploads
    if (uploadingDocs.size > 0) {
      toast.error("Please wait for all images to finish uploading!");
      return;
    }

    // 2. Validate all document URLs
    const documentsValid = validateDocuments();

    if (!profileImageUrls.length) {
      toast.error("Please upload a profile image!");
      return;
    }

    if (!documentsValid) {
      toast.error("Please upload all required documents!");
      return;
    }

    // 3. Check for required date fields
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
        email_address: data.email,
        dob: formatDateToISO(data.dob),
        gender: mapGender(data.gender),
        driver_photos: profileImageUrls, // Send URL
        emergency_contact_name: data.emergencyContact,
        emergency_contact_number: data.emergencyContactNumber,
        identity_card_number: data.driverId,
        nid_front_images: documentUrls.nidFront, // Send URL
        nid_back_images: documentUrls.nidBack, // Send URL
        driving_license_number: data.drivingLicense,
        driving_license_issue_date: formatDateToISO(data.dlIssueDate),
        driving_license_expire_date: formatDateToISO(data.dlExpiryDate),
        driving_license_front_images: documentUrls.licenseFront, // Send URL
        driving_license_back_images: documentUrls.licenseBack, // Send URL
        vehicle_plate_number: data.vehiclePlate1 + "-" + data.vehiclePlate2,
        vehicle_type: mapVehicleType(data.vehicleType),
        vehicle_brand: data.model,
        registration_date: formatDateToISO(data.registrationDate),
        vehicle_front_images: documentUrls.vehicleFront, // Send URL
        vehicle_back_images: documentUrls.vehicleBack, // Send URL
        vehicle_driver_side_images: documentUrls.driverSide, // Send URL
        vehicle_passenger_side_images: documentUrls.passengerSide, // Send URL
        vehicle_log_number: data.vehicleLog,
        vehicle_log_issue_date: formatDateToISO(data.vehicleIssueDate),
        vehicle_log_expire_date: formatDateToISO(data.vehicleExpiryDate),
        vehicle_log_images: documentUrls.vehicleLog, // Send URL
        vehicle_policy_number: data.policyNumber,
        vehicle_policy_issue_date: formatDateToISO(data.policyIssue),
        vehicle_policy_expire_date: formatDateToISO(data.policyExpiry),
        vehicle_policy_images: documentUrls.vehiclePolicy, // Send URL
        current_address: data.currentaddress,
        current_apartment: data.currentapartment,
        current_state_province: data.currentstate,
        current_city: data.currentcity,
        current_country: "Bangladesh",
        current_zip_post_code: data.currentpostal,
        permanent_address: data.permanentaddress,
        permanent_apartment: data.permanentapartment,
        permanent_state_province: data.permanentstate,
        permanent_city: data.permanentcity,
        permanent_country: "Bangladesh",
        permanent_zip_post_code: data.permanentpostal,
        bank_name: data.bank,
        account_number: data.accountNumber,
      };

      console.log("Data being sent to API:", formData); // Added console log

      await addRiderProfile(formData).unwrap();

      toast.success("Rider profile created successfully!");
      navigate("/driver-list");
    } catch (error: any) {
      console.error("API Submission Error:", error);
      toast.error(error?.data?.message || "Failed to create rider profile");
    }
  };

  // Dropdown Options (Rest of the component's non-logic code is unchanged)
  const genderOptions = ["Male", "Female", "Other"];
  const stateOptions = [
    "Dhaka",
    "Chattogram",
    "Khulna",
    "Sylhet",
    "Rajshahi",
    "Barishal",
    "Rangpur",
    "Mymensingh",
  ];
  const vehicleTypes = ["Bike", "Car", "Pickup", "CNG", "Truck"];
  const bankOptions = ["DBBL", "BRAC Bank", "Sonali Bank", "City Bank", "IBBL"];

  const allFields = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email Address" },
    { key: "phone", label: "Phone Number" },
    { key: "dob", label: "Date of Birth" },
    { key: "gender", label: "Gender" },
    { key: "emergencyContact", label: "Emergency Contact Name" },
    { key: "emergencyContactNumber", label: "Emergency Contact Number" },
    { key: "driverId", label: "Driver ID" },
    { key: "currentaddress", label: "Current Address" },
    { key: "currentapartment", label: "Current Apartment" },
    { key: "currentcity", label: "Current City" },
    { key: "currentstate", label: "Current State" },
    { key: "currentpostal", label: "Current Postal Code" },
    { key: "permanentaddress", label: "Permanent Address" },
    { key: "permanentapartment", label: "Permanent Apartment" },
    { key: "permanentcity", label: "Permanent City" },
    { key: "permanentstate", label: "Permanent State" },
    { key: "permanentpostal", label: "Permanent Postal Code" },
    { key: "drivingLicense", label: "Driving License Number" },
    { key: "dlIssueDate", label: "License Issue Date" },
    { key: "dlExpiryDate", label: "License Expiry Date" },
    { key: "vehiclePlate1", label: "Vehicle Number Plate 1" },
    { key: "vehiclePlate2", label: "Vehicle Number Plate 2" },
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

  const isDateField = (field: string) => {
    const dateFields = [
      "dob",
      "dlIssueDate",
      "dlExpiryDate",
      "registrationDate",
      "vehicleIssueDate",
      "vehicleExpiryDate",
      "policyIssue",
      "policyExpiry",
    ];
    return dateFields.includes(field);
  };

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
              {profilePreview || profileImageUrls[0] ? ( // Show local preview or uploaded URL
                <img
                  src={profilePreview || profileImageUrls[0]}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : isProfileUploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
              ) : (
                <Camera size={32} className="text-gray-500" />
              )}
            </div>
            <input
              type="file"
              className="hidden"
              id="upload-images"
              accept="image/*" // Only images for profile
              onChange={(e) => handleProfileImageChange(e.target.files?.[0] || null)} // Adapted to use the new simple handler
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
                {["gender", "currentstate", "permanentstate", "vehicleType", "bank"].includes(key) && (
                  <select
                    {...register(key, { required: `${label} is required` })}
                    className="w-full border bg-secondary rounded p-2"
                  >
                    <option value="">Select {label.split(' ').slice(-1).join(' ')}</option>
                    {key === "gender" && genderOptions.map((g) => (<option key={g} value={g}>{g}</option>))}
                    {["currentstate", "permanentstate"].includes(key) && stateOptions.map((s) => (<option key={s} value={s}>{s}</option>))}
                    {key === "vehicleType" && vehicleTypes.map((v) => (<option key={v} value={v}>{v}</option>))}
                    {key === "bank" && bankOptions.map((b) => (<option key={b} value={b}>{b}</option>))}
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

                {/* Normal Input */}
                {!["gender", "currentstate", "permanentstate", "vehicleType", "bank"].includes(key) &&
                  !isDateField(key) && (
                    <Input
                      className="bg-secondary rounded"
                      {...register(key as any, { required: `${label} is required` })}
                    />
                  )}

                {errors[key as keyof typeof errors] && (
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
              <UploadBox
                label="Front side photo of your Identity card"
                onChange={(file) => handleDocumentChange("nidFront", file)}
                error={documentErrors.nidFront}
                isUploading={uploadingDocs.has("nidFront")}
              //        currentPreviewUrl={documentUrls.nidFront} // **FIX: Pass the uploaded URL**
              />
              <UploadBox
                label="Back side photo of your Identity card"
                onChange={(file) => handleDocumentChange("nidBack", file)}
                error={documentErrors.nidBack}
                isUploading={uploadingDocs.has("nidBack")}
              //        currentPreviewUrl={documentUrls.nidBack} // **FIX: Pass the uploaded URL**
              />
            </div>
          </div>

          {/* Driving License */}
          <div>
            <h2 className="font-semibold text-lg">Driving License</h2>
            <p className="text-sm text-gray-600">Upload Your License</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <UploadBox
                label="Front of Driving License"
                onChange={(file) => handleDocumentChange("licenseFront", file)}
                error={documentErrors.licenseFront}
                isUploading={uploadingDocs.has("licenseFront")}
              //        currentPreviewUrl={documentUrls.licenseFront} // **FIX: Pass the uploaded URL**
              />
              <UploadBox
                label="Back of Driving License"
                onChange={(file) => handleDocumentChange("licenseBack", file)}
                error={documentErrors.licenseBack}
                isUploading={uploadingDocs.has("licenseBack")}
              //        currentPreviewUrl={documentUrls.licenseBack} // **FIX: Pass the uploaded URL**
              />
            </div>
          </div>

          {/* Vehicle Photos */}
          <div>
            <h2 className="font-semibold text-lg">Vehicle Photos</h2>
            <p className="text-sm text-gray-600">Upload Your Vehicle Images</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <UploadBox
                label="Vehicle Front Side"
                onChange={(file) => handleDocumentChange("vehicleFront", file)}
                error={documentErrors.vehicleFront}
                isUploading={uploadingDocs.has("vehicleFront")}
              //        currentPreviewUrl={documentUrls.vehicleFront} // **FIX: Pass the uploaded URL**
              />
              <UploadBox
                label="Vehicle Back Side"
                onChange={(file) => handleDocumentChange("vehicleBack", file)}
                error={documentErrors.vehicleBack}
                isUploading={uploadingDocs.has("vehicleBack")}
              //        currentPreviewUrl={documentUrls.vehicleBack} // **FIX: Pass the uploaded URL**
              />
              <UploadBox
                label="Driver Side"
                onChange={(file) => handleDocumentChange("driverSide", file)}
                error={documentErrors.driverSide}
                isUploading={uploadingDocs.has("driverSide")}
              //        currentPreviewUrl={documentUrls.driverSide} // **FIX: Pass the uploaded URL**
              />
              <UploadBox
                label="Passenger Side"
                onChange={(file) => handleDocumentChange("passengerSide", file)}
                error={documentErrors.passengerSide}
                isUploading={uploadingDocs.has("passengerSide")}
              //        currentPreviewUrl={documentUrls.passengerSide} // **FIX: Pass the uploaded URL**
              />
            </div>
          </div>

          {/* Policy & Log */}
          <div>
            <h2 className="font-semibold text-lg">Vehicle Documents</h2>
            <p className="text-sm text-gray-600">
              Upload Vehicle Log & Policy Documents
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <UploadBox
                label="Vehicle Log Photo"
                onChange={(file) => handleDocumentChange("vehicleLog", file)}
                error={documentErrors.vehicleLog}
                isUploading={uploadingDocs.has("vehicleLog")}
              //        currentPreviewUrl={documentUrls.vehicleLog} // **FIX: Pass the uploaded URL**
              />
              <UploadBox
                label="Vehicle Policy Photo"
                onChange={(file) => handleDocumentChange("vehiclePolicy", file)}
                error={documentErrors.vehiclePolicy}
                isUploading={uploadingDocs.has("vehiclePolicy")}
              //        currentPreviewUrl={documentUrls.vehiclePolicy} // **FIX: Pass the uploaded URL**
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
            {(isLoading || uploadingDocs.size > 0 || isProfileUploading) ? "Adding..." : "Add Now"}
          </Button>
        </div>
      </div>
    </div>
  );
}