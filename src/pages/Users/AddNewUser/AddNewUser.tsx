/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddUserTypeMutation } from "@/redux/features/usersTypes/usersTypesApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useGetRoleBasedAccessControlQuery } from "@/redux/features/roleBasedAccessControl/roleBasedAccessControlApi";

const userSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),
  phone: z.string().min(1, { message: "Phone is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  role: z.array(z.string()).min(1, { message: "At least one role is required" }),
});

type FormData = z.infer<typeof userSchema>;

export default function AddNewUser() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      role: [],
    },
  });

  const [addUser, { isLoading }] = useAddUserTypeMutation();
  const { data: rolesResponse, isLoading: rolesLoading } = useGetRoleBasedAccessControlQuery("");

  const roles = rolesResponse || [];

  const onSubmit = async (data: FormData) => {
    if (!data.fullName || !data.email || !data.phone || !data.password || !data.role) {
      toast.error("Please fill in all required fields.");
      return;
    }

    toast.loading("Creating user...");
    try {
      const newUser = {
  username: data.fullName.trim().replace(/\s+/g, "_"),
  email: data.email,
  phone: data.phone,
  password: data.password,
  role_name: data.role[0], // First selected role
  custom_role_name: data.role.slice(), // Rest of the roles as array
};
console.log("Submitting data:", newUser); // Add this line
console.log("Selected roles:", data.role);

      const response = await addUser(newUser).unwrap();

      if (!response.success) {
        toast.dismiss();
        toast.error(response.message || "Failed to create user. Please try again.");
        return;
      }
      toast.dismiss();
      toast.success("User created successfully!");
      reset();
      setPhoto(null);
      setSelectedRoles([]);
      navigate("/users-web-portal");
    } catch (error) {
      toast.dismiss();
      console.error("Failed to create user:", error);
      toast.error("Failed to create user. Please try again.");
    }
  };

  const handlePhotoClick = () => fileInputRef.current?.click();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRoleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRole = e.target.value;
    if (selectedRole && !selectedRoles.includes(selectedRole)) {
      const newRoles = [...selectedRoles, selectedRole];
      setSelectedRoles(newRoles);
      setValue("role", newRoles);
    }
    e.target.value = ""; // Reset dropdown
  };

  const handleRemoveRole = (roleToRemove: string) => {
    const newRoles = selectedRoles.filter(role => role !== roleToRemove);
    setSelectedRoles(newRoles);
    setValue("role", newRoles);
  };

  return (
    <div className="px-8 min-h-screen bg-gray-50 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-8 pt-4 sm:pt-0">
        Add New User
      </h1>

      <div className="bg-white rounded-lg shadow-sm p-4 lg:p-32">
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
              <img
                src={photo}
                className="w-full h-full object-cover"
                alt="Preview"
              />
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-8 mb-8">
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Full Name
              </label>
              <input
                {...register("fullName")}
                placeholder="Enter full name"
                className={`w-full px-4 py-3 bg-yellow-50 border-0 rounded text-gray-700 outline-none transition-all focus:ring-2 ${errors.fullName
                  ? "focus:ring-red-400 ring-2 ring-red-400"
                  : "focus:ring-yellow-200"
                  }`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="Enter email"
                className={`w-full px-4 py-3 bg-yellow-50 border-0 rounded text-gray-700 outline-none transition-all focus:ring-2 ${errors.email
                  ? "focus:ring-red-400 ring-2 ring-red-400"
                  : "focus:ring-yellow-200"
                  }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 mb-12">
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Phone Number
              </label>
              <input
                {...register("phone")}
                placeholder="Enter phone number"
                className={`w-full px-4 py-3 bg-yellow-50 border-0 rounded text-gray-700 outline-none transition-all focus:ring-2 ${errors.phone
                  ? "focus:ring-red-400 ring-2 ring-red-400"
                  : "focus:ring-yellow-200"
                  }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="Enter Password"
                className={`w-full px-4 py-3 bg-yellow-50 border-0 rounded text-gray-700 outline-none transition-all focus:ring-2 ${errors.password
                  ? "focus:ring-red-400 ring-2 ring-red-400"
                  : "focus:ring-yellow-200"
                  }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-2">Role</label>

              <select
                onChange={handleRoleSelect}
                className={`w-full px-4 py-3 bg-yellow-50 border-0 rounded text-gray-700 outline-none transition-all focus:ring-2 ${errors.role
                    ? "focus:ring-red-400 ring-2 ring-red-400"
                    : "focus:ring-yellow-200"
                  }`}
                disabled={rolesLoading}
              >
                <option value="">Select Role</option>
                {roles.map((role: any) => (
                  <option key={role.id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>

              {/* Selected roles display */}
              {selectedRoles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedRoles.map((role) => (
                    <div
                      key={role}
                      className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 rounded-full text-sm font-medium text-gray-700"
                    >
                      {role}
                      <button
                        type="button"
                        onClick={() => handleRemoveRole(role)}
                        className="hover:text-red-600 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {errors.role && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.role.message}
                </p>
              )}
              {rolesLoading && (
                <p className="text-gray-500 text-sm mt-1">Loading roles...</p>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-12 py-3 bg-yellow-400 font-bold text-black rounded hover:bg-yellow-500"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}