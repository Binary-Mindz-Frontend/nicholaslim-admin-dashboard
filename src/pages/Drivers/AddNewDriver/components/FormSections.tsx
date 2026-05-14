/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import {
  SectionTitle,
  InputWrapper,
  Input,
  PhoneInput,
  LICENSE_CLASSES,
  COUNTRIES,
  PostalCodeField,
  DetectingAddressInput,
  UploadBox,
} from "./DriverFormShared";

export interface FormSectionProps {
  register: any;
  errors: any;
  watch: any;
  setValue: any;
  vehicleTypesResponse?: any;
  driverTiersResponse?: any;
}

export const GeneralInformation = ({
  register,
  errors,
  watch,
  setValue,
  driverTiersResponse,
}: FormSectionProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
  <>
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
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F2A735] hover:text-[#d98a1f]"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </InputWrapper>
      <InputWrapper
        label="Confirm Password"
        error={errors.confirm_password?.message}
      >
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirm_password", {
              validate: (value: string) =>
                value === watch("password") || "Passwords do not match",
            })}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F2A735] hover:text-[#d98a1f]"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </InputWrapper>
      <InputWrapper
        label="Contact Number*"
        error={errors.contact_number?.message}
      >
        <PhoneInput
          value={watch("contact_number")}
          onChange={(val) => {
            setValue("contact_number", val, { shouldValidate: true });
          }}
        />
        <input
          type="hidden"
          {...register("contact_number", {
            required: "Contact Number is required",
          })}
        />
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
            setValue("emergency_contact_number", val, {
              shouldValidate: true,
            });
          }}
        />
        <input
          type="hidden"
          {...register("emergency_contact_number", {
            required: "Emergency Contact Number is required",
          })}
        />
      </InputWrapper>
      <InputWrapper label="Driver Rank" error={errors.driver_rank?.message}>
        <select
          {...register("driver_rank")}
          className="w-full border bg-secondary rounded p-2 text-sm"
        >
          <option value="">Select Rank</option>
          {driverTiersResponse?.data?.map((tier: any) => (
            <option key={tier.id} value={tier.id}>
              {tier.name}
            </option>
          ))}
        </select>
      </InputWrapper>
    </div>
  </>
  );
};

export const IdentityCardSection = ({ register, errors }: FormSectionProps) => (
  <>
    <SectionTitle>Identity Card</SectionTitle>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <InputWrapper
        label="NRIC Number*"
        error={errors.identity_card_number?.message}
      >
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
  </>
);

export const DrivingLicenseSection = ({
  register,
  errors,
}: FormSectionProps) => (
  <>
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
      {/* <InputWrapper
        label="Expiry Date*"
        error={errors.driving_license_expire_date?.message}
      >
        <Input
          type="date"
          {...register("driving_license_expire_date", {
            required: "Expiry date is required",
          })}
        />
      </InputWrapper> */}
      <InputWrapper
        label="License Class*"
        error={errors.license_class?.message}
      >
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
  </>
);

export const VehicleDetailsSection = ({
  register,
  errors,
  vehicleTypesResponse,
}: FormSectionProps) => (
  <>
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
      <InputWrapper
        label="Vehicle Type*"
        error={errors.vehicle_type_id?.message}
      >
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
      <InputWrapper
        label="Vehicle Brand*"
        error={errors.vehicle_brand?.message}
      >
        <Input
          {...register("vehicle_brand", { required: "Brand is required" })}
        />
      </InputWrapper>
      <InputWrapper
        label="Vehicle Model*"
        error={errors.vehicle_model?.message}
      >
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
      <InputWrapper
        label="Chassis Number*"
        error={errors.chassis_number?.message}
      >
        <Input
          {...register("chassis_number", {
            required: "Chassis number is required",
          })}
        />
      </InputWrapper>
    </div>
  </>
);

export const VehicleLogCardSection = () => null;

export const VehicleInsurancePolicySection = ({
  register,
  errors,
}: FormSectionProps) => (
  <>
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
  </>
);

export interface AddressSectionProps extends FormSectionProps {
  setModalTarget: (target: string) => void;
}

export const AddressSection = ({
  register,
  errors,
  watch,
  setValue,
  setModalTarget,
}: AddressSectionProps) => (
  <>
    {/* Current Address */}
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
      <InputWrapper
        label="Apartment / Unit / Suite / Floor"
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

    <div className="flex items-center gap-2 mb-4 mt-8">
      <input
        type="checkbox"
        id="same_as_current"
        {...register("same_as_current")}
        className="w-4 h-4 text-yellow-500 rounded border-gray-300 focus:ring-yellow-500 cursor-pointer"
      />
      <label
        htmlFor="same_as_current"
        className="text-sm font-medium text-gray-700 cursor-pointer"
      >
        Same as Current Address
      </label>
    </div>

    {/* Permanent Address */}
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
      <InputWrapper
        label="Apartment / Unit / Suite / Floor"
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
  </>
);

export const BankInformationSection = ({
  register,
  errors,
}: FormSectionProps) => (
  <>
    <SectionTitle>Bank Details</SectionTitle>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <InputWrapper label="Bank Name" error={errors.bank_name?.message}>
        <Input {...register("bank_name")} />
      </InputWrapper>
      <InputWrapper label="Account Number" error={errors.account_number?.message}>
        <Input {...register("account_number")} />
      </InputWrapper>
    </div>
  </>
);

export interface DocumentUploadSectionProps {
  documentUrls: any;
  uploadingDocs: Set<string>;
  documentErrors: any;
  handleDocumentChange: (key: any, file: File | null) => void;
}

export const DocumentUploadSections = ({
  documentUrls,
  uploadingDocs,
  documentErrors,
  handleDocumentChange,
}: DocumentUploadSectionProps) => (
  <div className="mt-10 space-y-10">
    <div>
      <SectionTitle>Identity Card Documents*</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <UploadBox
          label="NRIC Front*"
          onChange={(file) => handleDocumentChange("nricFront", file)}
          isUploading={uploadingDocs.has("nricFront")}
          currentPreviewUrl={documentUrls.nricFront}
          error={documentErrors.nricFront}
        />
        <UploadBox
          label="NRIC Back*"
          onChange={(file) => handleDocumentChange("nricBack", file)}
          isUploading={uploadingDocs.has("nricBack")}
          currentPreviewUrl={documentUrls.nricBack}
          error={documentErrors.nricBack}
        />
      </div>
    </div>

    <div>
      <SectionTitle>Driving License Documents*</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <UploadBox
          label="Driving License Front*"
          onChange={(file) => handleDocumentChange("licenseFront", file)}
          isUploading={uploadingDocs.has("licenseFront")}
          currentPreviewUrl={documentUrls.licenseFront}
          error={documentErrors.licenseFront}
        />
        <UploadBox
          label="Driving License Back*"
          onChange={(file) => handleDocumentChange("licenseBack", file)}
          isUploading={uploadingDocs.has("licenseBack")}
          currentPreviewUrl={documentUrls.licenseBack}
          error={documentErrors.licenseBack}
        />
      </div>
    </div>

    <div>
      <SectionTitle>Vehicle Photos*</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <UploadBox
          label="Front View of Vehicle*"
          onChange={(file) => handleDocumentChange("vehicleFront", file)}
          isUploading={uploadingDocs.has("vehicleFront")}
          currentPreviewUrl={documentUrls.vehicleFront}
          error={documentErrors.vehicleFront}
        />
        <UploadBox
          label="Rear View of Vehicle*"
          onChange={(file) => handleDocumentChange("vehicleRear", file)}
          isUploading={uploadingDocs.has("vehicleRear")}
          currentPreviewUrl={documentUrls.vehicleRear}
          error={documentErrors.vehicleRear}
        />
        <UploadBox
          label="Driver Side View*"
          onChange={(file) => handleDocumentChange("driverSide", file)}
          isUploading={uploadingDocs.has("driverSide")}
          currentPreviewUrl={documentUrls.driverSide}
          error={documentErrors.driverSide}
        />
        <UploadBox
          label="Passenger Side View*"
          onChange={(file) => handleDocumentChange("passengerSide", file)}
          isUploading={uploadingDocs.has("passengerSide")}
          currentPreviewUrl={documentUrls.passengerSide}
          error={documentErrors.passengerSide}
        />
      </div>
    </div>

    <div>
      <SectionTitle>Vehicle Documents*</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <UploadBox
          label="Vehicle Log Card*"
          onChange={(f) => handleDocumentChange("vehicleLog", f)}
          currentPreviewUrl={documentUrls.vehicleLog}
          error={documentErrors.vehicleLog}
          isUploading={uploadingDocs.has("vehicleLog")}
          buttonText="Upload"
        />
        <UploadBox
          label="Insurance Policy*"
          onChange={(file) => handleDocumentChange("insurancePolicy", file)}
          isUploading={uploadingDocs.has("insurancePolicy")}
          currentPreviewUrl={documentUrls.insurancePolicy}
          error={documentErrors.insurancePolicy}
        />
      </div>
    </div>
  </div>
);
