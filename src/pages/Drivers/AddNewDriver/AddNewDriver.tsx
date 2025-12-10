/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Camera, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAddRiderProfileMutation } from "@/redux/features/drivers/driversApi";
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
  onChange: (file: File | null) => void;
  error?: string | null;
}

// UploadBox Component (FIXED)
const UploadBox = ({ label, onChange, error }: UploadBoxProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFileName(file.name);
      onChange(file);
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreview(url);
      } else {
        setPreview(null);
      }
    } else {
      handleClear();
    }
  };
  const handleClear = () => {
    setPreview(null);
    setFileName("");
    onChange(null);
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
        />
        <label
          htmlFor={`upload-${label.replace(/\s+/g, "-")}`}
          className={`border-2 border-dashed rounded-xl p-6 w-full flex flex-col items-center justify-center text-center cursor-pointer transition min-h-[180px] relative overflow-hidden ${error ? "border-red-400 bg-red-50 hover:bg-red-100" : "border-green-500 bg-white hover:bg-green-50"
            }`}
        >
          {preview ? (
            <>
              <img
                src={preview}
                alt="preview"
                className="absolute inset-0 w-full h-full object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleClear();
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 z-10 shadow-lg"
              >
                <X size={16} />
              </button>
            </>
          ) : fileName ? (
            <div className="flex flex-col items-center gap-2">
              <Upload size={24} className="text-green-600" />
              <p className="text-sm text-gray-700 text-center px-2">{fileName}</p>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleClear();
                }}
                className="text-xs text-red-500 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            </div>
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
  // Profile Image State
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  type DocumentFileState = {
    nidFront: File | null;
    nidBack: File | null;
    licenseFront: File | null;
    licenseBack: File | null;
    vehicleFront: File | null;
    vehicleBack: File | null;
    driverSide: File | null;
    passengerSide: File | null;
    vehicleLog: File | null;
    vehiclePolicy: File | null;
  };
  // Document Upload States
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

  // Document validation errors
  const [documentErrors, setDocumentErrors] = useState({
    nidFront: null as string | null,
    nidBack: null as string | null,
    licenseFront: null as string | null,
    licenseBack: null as string | null,
    vehicleFront: null as string | null,
    vehicleBack: null as string | null,
    driverSide: null as string | null,
    passengerSide: null as string | null,
    vehicleLog: null as string | null,
    vehiclePolicy: null as string | null,
  });

  // React Hook Form Setup
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

  // Use Mutation Hook for Adding Rider Profile
  const [addRiderProfile, { isLoading }] = useAddRiderProfileMutation();

  // Profile Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfileImageFile(file);

    if (file) {
      setProfilePreview(URL.createObjectURL(file));
    } else {
      setProfilePreview(null);
    }
  };

  // Document Upload
  const handleDocumentChange = (key: string, file: File | null) => {
    setDocuments((prev) => ({ ...prev, [key]: file }));
    if (file) {
      setDocumentErrors((prev) => ({ ...prev, [key]: null }));
    }
  };

  // Validate documents
  const validateDocuments = () => {
    const errors: {
      nidFront: string | null;
      nidBack: string | null;
      licenseFront: string | null;
      licenseBack: string | null;
      vehicleFront: string | null;
      vehicleBack: string | null;
      driverSide: string | null;
      passengerSide: string | null;
      vehicleLog: string | null;
      vehiclePolicy: string | null;
    } = {
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

    const requiredDocs = [
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
    ] as const;

    requiredDocs.forEach((doc) => {
      if (!documents[doc]) {
        errors[doc] = "This document is required";
      }
    });

    setDocumentErrors(errors);
    return Object.values(errors).every((v) => v === null);
  };

  // Helper function to convert date to ISO string
  const formatDateToISO = (dateString: string) => {
    if (!dateString || dateString.trim() === "") {
      return "";
    }

    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateString);
      return "";
    }

    return date.toISOString();
  };

  // Helper function to map gender to API format
  const mapGender = (gender: string) => {
    const genderMap: { [key: string]: string } = {
      "Male": "MALE",
      "Female": "FEMALE",
      "Other": "OTHER"
    };
    return genderMap[gender] || gender.toUpperCase();
  };

  // Helper function to map vehicle type to API format
  const mapVehicleType = (vehicleType: string) => {
    const vehicleMap: { [key: string]: string } = {
      "Bike": "MOTORCYCLE",
      "Car": "CAR",
      "Pickup": "PICKUP",
      "CNG": "CNG",
      "Truck": "TRUCK"
    };
    return vehicleMap[vehicleType] || vehicleType.toUpperCase();
  };

  // Submit Handler
  const onSubmit = async (data: any) => {
    // Validate documents first
    const documentsValid = validateDocuments();

    // Check profile image
    if (!profileImageFile) {
      toast.error("Please upload a profile image!");
      return;
    }

    // Check if all required documents are uploaded
    if (!documentsValid) {
      toast.error("Please upload all required documents!");
      return;
    }

    // Validate all date fields are filled
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
        driver_photos: profileImageFile ? [profileImageFile.name] : [],
        emergency_contact_name: data.emergencyContact,
        emergency_contact_number: data.emergencyContactNumber,
        identity_card_number: data.driverId,
        nid_front_images: documents.nidFront ? documents.nidFront.name : '',
        nid_back_images: documents.nidBack ? documents.nidBack.name : '',
        driving_license_number: data.drivingLicense,
        driving_license_issue_date: formatDateToISO(data.dlIssueDate),
        driving_license_expire_date: formatDateToISO(data.dlExpiryDate),
        driving_license_front_images: documents.licenseFront ? documents.licenseFront.name : '',
        driving_license_back_images: documents.licenseBack ? documents.licenseBack.name : '',
        vehicle_plate_number: data.vehiclePlate1 + "-" + data.vehiclePlate2,
        vehicle_type: mapVehicleType(data.vehicleType),
        vehicle_brand: data.model,
        registration_date: formatDateToISO(data.registrationDate),
        vehicle_front_images: documents.vehicleFront ? documents.vehicleFront.name : '',
        vehicle_back_images: documents.vehicleBack ? documents.vehicleBack.name : '',
        vehicle_driver_side_images: documents.driverSide ? documents.driverSide.name : '',
        vehicle_passenger_side_images: documents.passengerSide ? documents.passengerSide.name : '',
        vehicle_log_number: data.vehicleLog,
        vehicle_log_issue_date: formatDateToISO(data.vehicleIssueDate),
        vehicle_log_expire_date: formatDateToISO(data.vehicleExpiryDate),
        vehicle_log_images: documents.vehicleLog ? documents.vehicleLog.name : '',
        vehicle_policy_number: data.policyNumber,
        vehicle_policy_issue_date: formatDateToISO(data.policyIssue),
        vehicle_policy_expire_date: formatDateToISO(data.policyExpiry),
        vehicle_policy_images: documents.vehiclePolicy ? documents.vehiclePolicy.name : '',
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

      // console.log("Processed form data:", formData); // Debug log

      await addRiderProfile(formData).unwrap();

      toast.success("Rider profile created successfully!");
      navigate("/driver-list");
    } catch (error: any) {

      toast.error(error?.data?.message || "Failed to create rider profile");
    }
  };

  // Dropdown Options
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
      "policyExpiry"
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
              {profilePreview ? (
                <img
                  src={profilePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera size={32} className="text-gray-500" />
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
        </div>

        {/* Form Fields */}
        <div className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {allFields.map(({ key, label }) => (
              <div key={key}>
                <Label className="text-sm font-semibold pb-2">{label}</Label>

                {/* Gender */}
                {key === "gender" && (
                  <select
                    {...register(key, { required: `${label} is required` })}
                    className="w-full border bg-secondary rounded p-2"
                  >
                    <option value="">Select Gender</option>
                    {genderOptions.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                )}

                {/* Current State */}
                {key === "currentstate" && (
                  <select
                    {...register(key, { required: `${label} is required` })}
                    className="w-full border bg-secondary rounded p-2"
                  >
                    <option value="">Select State</option>
                    {stateOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                )}

                {/* Permanent State */}
                {key === "permanentstate" && (
                  <select
                    {...register(key, { required: `${label} is required` })}
                    className="w-full border bg-secondary rounded p-2"
                  >
                    <option value="">Select State</option>
                    {stateOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                )}

                {/* Vehicle Type */}
                {key === "vehicleType" && (
                  <select
                    {...register(key, { required: `${label} is required` })}
                    className="w-full border bg-secondary rounded p-2"
                  >
                    <option value="">Select Vehicle Type</option>
                    {vehicleTypes.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                )}

                {/* Bank */}
                {key === "bank" && (
                  <select
                    {...register(key, { required: `${label} is required` })}
                    className="w-full border bg-secondary rounded p-2"
                  >
                    <option value="">Select Bank</option>
                    {bankOptions.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                )}

                {/* Date Fields */}
                {isDateField(key) &&
                  !["gender", "currentstate", "permanentstate", "vehicleType", "bank"].includes(key) && (
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
              />
              <UploadBox
                label="Back side photo of your Identity card"
                onChange={(file) => handleDocumentChange("nidBack", file)}
                error={documentErrors.nidBack}
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
              />
              <UploadBox
                label="Back of Driving License"
                onChange={(file) => handleDocumentChange("licenseBack", file)}
                error={documentErrors.licenseBack}
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
              />
              <UploadBox
                label="Vehicle Back Side"
                onChange={(file) => handleDocumentChange("vehicleBack", file)}
                error={documentErrors.vehicleBack}
              />
              <UploadBox
                label="Driver Side"
                onChange={(file) => handleDocumentChange("driverSide", file)}
                error={documentErrors.driverSide}
              />
              <UploadBox
                label="Passenger Side"
                onChange={(file) => handleDocumentChange("passengerSide", file)}
                error={documentErrors.passengerSide}
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
              />
              <UploadBox
                label="Vehicle Policy Photo"
                onChange={(file) => handleDocumentChange("vehiclePolicy", file)}
                error={documentErrors.vehiclePolicy}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-10">
          <Button
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-10 py-3 text-lg rounded-lg"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Now"}
          </Button>
        </div>
      </div>
    </div>
  );
}