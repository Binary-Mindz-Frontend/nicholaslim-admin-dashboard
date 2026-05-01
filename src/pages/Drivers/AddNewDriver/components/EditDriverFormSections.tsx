/* eslint-disable @typescript-eslint/no-explicit-any */
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
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email",
            },
          })}
        />
      </InputWrapper>
      <InputWrapper
        label="Contact Number*"
        error={errors.contact_number?.message}
      >
        <PhoneInput
          value={watch("contact_number")}
          onChange={(v) => setValue("contact_number", v, { shouldValidate: true })}
        />
        <input
          type="hidden"
          {...register("contact_number", { required: "Required" })}
        />
      </InputWrapper>
      <InputWrapper label="Date of Birth*" error={errors.dob?.message}>
        <Input type="date" {...register("dob", { required: "Required" })} />
      </InputWrapper>
      <InputWrapper label="Select Gender*" error={errors.gender?.message}>
        <select
          {...register("gender", { required: "Required" })}
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
          {...register("emergency_contact_name", { required: "Required" })}
        />
      </InputWrapper>
      <InputWrapper
        label="Emergency Contact Number*"
        error={errors.emergency_contact_number?.message}
      >
        <PhoneInput
          value={watch("emergency_contact_number")}
          onChange={(v) =>
            setValue("emergency_contact_number", v, { shouldValidate: true })
          }
        />
        <input
          type="hidden"
          {...register("emergency_contact_number", { required: "Required" })}
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
          {...register("identity_card_number", { required: "Required" })}
        />
      </InputWrapper>
      <InputWrapper
        label="Issue Date*"
        error={errors.identity_card_issue_date?.message}
      >
        <Input
          type="date"
          {...register("identity_card_issue_date", { required: "Required" })}
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
          {...register("driving_license_number", { required: "Required" })}
        />
      </InputWrapper>
      <InputWrapper
        label="Issue Date*"
        error={errors.driving_license_issue_date?.message}
      >
        <Input
          type="date"
          {...register("driving_license_issue_date", { required: "Required" })}
        />
      </InputWrapper>
      {/* <InputWrapper
        label="Expiry Date*"
        error={errors.driving_license_expire_date?.message}
      >
        <Input
          type="date"
          {...register("driving_license_expire_date", { required: "Required" })}
        />
      </InputWrapper> */}
      <InputWrapper
        label="License Class*"
        error={errors.license_class?.message}
      >
        <select
          {...register("license_class", { required: "Required" })}
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
          {...register("vehicle_plate_number", { required: "Required" })}
        />
      </InputWrapper>
      <InputWrapper
        label="Vehicle Type*"
        error={errors.vehicle_type_id?.message}
      >
        <select
          {...register("vehicle_type_id", { required: "Required" })}
          className="w-full border bg-secondary rounded p-2 text-sm"
        >
          <option value="">Select Type</option>
          {vehicleTypesResponse?.data?.data?.map((v: any) => (
            <option key={v.id} value={String(v.id)}>
              {v.vehicle_name}
            </option>
          ))}
        </select>
      </InputWrapper>
      <InputWrapper
        label="Vehicle Brand*"
        error={errors.vehicle_brand?.message}
      >
        <Input {...register("vehicle_brand", { required: "Required" })} />
      </InputWrapper>
      <InputWrapper
        label="Vehicle Model*"
        error={errors.vehicle_model?.message}
      >
        <Input {...register("vehicle_model", { required: "Required" })} />
      </InputWrapper>
      <InputWrapper
        label="Registration Date*"
        error={errors.registration_date?.message}
      >
        <Input
          type="date"
          {...register("registration_date", { required: "Required" })}
        />
      </InputWrapper>
      <InputWrapper
        label="Chassis Number*"
        error={errors.chassis_number?.message}
      >
        <Input {...register("chassis_number", { required: "Required" })} />
      </InputWrapper>
    </div>
  </>
);

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
          {...register("insurance_policy_number", { required: "Required" })}
        />
      </InputWrapper>
      <InputWrapper
        label="Issue Date*"
        error={errors.insurance_issue_date?.message}
      >
        <Input
          type="date"
          {...register("insurance_issue_date", { required: "Required" })}
        />
      </InputWrapper>
      <InputWrapper
        label="Expiry Date*"
        error={errors.insurance_expiry_date?.message}
      >
        <Input
          type="date"
          {...register("insurance_expiry_date", { required: "Required" })}
        />
      </InputWrapper>
    </div>
  </>
);

export interface AddressSectionProps extends FormSectionProps {
  setModalTarget: (target: any) => void;
}

export const AddressSection = ({
  register,
  errors,
  watch,
  setValue,
  setModalTarget,
}: AddressSectionProps) => (
  <>
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
}: FormSectionProps) => (
  <>
    <SectionTitle>Bank Details</SectionTitle>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <InputWrapper label="Bank Name">
        <Input {...register("bank_name")} />
      </InputWrapper>
      <InputWrapper label="Account Number">
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
          onChange={(f) => handleDocumentChange("nricFront", f)}
          currentPreviewUrl={documentUrls.nricFront}
          error={documentErrors.nricFront}
          isUploading={uploadingDocs.has("nricFront")}
        />
        <UploadBox
          label="NRIC Back*"
          onChange={(f) => handleDocumentChange("nricBack", f)}
          currentPreviewUrl={documentUrls.nricBack}
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
          currentPreviewUrl={documentUrls.licenseFront}
          error={documentErrors.licenseFront}
          isUploading={uploadingDocs.has("licenseFront")}
        />
        <UploadBox
          label="Driving License Back*"
          onChange={(f) => handleDocumentChange("licenseBack", f)}
          currentPreviewUrl={documentUrls.licenseBack}
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
          currentPreviewUrl={documentUrls.vehicleFront}
          error={documentErrors.vehicleFront}
          isUploading={uploadingDocs.has("vehicleFront")}
        />
        <UploadBox
          label="Rear View of Vehicle*"
          onChange={(f) => handleDocumentChange("vehicleRear", f)}
          currentPreviewUrl={documentUrls.vehicleRear}
          error={documentErrors.vehicleRear}
          isUploading={uploadingDocs.has("vehicleRear")}
        />
        <UploadBox
          label="Driver Side View*"
          onChange={(f) => handleDocumentChange("driverSide", f)}
          currentPreviewUrl={documentUrls.driverSide}
          error={documentErrors.driverSide}
          isUploading={uploadingDocs.has("driverSide")}
        />
        <UploadBox
          label="Passenger Side View*"
          onChange={(f) => handleDocumentChange("passengerSide", f)}
          currentPreviewUrl={documentUrls.passengerSide}
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
          currentPreviewUrl={documentUrls.vehicleLog}
          error={documentErrors.vehicleLog}
          isUploading={uploadingDocs.has("vehicleLog")}
          buttonText="Upload"
        />
        <UploadBox
          label="Insurance Policy*"
          onChange={(f) => handleDocumentChange("insurancePolicy", f)}
          currentPreviewUrl={documentUrls.insurancePolicy}
          error={documentErrors.insurancePolicy}
          isUploading={uploadingDocs.has("insurancePolicy")}
          buttonText="Upload"
        />
      </div>
    </div>
  </div>
);
