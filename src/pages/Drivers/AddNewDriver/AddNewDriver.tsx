"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";

import {
  userProfileSchema,
  UserProfileType,
} from "../DriverList/EditDriverProfile/userProfile.schema";

import UploadBox from "./components/UploadBox";

export default function AddNewDriver() {
  const { id } = useParams();

  // ⭐ Profile Image State + Preview
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  // ⭐ Document Upload States
  const [documents, setDocuments] = useState({
    nidFront: null as File | null,
    nidBack: null as File | null,
    licenseFront: null as File | null,
    licenseBack: null as File | null,
    vehicleFront: null as File | null,
    vehicleBack: null as File | null,
    driverSide: null as File | null,
    passengerSide: null as File | null,
    vehicleLog: null as File | null,
    vehiclePolicy: null as File | null,
  });

  // ⭐ Form Setup
  const form = useForm<UserProfileType>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {} as UserProfileType,
  });

  const { register, handleSubmit, reset, formState } = form;

  // ⭐ Load Fake Example Data (for demo)
  useEffect(() => {
    if (!id) return;

    const fakeUser: UserProfileType = {
      id,
      firstName: "Henry",
      lastName: "Johnson",
      email: "henry@gmail.com",
      phone: "01700000000",
      dob: "2000-07-26",
      gender: "Male",
      emergencyContact: "01987654321",
      driverId: "DRV-001",

      address: "House #10, Road #3",
      city: "Dhaka",
      state: "Dhaka",
      postal: "1207",

      rating: "4.8",
      followers: "150",
      deliveries: "250",
      cancellations: "2",
      incentives: "20000",

      drivingLicense: "DL-123456789",
      dlIssueDate: "2022-01-01",
      dlExpiryDate: "2030-01-01",

      vehiclePlate1: "DHAKA METRO",
      vehicleType: "Bike",
      vehiclePlate2: "22-12345",
      model: "Yamaha FZS",
      registrationDate: "2021-01-01",
      vehicleLog: "LOG-54544",
      vehicleIssueDate: "2021-02-01",
      vehicleExpiryDate: "2030-02-01",

      policyNumber: "POL-5542",
      policyIssue: "2021-05-01",
      policyExpiry: "2031-05-01",

      bank: "DBBL",
      accountNumber: "1234567890123",
    };

    reset(fakeUser);
  }, [id, reset]);

  // ⭐ Profile Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    setProfileImageFile(file);
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  // ⭐ Document Upload
  const handleDocumentChange = (key: string, file: File | null) => {
    setDocuments((prev) => ({ ...prev, [key]: file }));
  };

  // ⭐ On Submit → Console everything
  const onSubmit = (data: UserProfileType) => {
    console.log("📌 FORM DATA:", data);
    console.log("📌 PROFILE IMAGE:", profileImageFile);
    console.log("📌 DOCUMENT FILES:", documents);
    alert("Check console — all form/preview data logged!");
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

  // All Fields
  const allFields: { key: keyof UserProfileType; label: string }[] = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email Address" },
    { key: "phone", label: "Phone Number" },
    { key: "dob", label: "Date of Birth" },
    { key: "gender", label: "Gender" },
    { key: "emergencyContact", label: "Emergency Contact" },
    { key: "driverId", label: "Driver ID" },

    { key: "address", label: "Address" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "postal", label: "Postal Code" },

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

  const isDateField = (field: string) =>
    field.toLowerCase().includes("date") || field.includes("dob");

  return (
    <div className="px-8 sm:p-6 mx-auto space-y-6 bg-[#F5F7FA]">
      <h1 className="text-2xl font-semibold text-gray-900 pt-2 sm:pt-0">Add New Driver</h1>

      <div className="border rounded-xl py-10 px-6 lg:px-32 bg-white shadow-sm relative">
        
        {/* ⭐ Profile Image */}
        <div className="flex justify-center">
          <label className="cursor-pointer mt-8 sm:mt-0">
            <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center border overflow-hidden">
              {profilePreview ? (
                <img
                  src={profilePreview}
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

        {/* ⭐ Form Fields */}
        <div className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {allFields.map(({ key, label }) => (
              <div key={key}>
                <Label className="text-sm font-semibold pb-2">{label}</Label>

                {/* Gender */}
                {key === "gender" && (
                  <select {...register(key)} className="w-full border bg-secondary rounded p-2">
                    {genderOptions.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                )}

                {/* State */}
                {key === "state" && (
                  <select {...register(key)} className="w-full border bg-secondary rounded p-2">
                    {stateOptions.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                )}

                {/* Vehicle Type */}
                {key === "vehicleType" && (
                  <select {...register(key)} className="w-full border bg-secondary rounded p-2">
                    {vehicleTypes.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                )}

                {/* Bank */}
                {key === "bank" && (
                  <select {...register(key)} className="w-full border bg-secondary rounded p-2">
                    {bankOptions.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                )}

                {/* Date Fields */}
                {isDateField(key) &&
                  !["gender", "state", "vehicleType", "bank"].includes(key) && (
                    <input
                      type="date"
                      {...register(key)}
                      className="w-full border bg-secondary rounded p-2"
                    />
                  )}

                {/* Normal Input */}
                {!["gender", "state", "vehicleType", "bank"].includes(key) &&
                  !isDateField(key) && (
                    <Input className="bg-secondary rounded" {...register(key)} />
                  )}

                {formState.errors[key] && (
                  <p className="text-red-500 text-xs mt-1">
                    {formState.errors[key]?.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ⭐ Document Upload Sections */}
        <div className="mt-10 space-y-10">

          {/* Identity Card */}
          <div>
            <h2 className="font-semibold text-lg">Personal Documents</h2>
            <p className="text-sm text-gray-600">Upload Your Identity Card</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <UploadBox
                label="Front side photo of your Identity card"
                onChange={(file) => handleDocumentChange("nidFront", file)}
              />
              <UploadBox
                label="Back side photo of your Identity card"
                onChange={(file) => handleDocumentChange("nidBack", file)}
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
              />
              <UploadBox
                label="Back of Driving License"
                onChange={(file) => handleDocumentChange("licenseBack", file)}
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
              />
              <UploadBox
                label="Vehicle Back Side"
                onChange={(file) => handleDocumentChange("vehicleBack", file)}
              />
              <UploadBox
                label="Driver Side"
                onChange={(file) => handleDocumentChange("driverSide", file)}
              />
              <UploadBox
                label="Passenger Side"
                onChange={(file) => handleDocumentChange("passengerSide", file)}
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
              />
              <UploadBox
                label="Vehicle Policy Photo"
                onChange={(file) => handleDocumentChange("vehiclePolicy", file)}
              />
            </div>
          </div>
        </div>

        {/* ⭐ Submit Button */}
        <div className="flex justify-center mt-10">
          <Button
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-10 py-5 text-lg rounded-lg"
            onClick={handleSubmit(onSubmit)}
          >
            Add Now
          </Button>
        </div>
      </div>
    </div>
  );
}
