/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Camera, ArrowLeft, Star, Medal, Wifi } from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetRiderProfileByIdQuery,
  useUpdateRiderProfileMutation,
  useUploadImageMutation,
} from "@/redux/features/drivers/driversApi";
import { useNavigate, useParams } from "react-router-dom";
import { useGetVehicleTypesQuery } from "@/redux/features/vehicleType/vehicleTypeApi";

import {
  Button,
  MapModal,
  ResolvedAddress,
  LICENSE_CLASSES,
  COUNTRIES,
} from "../../AddNewDriver/components/DriverFormShared";

import {
  GeneralInformation,
  IdentityCardSection,
  DrivingLicenseSection,
  VehicleDetailsSection,
  VehicleInsurancePolicySection,
  AddressSection,
  BankInformationSection,
  DocumentUploadSections,
} from "../../AddNewDriver/components/EditDriverFormSections";

// ─── Types ───────────────────────────────────────────────────────────────────

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

interface DocumentUrlState {
  nricFront: string;
  nricBack: string;
  licenseFront: string;
  licenseBack: string;
  vehicleFront: string;
  vehicleRear: string;
  driverSide: string;
  passengerSide: string;
  vehicleLog: string;
  insurancePolicy: string;
}

interface DocumentErrorState {
  [key: string]: string | null;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EditDriverProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: driverResponse, isFetching } = useGetRiderProfileByIdQuery(id);
  const [updateRiderProfile, { isLoading: isUpdating }] = useUpdateRiderProfileMutation();
  const [uploadImage] = useUploadImageMutation();
  const { data: vehicleTypesResponse } = useGetVehicleTypesQuery({});
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profileImageUrls, setProfileImageUrls] = useState<string[]>([]);
  const [isProfileUploading, setIsProfileUploading] = useState(false);
  const [modalTarget, setModalTarget] = useState<"current" | "permanent" | null>(null);
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
  const [documentErrors, setDocumentErrors] = useState<DocumentErrorState>({});
  const isResetRef = useRef(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
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
      driver_rank: "",
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
      same_as_current: false,
    },
  });

  // Sync address logic
  const sameAsCurrent = watch("same_as_current");
  const currentPostal = watch("current_postal_code");
  const currentAddress = watch("current_address");
  const currentUnit = watch("current_unit");
  const currentCountry = watch("current_country");

  useEffect(() => {
    if (sameAsCurrent) {
      setValue("permanent_postal_code", currentPostal);
      setValue("permanent_address", currentAddress);
      setValue("permanent_unit", currentUnit);
      setValue("permanent_country", currentCountry);
    }
  }, [
    sameAsCurrent,
    currentPostal,
    currentAddress,
    currentUnit,
    currentCountry,
    setValue,
  ]);

  // Handle unchecking the box
  const prevSameAsCurrentLocal = useRef(false);
  useEffect(() => {
    if (prevSameAsCurrentLocal.current && !sameAsCurrent) {
      setValue("permanent_postal_code", "");
      setValue("permanent_address", "");
      setValue("permanent_unit", "");
      setValue("permanent_country", "Singapore");
    }
    prevSameAsCurrentLocal.current = !!sameAsCurrent;
  }, [sameAsCurrent, setValue]);

  const mapGenderFromAPI = (gender: string) => {
    if (!gender) return "";
    const lower = gender.toLowerCase();
    if (lower === "male") return "Male";
    if (lower === "female") return "Female";
    if (lower === "other") return "Other";
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  const mapLicenseClassFromAPI = (lc: string) => {
    if (!lc) return "";
    const target = lc.replace(/_/g, " ").toUpperCase();
    return LICENSE_CLASSES.find((c) => c.toUpperCase() === target) || lc;
  };

  const mapCountryFromAPI = (country: string) => {
    if (!country) return "Singapore";
    return COUNTRIES.find(c => c.toLowerCase() === country.toLowerCase()) || country;
  };

  // Prefill form when data is loaded
  useEffect(() => {
    if (driverResponse?.success && driverResponse.data) {
      const topLevelData = driverResponse.data;
      const d = topLevelData.registrations?.[0] || {};

      if (!isResetRef.current) {
        reset({
          raider_name: d.raider_name || topLevelData.raider_name || "",
          email_address: d.email_address || "",
          contact_number: d.contact_number || "+65",
          dob: d.dob ? d.dob.split("T")[0] : "",
          gender: mapGenderFromAPI(d.gender),
          emergency_contact_name: d.emergency_contact_name || "",
          emergency_contact_number: d.emergency_contact_number || "+65",
          driver_rank: topLevelData.rank || d.driver_rank || "",
          identity_card_number: d.identity_card_number || "",
          identity_card_issue_date: d.identity_card_issue_date ? d.identity_card_issue_date.split("T")[0] : "",
          driving_license_number: d.driving_license_number || "",
          driving_license_issue_date: d.driving_license_issue_date ? d.driving_license_issue_date.split("T")[0] : "",
          driving_license_expire_date: d.driving_license_expire_date ? d.driving_license_expire_date.split("T")[0] : "",
          license_class: mapLicenseClassFromAPI(d.license_class),
          vehicle_plate_number: d.vehicle_plate_number || "",
          vehicle_type_id: d.vehicle_type_id ? String(d.vehicle_type_id) : "",
          vehicle_brand: d.vehicle_brand || "",
          vehicle_model: d.vehicle_model || "",
          registration_date: d.registration_date ? d.registration_date.split("T")[0] : "",
          chassis_number: d.chassis_number || "",
          insurance_policy_number: d.insurance_policy_number || "",
          insurance_issue_date: d.insurance_issue_date ? d.insurance_issue_date.split("T")[0] : "",
          insurance_expiry_date: d.insurance_expiry_date ? d.insurance_expiry_date.split("T")[0] : "",
          current_postal_code: d.current_postal_code || "",
          current_address: d.current_address || "",
          current_unit: d.current_unit || "",
          current_country: mapCountryFromAPI(d.current_country),
          permanent_postal_code: d.permanent_postal_code || "",
          permanent_address: d.permanent_address || "",
          permanent_unit: d.permanent_unit || "",
          permanent_country: mapCountryFromAPI(d.permanent_country),
          bank_name: d.bank_name || "",
          account_number: d.account_number || "",
          password: topLevelData.password || d.password || "",
          confirm_password: topLevelData.password || d.password || "",
          same_as_current: false,
        });

        if (d.driver_photos && d.driver_photos.length > 0) {
          setProfileImageUrls(d.driver_photos);
        } else if (topLevelData.driver_photos && topLevelData.driver_photos.length > 0) {
          setProfileImageUrls(topLevelData.driver_photos);
        }

        setDocumentUrls({
          nricFront: d.nric_front_images || "",
          nricBack: d.nric_back_images || "",
          licenseFront: d.driving_license_front_images || "",
          licenseBack: d.driving_license_back_images || "",
          vehicleFront: d.vehicle_front_images || "",
          vehicleRear: d.vehicle_back_images || "",
          driverSide: d.vehicle_driver_side_images || "",
          passengerSide: d.vehicle_passenger_side_images || "",
          vehicleLog: d.vehicle_log_images || "",
          insurancePolicy: d.insurance_policy_images || "",
        });

        isResetRef.current = true;
      }
    }
  }, [driverResponse, reset, vehicleTypesResponse]);

  const handleImageUpload = async (files: File[]) => {
    setIsProfileUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      const res = await uploadImage(formData).unwrap();
      if (res.success && res.data) {
        setProfileImageUrls(res.data);
      }
    } catch {
      toast.error("Profile image upload failed");
    } finally {
      setIsProfileUploading(false);
    }
  };

  const handleProfileImageChange = (file: File | null) => {
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
      handleImageUpload([file]);
    } else {
      setProfilePreview(null);
      setProfileImageUrls([]);
    }
  };

  const handleDocumentChange = async (key: DocumentKey, file: File | null) => {
    if (!file) {
      setDocumentUrls((prev) => ({ ...prev, [key]: "" }));
      return;
    }
    setUploadingDocs((prev) => new Set(prev).add(key));
    setDocumentErrors((prev) => ({ ...prev, [key]: null }));
    try {
      const formData = new FormData();
      formData.append("images", file);
      const res = await uploadImage(formData).unwrap();
      if (res.success && res.data?.[0]) {
        setDocumentUrls((prev) => ({ ...prev, [key]: res.data[0] }));
      }
    } catch {
      toast.error(`Failed to upload ${key}`);
      setDocumentErrors((prev) => ({ ...prev, [key]: "Upload failed" }));
    } finally {
      setUploadingDocs((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  };

  const handleModalConfirm = useCallback(
    (resolved: ResolvedAddress, target: "current" | "permanent") => {
      if (target === "current") {
        setValue("current_postal_code", resolved.postal_code, { shouldValidate: true });
        setValue("current_address", resolved.address, { shouldValidate: true });
      } else {
        setValue("permanent_postal_code", resolved.postal_code, { shouldValidate: true });
        setValue("permanent_address", resolved.address, { shouldValidate: true });
      }
      setModalTarget(null);
    },
    [setValue]
  );

  const formatDateToISO = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "" : date.toISOString();
  };

  const mapGender = (gender: string) => {
    const map: Record<string, string> = { Male: "MALE", Female: "FEMALE", Other: "OTHER" };
    return map[gender] || gender;
  };

  const validateDocuments = () => {
    const required: DocumentKey[] = [
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
    let isValid = true;
    const newErrors: DocumentErrorState = {};
    required.forEach((key) => {
      if (!documentUrls[key]) {
        newErrors[key] = "Required";
        isValid = false;
      }
    });
    setDocumentErrors(newErrors);
    return isValid;
  };

  const onSubmit = async (data: any) => {
    if (!profileImageUrls.length) {
      toast.error("Profile photo is required!");
      return;
    }
    if (!validateDocuments()) {
      toast.error("Please upload all required documents!");
      return;
    }
    if (uploadingDocs.size > 0) {
      toast.error("Please wait for uploads to finish");
      return;
    }

    try {
      const formData = {
        raider_name: data.raider_name,
        contact_number: data.contact_number,
        email_address: data.email_address,
        password: data.password || undefined,
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
        driving_license_expire_date: "2030-01-01T00:00:00.000Z",
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

      await updateRiderProfile({ id: Number(id), data: formData }).unwrap();
      toast.success("Driver profile updated successfully!");
      navigate("/driver-list");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  if (isFetching) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500" />
      </div>
    );
  }

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
        <ArrowLeft /> Back to Driver List
      </h1>

      <div className="border rounded-xl py-10 px-6 lg:px-32 bg-white shadow-sm relative">
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <label className="cursor-pointer">
              <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center border overflow-hidden relative group">
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
                accept="image/*"
                onChange={(e) =>
                  handleProfileImageChange(e.target.files?.[0] || null)
                }
              />
            </label>
          </div>
          <p className="text-xs font-semibold mt-2">Profile Photo*</p>
        </div>

        {/* PROFILE INFO / STATS */}
        <div className="text-center mt-4">
          <div className="flex justify-center items-center gap-6 text-sm font-medium">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#FFFAE6] rounded-full border border-yellow-200">
              <Star className="text-yellow-500 fill-yellow-500" size={18} />
              <span className="text-gray-800 font-semibold">
                {driverResponse?.data?.formattedAverage ?? 0} / 5
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#F0F7FF] rounded-full border border-blue-200">
              <Medal className="text-blue-500" size={18} />
              <span className="text-gray-800 font-semibold">
                {driverResponse?.data?.rank || "NO RANK"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#F6FFF6] rounded-full border border-green-200">
              <Wifi className="text-green-500" size={18} />
              <span className="text-gray-800 font-semibold">
                {driverResponse?.data?.completed_orders || 0} Followers
              </span>
            </div>
          </div>
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
            disabled={isUpdating || uploadingDocs.size > 0 || isProfileUploading}
          >
            {isUpdating || uploadingDocs.size > 0 || isProfileUploading
              ? "Saving..."
              : "Save Changes"}
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