/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Camera } from "lucide-react";
import toast from "react-hot-toast";
import {
  useAddRiderProfileMutation,
  useUploadImageMutation,
} from "@/redux/features/drivers/driversApi";
import { useNavigate } from "react-router-dom";
import { useGetVehicleTypesQuery } from "@/redux/features/vehicleType/vehicleTypeApi";

import {
  Button,
  MapModal,
  ResolvedAddress,
} from "./components/DriverFormShared";

import {
  GeneralInformation,
  IdentityCardSection,
  DrivingLicenseSection,
  VehicleDetailsSection,
  VehicleLogCardSection,
  VehicleInsurancePolicySection,
  AddressSection,
  BankInformationSection,
  DocumentUploadSections,
} from "./components/FormSections";


// ─── Main Component ───────────────────────────────────────────────────────────

export default function AddNewDriver() {
  const [uploadImage] = useUploadImageMutation();
  const [, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profileImageUrls, setProfileImageUrls] = useState<string[]>([]);
  const [isProfileUploading, setIsProfileUploading] = useState(false);
  const navigate = useNavigate();

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
      confirm_password: "",
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
      <style
        dangerouslySetInnerHTML={{
          __html: `
        input[type="date"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          filter: invert(72%) sepia(98%) saturate(1450%) hue-rotate(352deg) brightness(101%) contrast(98%);
        }
      `,
        }}
      />
      <h1
        onClick={() => navigate("/driver-list")}
        className="flex items-center gap-2 cursor-pointer text-2xl font-semibold text-gray-900"
      >
        Add New Driver
      </h1>

      <div className="border rounded-xl py-10 px-6 lg:px-32 bg-white shadow-sm relative">
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <label className="cursor-pointer">
              <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center border overflow-hidden relative group">
                {profilePreview ? (
                  <img
                    src={profilePreview}
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
                accept="image/*"
                onChange={(e) =>
                  handleProfileImageChange(e.target.files?.[0] || null)
                }
              />
            </label>
          </div>
          <p className="text-xs font-semibold mt-2">Profile Photo*</p>
        </div>

        <div className="mt-10">
          <GeneralInformation
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />

          <IdentityCardSection
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />

          <DrivingLicenseSection
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />

          <VehicleDetailsSection
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
            vehicleTypesResponse={vehicleTypesResponse}
          />

          <VehicleLogCardSection />

          <VehicleInsurancePolicySection
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />

          <AddressSection
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
            setModalTarget={setModalTarget}
          />

          <BankInformationSection
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />

          <DocumentUploadSections
            documentUrls={documentUrls}
            uploadingDocs={uploadingDocs}
            documentErrors={documentErrors}
            handleDocumentChange={handleDocumentChange}
          />
        </div>

        <div className="flex justify-center mt-10">
          <Button
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-10 py-3 text-lg rounded-lg"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading || uploadingDocs.size > 0 || isProfileUploading}
          >
            {isLoading || uploadingDocs.size > 0 || isProfileUploading ? "Creating..." : "Add Now"}
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
