/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddUserTypeMutation, useLazyCheckUsernameQuery } from "@/redux/features/usersTypes/usersTypesApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useGetRoleBasedAccessControlQuery } from "@/redux/features/roleBasedAccessControl/roleBasedAccessControlApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const userSchema = z.object({
  fullName: z.string().min(1, { message: "Username is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),
  phone: z.string().min(1, { message: "Phone is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  role: z.array(z.string()).default([]),
});

type FormData = z.infer<typeof userSchema>;

// ------------------ PHONE INPUT COMPONENT ------------------
const COUNTRY_CODES = [
  { code: "+65", label: "🇸🇬 +65", country: "SG" },
  { code: "+60", label: "🇲🇾 +60", country: "MY" },
  { code: "+91", label: "🇮🇳 +91", country: "IN" },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: any;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

const PhoneInput = ({
  value,
  onChange,
  onBlur,
  placeholder = "XXXX XXXX",
  error,
  disabled,
}: PhoneInputProps) => {
  const selectedCountry =
    COUNTRY_CODES.find((c) => value.startsWith(c.code)) || COUNTRY_CODES[0];

  const localValue = value.startsWith(selectedCountry.code)
    ? value.slice(selectedCountry.code.length).trimStart()
    : value;

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value;
    onChange(`${newCode}${localValue ? " " + localValue : ""}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9\s]/g, "");
    onChange(`${selectedCountry.code}${raw ? " " + raw : ""}`);
  };

  return (
    <div>
      <div
        className={`flex items-center w-full rounded bg-yellow-50 transition-all focus-within:ring-2 ${
          error ? "ring-2 ring-red-400" : "focus-within:ring-yellow-200"
        } overflow-hidden`}
      >
        <select
          value={selectedCountry.code}
          onChange={handleCountryChange}
          disabled={disabled}
          className="flex items-center gap-1.5 px-2 py-3 bg-yellow-50 border-r border-yellow-100 text-sm font-semibold text-gray-700 whitespace-nowrap outline-none cursor-pointer shrink-0"
        >
          {COUNTRY_CODES.map((country) => (
            <option key={country.code} value={country.code}>
              {country.label}
            </option>
          ))}
        </select>
        <input
          type="tel"
          value={localValue}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 px-4 py-3 focus:outline-none text-gray-700 bg-transparent"
        />
      </div>
    </div>
  );
};

export default function AddNewUser() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [roleSelectValue, setRoleSelectValue] = useState("");
  const navigate = useNavigate();
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "taken" | "available">("idle");
  const [checkUsername] = useLazyCheckUsernameQuery();

  const [usernameFormatError, setUsernameFormatError] = useState<string | null>(null);

  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("fullName", value);

    if (!value.trim()) {
      setUsernameStatus("idle");
      setUsernameSuggestions([]);
      setUsernameFormatError(null);
      return;
    }

    // Validate: only letters and numbers allowed
    const validPattern = /^[a-zA-Z0-9]+$/;
    if (!validPattern.test(value.trim())) {
      setUsernameFormatError("Username must contain only letters and numbers");
      setUsernameStatus("idle");
      setUsernameSuggestions([]);
      return;
    }

    setUsernameFormatError(null);
    const formatted = value.trim().replace(/\s+/g, "_");

    try {
      const result = await checkUsername(formatted).unwrap();
      if (result?.data?.available === false) {
        setUsernameStatus("taken");
        setUsernameSuggestions(result.data.suggestions || []);
      } else {
        setUsernameStatus("available");
        setUsernameSuggestions([]);
      }
    } catch {
      setUsernameStatus("idle");
      setUsernameSuggestions([]);
    }
  };


  const handleSuggestionClick = (suggestion: string) => {
    setValue("fullName", suggestion);
    setUsernameStatus("available");
    setUsernameSuggestions([]);
    setUsernameFormatError(null);
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userSchema) as any,
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "+65",
      password: "",
      role: [],
    },
  });

  const [addUser, { isLoading }] = useAddUserTypeMutation();
  const { data: rolesResponse, isLoading: rolesLoading } = useGetRoleBasedAccessControlQuery({ limit: 1000 });

  const roles = rolesResponse?.data || [];

  const onSubmit = async (data: FormData) => {
    if (!data.fullName || !data.email || !data.phone || !data.password || !data.role) {
      toast.error("Please fill in all required fields.");
      return;
    }

    toast.loading("Creating user...");
    try {
      const newUser: any = {
        username: data.fullName.trim().replace(/\s+/g, "_"),
        email: data.email,
        phone: data.phone,
        password: data.password,
        ...(data.role && data.role.length > 0
          ? { custom_role_name: data.role }
          : { role_name: "USER" }),
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



  const handleRemoveRole = (roleToRemove: string) => {
    const newRoles = selectedRoles.filter((role) => role !== roleToRemove);
    setSelectedRoles(newRoles);
    setValue("role", newRoles, { shouldValidate: true });
  };

  return (
    <div className="px-8 min-h-screen bg-gray-50 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-8 pt-4 sm:pt-0">
        Add User
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
                Username
              </label>
              <input
                {...register("fullName")}
                onChange={handleUsernameChange}
                placeholder="Enter username"
                className={`w-full px-4 py-3 bg-yellow-50 border-0 rounded text-gray-700 outline-none transition-all focus:ring-2 ${errors.fullName || usernameStatus === "taken" || usernameFormatError
                  ? "focus:ring-red-400 ring-2 ring-red-400"
                  : "focus:ring-yellow-200"
                  }`}
              />

              {/* Format error */}
              {usernameFormatError && (
                <p className="text-red-500 text-sm mt-1">{usernameFormatError}</p>
              )}

              {/* Username availability feedback */}
              {usernameStatus === "taken" && (
                <p className="text-red-500 text-sm mt-1">Username already exists.</p>
              )}

              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
              )}

              {/* Suggestions */}
              {usernameSuggestions.length > 0 && (
                <div className="mt-3">
                  <p className="text-gray-500 text-sm mb-2">Suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {usernameSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1.5 bg-yellow-100 rounded-full text-sm font-medium text-gray-700 hover:bg-yellow-300 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
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
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.phone?.message}
                  />
                )}
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

              <Select
                value={roleSelectValue}
                onValueChange={(val) => {
                  if (val && !selectedRoles.includes(val)) {
                    const newRoles = [...selectedRoles, val];
                    setSelectedRoles(newRoles);
                    setValue("role", newRoles, { shouldValidate: true });
                  }
                  setRoleSelectValue(""); // Reset to show placeholder
                }}
                disabled={rolesLoading}
              >
                <SelectTrigger
                  className={`w-full px-4 py-5 h-auto justify-between bg-yellow-50 border-0 rounded text-gray-700 outline-none transition-all focus:ring-2 ${errors.role
                    ? "focus:ring-red-400 ring-2 ring-red-400"
                    : "focus:ring-yellow-200"
                    }`}
                >
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {roles.map((role: any) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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
                        className="hover:text-red-600 transition-colors p-0.5 rounded-full hover:bg-yellow-200"
                      >
                        <X size={14} className="stroke-3" />
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