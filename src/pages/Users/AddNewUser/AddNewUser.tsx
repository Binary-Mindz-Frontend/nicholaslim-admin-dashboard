import React, { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddUserTypeMutation } from "@/redux/features/usersTypes/usersTypesApi"; // Import the mutation
import toast from "react-hot-toast";

// ---------------------- ZOD SCHEMA ----------------------
const userSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),

  phone: z.string().min(1, { message: "Phone is required" }),
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
      fullName: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  // ---------------------- ADD USER MUTATION ----------------------
  const [addUser, { isLoading }] = useAddUserTypeMutation();

  // ---------------------- ON SUBMIT ----------------------
  const onSubmit = async (data: FormData) => {
    console.log("Form Submitted:", data);
    console.log("Photo:", photo);

    try {
      // Prepare the new user data
      const newUser = {
        username: data.fullName.trim().replace(/\s+/g, "_"), // Convert full name to username format
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: "USER", // Always send the role as "USER"
      };

      // Call the addUser mutation to create the user
      const response = await addUser(newUser).unwrap();

      // Show success message
      toast.success("User created successfully!");
      console.log("User created:", response);

      // Reset form
      reset();
      setPhoto(null);
    } catch (error) {
      // Show error message
      toast.error("Failed to create user. Please try again.");
      console.error("Error creating user:", error);
    }
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
          {/* FULL NAME + EMAIL (In one row for large screens) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
            <div>
              <label className="block text-gray-600 font-medium mb-2">Full Name</label>
              <input
                {...register("fullName")}
                placeholder="Enter full name"
                className={`w-full px-4 py-3 bg-yellow-50 border-0 rounded text-gray-700 focus:ring-2 ${errors.fullName ? "focus:ring-red-400 ring-2 ring-red-400" : "focus:ring-white"
                  }`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-2">Email Address</label>
              <input
                {...register("email")}
                type="email"
                placeholder="Enter email"
                className={`w-full px-4 py-3 bg-yellow-50 border-0 rounded text-gray-700 focus:ring-2 ${errors.email ? "focus:ring-red-400 ring-2 ring-red-400" : "focus:ring-white"
                  }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* PHONE + PASSWORD (In one row for large screens) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
            <div>
              <label className="block text-gray-600 font-medium mb-2">Phone Number</label>
              <input
                {...register("phone")}
                placeholder="Enter phone number"
                className={`w-full px-4 py-3 bg-yellow-50 border-0 rounded text-gray-700 focus:ring-2 ${errors.phone ? "focus:ring-red-400 ring-2 ring-red-400" : "focus:ring-white"
                  }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-2">Password</label>
              <input
                {...register("password")}
                type="password"
                placeholder="Enter Password"
                className={`w-full px-4 py-3 bg-yellow-50 border-0 rounded text-gray-700 focus:ring-2 ${errors.password ? "focus:ring-red-400 ring-2 ring-red-400" : "focus:ring-white"
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
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? "Adding..." : "Add Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
