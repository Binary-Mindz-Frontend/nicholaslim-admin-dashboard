"use client";

import React, { useRef, useState } from "react";
import { Camera, ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ---------------------- ZOD SCHEMA ----------------------
const userSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),

  phone: z.string().min(1, { message: "Phone is required" }),
  role: z.string().min(1, { message: "Role is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});



type FormData = z.infer<typeof userSchema>;

export default function AddNewUser() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  // ---------------------- REACT HOOK FORM ----------------------
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "Finance",
      password: "",
    },
  });

  // ---------------------- ON SUBMIT ----------------------
  const onSubmit = (data: FormData) => {
    console.log("Form Submitted:", data);
    console.log("Photo:", photo);

    reset();
    setPhoto(null);
  };

  // ---------------------- PHOTO UPLOAD ----------------------
  const handlePhotoClick = () => fileInputRef.current?.click();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="px-8 min-h-screen bg-gray-50 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-8 pt-4 sm:pt-0">Add New User</h1>

      <div className="bg-white rounded-lg shadow-sm p-4 lg:p-32">
        {/* ---------------------- PHOTO SECTION ---------------------- */}
        <div className="flex flex-col items-center mb-12">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handlePhotoChange}
          />

          <div
            onClick={handlePhotoClick}
            className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mb-3 cursor-pointer hover:bg-yellow-100 overflow-hidden"
          >
            {photo ? (
              <img src={photo} className="w-full h-full object-cover" alt="Preview" />
            ) : (
              <Camera className="w-8 h-8 text-gray-400" />
            )}
          </div>

          <p
            className="text-gray-800 font-medium cursor-pointer hover:text-gray-600"
            onClick={handlePhotoClick}
          >
            Upload Photo
          </p>
        </div>

        {/* ---------------------- FORM ---------------------- */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* FIRST + LAST NAME */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
            {/* FIRST */}
            <div>
              <label className="block text-gray-600 font-medium mb-2">First Name</label>
              <input
                {...register("firstName")}
                placeholder="Enter first name"
                className={`w-full px-4 py-3 bg-yellow-50 border-0 rounded text-gray-700 focus:ring-2 ${
                  errors.firstName ? "focus:ring-red-400 ring-2 ring-red-400" : "focus:ring-yellow-400"
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>

            {/* LAST */}
            <div>
              <label className="block text-gray-600 font-medium mb-2">Last Name</label>
              <input
                {...register("lastName")}
                placeholder="Enter last name"
                className={`w-full px-4 py-3 bg-yellow-50 border-0 rounded text-gray-700 focus:ring-2 ${
                  errors.lastName ? "focus:ring-red-400 ring-2 ring-red-400" : "focus:ring-yellow-400"
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* EMAIL + PHONE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
            {/* EMAIL */}
            <div>
              <label className="block text-gray-600 font-medium mb-2">Email Address</label>
              <input
                {...register("email")}
                type="email"
                placeholder="Enter email"
                className={`w-full px-4 py-3 bg-yellow-50 border-0 rounded text-gray-700 focus:ring-2 ${
                  errors.email ? "focus:ring-red-400 ring-2 ring-red-400" : "focus:ring-yellow-400"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-gray-600 font-medium mb-2">Phone Number</label>
              <input
                {...register("phone")}
                placeholder="Enter phone number"
                className={`w-full px-4 py-3 bg-yellow-50 border-0 rounded text-gray-700 focus:ring-2 ${
                  errors.phone ? "focus:ring-red-400 ring-2 ring-red-400" : "focus:ring-yellow-400"
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* ROLE + PASSWORD */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
            {/* ROLE */}
            <div>
              <label className="block text-gray-600 font-medium mb-2">Role Name</label>
              <div className="relative">
                <select
                  {...register("role")}
                  className={`w-full px-4 py-3 bg-yellow-50 border-0 rounded text-gray-700 appearance-none focus:ring-2 cursor-pointer ${
                    errors.role ? "focus:ring-red-400 ring-2 ring-red-400" : "focus:ring-yellow-400"
                  }`}
                >
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                </select>

                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700 pointer-events-none" />
              </div>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-gray-600 font-medium mb-2">Password</label>
              <input
                {...register("password")}
                type="password"
                placeholder="Enter Password"
                className={`w-full px-4 py-3 bg-yellow-50 border-0 rounded text-gray-700 focus:ring-2 ${
                  errors.password ? "focus:ring-red-400 ring-2 ring-red-400" : "focus:ring-yellow-400"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-12 py-3 bg-yellow-400 font-bold text-black rounded hover:bg-yellow-500"
            >
              Add Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
