/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useGetRiderProfileByIdQuery } from "@/redux/features/drivers/driversApi";
import { useGetVehicleTypesQuery } from "@/redux/features/vehicleType/vehicleTypeApi";

import { Camera, ArrowLeft, Star, Medal, Wifi, AlertCircle } from "lucide-react";
import {
  SectionTitle,
  InputWrapper,
  Input,
  PhoneInput,
  LICENSE_CLASSES,
  COUNTRIES,
  Button,
} from "../../AddNewDriver/components/DriverFormShared";

// ─── Helper Components for View Mode ──────────────────────────────────────────

const ViewImage = ({ label, url }: { label: string; url?: string }) => {
  const isPdf = url?.toLowerCase().split('?')[0].endsWith(".pdf");

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold">{label}</label>
      <div className="border-2 border-dashed rounded-xl p-4 w-full flex flex-col items-center justify-center text-center bg-white min-h-[200px] relative overflow-hidden border-green-500 shadow-sm">
        {url ? (
          isPdf ? (
            <div className="flex flex-col items-center gap-2 p-4">
              <div className="bg-red-100 rounded-lg p-3">
                <Camera size={32} className="text-red-500" />
              </div>
              <p className="text-sm font-medium text-gray-800 break-all text-center">
                PDF Document
              </p>
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-500 text-xs font-semibold hover:underline mt-1"
              >
                View PDF
              </a>
            </div>
          ) : (
            <img
              src={url}
              alt={label}
              className="max-w-full max-h-[180px] object-contain rounded-lg transition-transform hover:scale-105 duration-300"
            />
          )
        ) : (
          <div className="text-gray-400 flex flex-col items-center">
            <Camera size={32} className="mb-2 opacity-20" />
            <p className="text-sm font-medium">No Document Provided</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function ViewDriverProfile() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isNotRegistered, setIsNotRegistered] = useState(false);

    const { data: driverResponse, isFetching, isError } = useGetRiderProfileByIdQuery(
        Number(id),
        { skip: !id }
    );
    const { data: vehicleTypesResponse } = useGetVehicleTypesQuery({});

    const { register, reset, watch } = useForm();
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const [documentUrls, setDocumentUrls] = useState({
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
        return LICENSE_CLASSES.find((c) => c.toUpperCase() === target) || target;
    };

    const mapCountryFromAPI = (country: string) => {
        if (!country) return "Singapore";
        return COUNTRIES.find(c => c.toLowerCase() === country.toLowerCase()) || country;
    };

    useEffect(() => {
        if (driverResponse?.success && driverResponse.data) {
            const topLevelData = driverResponse.data;
            const d = topLevelData.registrations?.[0] || topLevelData;

            // Check if there's actual data (raider_name or similar)
            if (!d.raider_name && !topLevelData.raider_name && (!topLevelData.registrations || topLevelData.registrations.length === 0)) {
                setIsNotRegistered(true);
            } else {
                setIsNotRegistered(false);
                reset({
                    raider_name: d.raider_name || topLevelData.raider_name || "",
                    email_address: d.email_address || topLevelData.email_address || "",
                    contact_number: d.contact_number || topLevelData.contact_number || "",
                    dob: d.dob ? d.dob.split("T")[0] : "",
                    gender: mapGenderFromAPI(d.gender),
                    emergency_contact_name: d.emergency_contact_name || "",
                    emergency_contact_number: d.emergency_contact_number || "",
                    driver_rank: topLevelData.rank || d.driver_rank || "NO RANK",
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
                });

                if (d.driver_photos?.[0]) {
                    setProfileImage(d.driver_photos[0]);
                } else if (topLevelData.driver_photos?.[0]) {
                    setProfileImage(topLevelData.driver_photos[0]);
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
            }
        }
    }, [driverResponse, reset]);

    if (isFetching) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#F5F7FA]">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500" />
            </div>
        );
    }

    if (isNotRegistered || isError) {
        return (
            <div className="px-8 sm:p-6 mx-auto space-y-6 bg-[#F5F7FA] min-h-screen">
                <h1 onClick={() => navigate(-1)} className="flex items-center gap-2 cursor-pointer text-2xl font-semibold text-gray-900">
                    <ArrowLeft /> Back
                </h1>
                <div className="flex flex-col items-center justify-center border rounded-xl py-20 bg-white shadow-sm">
                    <AlertCircle size={64} className="text-yellow-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800">No Profile Data Found</h2>
                    <p className="text-gray-500 mt-2">This driver has not submitted their profile details yet.</p>
                    <Button 
                        className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8" 
                        onClick={() => navigate(-1)}
                    >
                        Return to List
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="px-8 sm:p-6 mx-auto space-y-6 bg-[#F5F7FA]">
            <style
                dangerouslySetInnerHTML={{
                __html: `
                input[type="date"]::-webkit-calendar-picker-indicator {
                    cursor: default;
                    filter: invert(72%) sepia(98%) saturate(1450%) hue-rotate(352deg) brightness(101%) contrast(98%);
                }
                input:read-only {
                    background-color: #f9fafb !important;
                    cursor: default !important;
                }
                select:disabled {
                    background-color: #f9fafb !important;
                    cursor: default !important;
                    opacity: 1 !important;
                    color: #374151 !important;
                }
            `,
                }}
            />
            <h1 onClick={() => navigate(-1)} className="flex items-center gap-2 cursor-pointer text-2xl font-semibold text-gray-900">
                <ArrowLeft /> View Driver Profile
            </h1>

            <div className="border rounded-xl py-10 px-6 lg:px-32 bg-white shadow-sm relative">
                <div className="flex flex-col items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center border overflow-hidden relative shadow-inner">
                        {profileImage ? (
                            <img src={profileImage} className="w-full h-full object-cover" alt="Profile" />
                        ) : (
                            <Camera size={32} className="text-gray-400" />
                        )}
                    </div>
                    <p className="text-sm font-bold mt-3 text-gray-700">Profile Photo</p>
                </div>

                {/* PROFILE INFO / STATS */}
                <div className="text-center mt-6">
                    <div className="flex flex-wrap justify-center items-center gap-6 text-sm font-medium">
                        <div className="flex items-center gap-1.5 px-4 py-1.5 bg-[#FFFAE6] rounded-full border border-yellow-200 shadow-sm">
                            <Star className="text-yellow-500 fill-yellow-500" size={18} />
                            <span className="text-gray-800 font-semibold uppercase tracking-wide">
                                {driverResponse?.data?.formattedAverage ?? 0} / 5 Rating
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-4 py-1.5 bg-[#F0F7FF] rounded-full border border-blue-200 shadow-sm">
                            <Medal className="text-blue-500" size={18} />
                            <span className="text-gray-800 font-semibold uppercase tracking-wide">
                                {driverResponse?.data?.rank || watch("driver_rank") || "NO RANK"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-4 py-1.5 bg-[#F6FFF6] rounded-full border border-green-200 shadow-sm">
                            <Wifi className="text-green-500" size={18} />
                            <span className="text-gray-800 font-semibold uppercase tracking-wide">
                                {driverResponse?.data?.completed_orders || 0} Orders
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-12 space-y-12">
                    {/* General Information */}
                    <div>
                        <SectionTitle>General Information</SectionTitle>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <InputWrapper label="Driver Name">
                                <Input {...register("raider_name")} readOnly />
                            </InputWrapper>
                            <InputWrapper label="Email Address">
                                <Input {...register("email_address")} readOnly />
                            </InputWrapper>
                            <InputWrapper label="Contact Number">
                                <PhoneInput value={watch("contact_number")} onChange={() => {}} disabled />
                            </InputWrapper>
                            <InputWrapper label="Date of Birth">
                                <Input type="date" {...register("dob")} readOnly />
                            </InputWrapper>
                            <InputWrapper label="Gender">
                                <select {...register("gender")} disabled className="w-full border bg-secondary rounded p-2 text-sm">
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </InputWrapper>
                            <InputWrapper label="Emergency Contact Name">
                                <Input {...register("emergency_contact_name")} readOnly />
                            </InputWrapper>
                            <InputWrapper label="Emergency Contact Number">
                                <PhoneInput value={watch("emergency_contact_number")} onChange={() => {}} disabled />
                            </InputWrapper>
                            <InputWrapper label="Driver Rank">
                                <Input {...register("driver_rank")} readOnly />
                            </InputWrapper>
                        </div>
                    </div>

                    {/* Identity Card */}
                    <div>
                        <SectionTitle>Identity Card</SectionTitle>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <InputWrapper label="NRIC Number">
                                <Input {...register("identity_card_number")} readOnly />
                            </InputWrapper>
                            <InputWrapper label="Issue Date">
                                <Input type="date" {...register("identity_card_issue_date")} readOnly />
                            </InputWrapper>
                        </div>
                    </div>

                    {/* Driving License */}
                    <div>
                        <SectionTitle>Driving License</SectionTitle>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <InputWrapper label="Driving License Number">
                                <Input {...register("driving_license_number")} readOnly />
                            </InputWrapper>
                            <InputWrapper label="Issue Date">
                                <Input type="date" {...register("driving_license_issue_date")} readOnly />
                            </InputWrapper>
                            <InputWrapper label="License Class">
                                <select {...register("license_class")} disabled className="w-full border bg-secondary rounded p-2 text-sm">
                                    <option value="">Select Class</option>
                                    {LICENSE_CLASSES.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </InputWrapper>
                        </div>
                    </div>

                    {/* Vehicle Details */}
                    <div>
                        <SectionTitle>Vehicle Details</SectionTitle>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <InputWrapper label="Vehicle Plate Number">
                                <Input {...register("vehicle_plate_number")} readOnly />
                            </InputWrapper>
                            <InputWrapper label="Vehicle Type">
                                <select {...register("vehicle_type_id")} disabled className="w-full border bg-secondary rounded p-2 text-sm">
                                    <option value="">Select Type</option>
                                    {vehicleTypesResponse?.data?.data?.map((v: any) => (
                                        <option key={v.id} value={String(v.id)}>{v.vehicle_name}</option>
                                    ))}
                                </select>
                            </InputWrapper>
                            <InputWrapper label="Vehicle Brand">
                                <Input {...register("vehicle_brand")} readOnly />
                            </InputWrapper>
                            <InputWrapper label="Vehicle Model">
                                <Input {...register("vehicle_model")} readOnly />
                            </InputWrapper>
                            <InputWrapper label="Registration Date">
                                <Input type="date" {...register("registration_date")} readOnly />
                            </InputWrapper>
                            <InputWrapper label="Chassis Number">
                                <Input {...register("chassis_number")} readOnly />
                            </InputWrapper>
                        </div>
                    </div>

                    {/* Vehicle Insurance Policy */}
                    <div>
                        <SectionTitle>Vehicle Insurance Policy</SectionTitle>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <InputWrapper label="Insurance Policy Number">
                                <Input {...register("insurance_policy_number")} readOnly />
                            </InputWrapper>
                            <InputWrapper label="Issue Date">
                                <Input type="date" {...register("insurance_issue_date")} readOnly />
                            </InputWrapper>
                            <InputWrapper label="Expiry Date">
                                <Input type="date" {...register("insurance_expiry_date")} readOnly />
                            </InputWrapper>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div>
                        <SectionTitle>Current Address</SectionTitle>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <InputWrapper label="Postal Code">
                                <Input {...register("current_postal_code")} readOnly />
                            </InputWrapper>
                            <InputWrapper label="Address">
                                <Input {...register("current_address")} readOnly />
                            </InputWrapper>
                            <InputWrapper label="Apartment / Unit / Suite / Floor">
                                <Input {...register("current_unit")} readOnly />
                            </InputWrapper>
                            <InputWrapper label="Country">
                                <select {...register("current_country")} disabled className="w-full border bg-secondary rounded p-2 text-sm">
                                    {COUNTRIES.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </InputWrapper>
                        </div>

                        <div className="mt-10">
                            <SectionTitle>Permanent Address</SectionTitle>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <InputWrapper label="Postal Code">
                                    <Input {...register("permanent_postal_code")} readOnly />
                                </InputWrapper>
                                <InputWrapper label="Address">
                                    <Input {...register("permanent_address")} readOnly />
                                </InputWrapper>
                                <InputWrapper label="Apartment / Unit / Suite / Floor">
                                    <Input {...register("permanent_unit")} readOnly />
                                </InputWrapper>
                                <InputWrapper label="Country">
                                    <select {...register("permanent_country")} disabled className="w-full border bg-secondary rounded p-2 text-sm">
                                        {COUNTRIES.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </InputWrapper>
                            </div>
                        </div>
                    </div>

                    {/* Bank Details */}
                    <div>
                        <SectionTitle>Bank Details</SectionTitle>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <InputWrapper label="Bank Name">
                                <Input {...register("bank_name")} readOnly />
                            </InputWrapper>
                            <InputWrapper label="Account Number">
                                <Input {...register("account_number")} readOnly />
                            </InputWrapper>
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="space-y-12">
                         <div>
                            <SectionTitle>Identity Card Documents</SectionTitle>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <ViewImage label="NRIC Front" url={documentUrls.nricFront} />
                                <ViewImage label="NRIC Back" url={documentUrls.nricBack} />
                            </div>
                        </div>
                        <div>
                            <SectionTitle>Driving License Documents</SectionTitle>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <ViewImage label="Driving License Front" url={documentUrls.licenseFront} />
                                <ViewImage label="Driving License Back" url={documentUrls.licenseBack} />
                            </div>
                        </div>
                        <div>
                            <SectionTitle>Vehicle Photos</SectionTitle>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <ViewImage label="Front View of Vehicle" url={documentUrls.vehicleFront} />
                                <ViewImage label="Rear View of Vehicle" url={documentUrls.vehicleRear} />
                                <ViewImage label="Driver Side View" url={documentUrls.driverSide} />
                                <ViewImage label="Passenger Side View" url={documentUrls.passengerSide} />
                            </div>
                        </div>
                        <div>
                            <SectionTitle>Vehicle Documents</SectionTitle>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <ViewImage label="Vehicle Log Card" url={documentUrls.vehicleLog} />
                                <ViewImage label="Insurance Policy" url={documentUrls.insurancePolicy} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-12 pb-6">
                    <Button
                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-12 py-3 text-lg rounded-xl shadow-md transition-all hover:shadow-lg active:scale-95"
                        onClick={() => navigate(-1)}
                    >
                        Close Preview
                    </Button>
                </div>
            </div>
        </div>
    );
}