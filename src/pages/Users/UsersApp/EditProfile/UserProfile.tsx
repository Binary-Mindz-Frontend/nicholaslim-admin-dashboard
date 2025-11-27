"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Camera, Star, Files, Rss } from "lucide-react";

// ------------------ TYPES ------------------
export interface UserProfileType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  emergencyContact: string;
  driverId: string;
  address: string;
  city: string;
  state: string;
  postal: string;
  rating: number;
  followers: number;
  deliveries: number;
  cancellations: number;
  incentives: string;

  drivingLicense: string;
  dlIssueDate: string;
  dlExpiryDate: string;

  vehiclePlate1: string;
  vehicleType: string;
  vehiclePlate2: string;
  model: string;
  registrationDate: string;
  vehicleLog: string;
  vehicleIssueDate: string;
  vehicleExpiryDate: string;

  policyNumber: string;
  policyIssue: string;
  policyExpiry: string;

  bank: string;
  accountNumber: string;
}

export default function UserProfile() {
  const { id } = useParams();

  const [formData, setFormData] = useState<UserProfileType | null>(null);

  // IMAGE STATE
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // --------- No backend: DUMMY DATA ----------
  useEffect(() => {
    if (!id) return;

    const fakeUser: UserProfileType = {
      id: id,
      firstName: "User",
      lastName: id,
      email: `${id.toLowerCase()}@gmail.com`,
      phone: "+8801*********",
      dob: "1995-04-10",
      gender: "Male",
      emergencyContact: "+88017********",
      driverId: "D" + id,
      address: "Dhaka, Bangladesh",
      city: "Dhaka",
      state: "BD",
      postal: "1207",
      rating: 4.7,
      followers: 250,
      deliveries: 540,
      cancellations: 12,
      incentives: "৳8500",

      drivingLicense: "668 885***",
      dlIssueDate: "20/10/2020",
      dlExpiryDate: "20/10/2025",

      vehiclePlate1: "SNL2665P",
      vehicleType: "Car",
      vehiclePlate2: "SNL2665P",
      model: "Corolla Touring SE",
      registrationDate: "20/10/2024",
      vehicleLog: "486******",
      vehicleIssueDate: "20/10/2024",
      vehicleExpiryDate: "20/10/2026",

      policyNumber: "635******",
      policyIssue: "20/10/2024",
      policyExpiry: "20/10/2026",

      bank: "Standard Chartered",
      accountNumber: "555********",
    };

    setFormData(fakeUser);
  }, [id]);

  if (!formData) return <p className="text-center mt-10">Loading user...</p>;

  // IMAGE UPLOAD HANDLER
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageURL = URL.createObjectURL(file);
    setProfileImage(imageURL);
  };

  // ---- FORM HANDLER ----
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof UserProfileType;
    const value = e.target.value;

    setFormData((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, [name]: value } as UserProfileType;
      return updated;
    });
  };

  const handleEdit = () => console.log("Updated User:", formData);
  const handleDelete = () => console.log("User Deleted:", id);

  const getStringValue = (key: keyof UserProfileType): string =>
    String(formData[key] ?? "");

  // FIELD LISTS
  const baseFields = [
    ["firstName", "First Name"],
    ["lastName", "Last Name"],
    ["email", "Email Address"],
    ["phone", "Phone Number"],
    ["dob", "Date of Birth"],
    ["gender", "Gender"],
    ["emergencyContact", "Emergency Contact"],
    ["driverId", "Driver ID"],
    ["address", "Address"],
    ["city", "City"],
    ["state", "State"],
    ["postal", "Zip / Postal Code"],
  ] as Array<[keyof UserProfileType, string]>;

  const drivingLicenseFields = [
    ["drivingLicense", "Driving License Number"],
    ["dlIssueDate", "Issue Date"],
    ["dlExpiryDate", "Expiry Date"],
  ] as Array<[keyof UserProfileType, string]>;

  const vehicleFields = [
    ["vehiclePlate1", "Vehicle Number Plate"],
    ["vehicleType", "Vehicle Type"],
    ["vehiclePlate2", "Vehicle Number Plate"],
    ["model", "Model"],
    ["registrationDate", "Registration Date"],
    ["vehicleLog", "Vehicle Log Number"],
    ["vehicleIssueDate", "Issue Date"],
    ["vehicleExpiryDate", "Expiry Date"],
  ] as Array<[keyof UserProfileType, string]>;

  const insuranceFields = [
    ["policyNumber", "Vehicle Policy Number"],
    ["policyIssue", "Issue Date"],
    ["policyExpiry", "Expiry Date"],
  ] as Array<[keyof UserProfileType, string]>;

  const bankFields = [
    ["bank", "Bank"],
    ["accountNumber", "Account Number"],
  ] as Array<[keyof UserProfileType, string]>;

  return (
    <div className="sm:p-6 mx-auto space-y-6 bg-[#F5F7FA]">
      <h1 className="text-2xl font-semibold text-gray-900">User Profile</h1>

      <div className="border rounded-xl py-10 px-6 lg:px-32 bg-white shadow-sm relative">
        {/* UPLOAD / DOWNLOAD */}
        <div className="absolute top-6 right-6 flex gap-3">
          <Button variant="outline" className="flex gap-2 text-black">
            <Files size={16} /> Upload
          </Button>
          <Button variant="outline" className="flex gap-2 text-black">
            <Files size={16} /> Download
          </Button>
        </div>

        {/* PROFILE IMAGE */}
        <div className="flex justify-center">
          <label className="cursor-pointer">
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border overflow-hidden">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="text-gray-500" size={32} />
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>

        {/* RATING */}
        <div className="text-center mt-4">
          <p className="flex justify-center items-center gap-2 text-lg font-medium">
            <Star className="text-yellow-500" size={20} />
            {formData.rating}/5 <Rss />
            <span className="text-gray-700">{formData.followers} Followers</span>
          </p>
          <p className="mt-1 text-gray-800 font-medium">
            Total Deliveries : {formData.deliveries}
          </p>
          <p className="text-red-500 font-medium">
            Total Cancellations : {formData.cancellations}
          </p>
          <p className="text-gray-800 font-medium">
            Total Incentives : {formData.incentives}
          </p>
        </div>

        {/* MAIN FORM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
          {baseFields.map(([key, label]) => (
            <div key={key}>
              <Label>{label}</Label>
              <Input name={key} value={getStringValue(key)} onChange={handleChange} />
            </div>
          ))}

          {drivingLicenseFields.map(([key, label]) => (
            <div key={key}>
              <Label>{label}</Label>
              <Input name={key} value={getStringValue(key)} onChange={handleChange} />
            </div>
          ))}

          {vehicleFields.map(([key, label]) => (
            <div key={key}>
              <Label>{label}</Label>
              <Input name={key} value={getStringValue(key)} onChange={handleChange} />
            </div>
          ))}

          {insuranceFields.map(([key, label]) => (
            <div key={key}>
              <Label>{label}</Label>
              <Input name={key} value={getStringValue(key)} onChange={handleChange} />
            </div>
          ))}

          {bankFields.map(([key, label]) => (
            <div key={key}>
              <Label>{label}</Label>
              <Input name={key} value={getStringValue(key)} onChange={handleChange} />
            </div>
          ))}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col justify-center gap-4 mt-10">
          <Button
            className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-10 py-5 text-lg rounded-lg self-center"
            onClick={handleEdit}
          >
            Edit Profile
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-semibold px-10 py-5 text-lg rounded-lg self-center">
                Delete Account
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Profile?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500"
                  onClick={handleDelete}
                >
                  Confirm Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
