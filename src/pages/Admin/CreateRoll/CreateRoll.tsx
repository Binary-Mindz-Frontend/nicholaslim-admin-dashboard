import React, { useState, useRef } from 'react';
import { Camera, ChevronDown } from 'lucide-react';
import { validateField } from './ValidateField';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  password: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  password?: string;
}

export default function CreateRollForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'Finance',
    password: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

 

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name as keyof FormData, value);
      setErrors({
        ...errors,
        [name]: error
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });

    const error = validateField(name as keyof FormData, value);
    setErrors({
      ...errors,
      [name]: error
    });
  };

  const handleSubmit = () => {
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    if (validateForm()) {
      console.log('Form submitted:', formData);
      console.log('Photo:', photo);
      // Reset form after successful submission
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'Finance',
        password: ''
      });
      setPhoto(null);
      setErrors({});
      setTouched({});
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:p-8">
      <div>
        <h1 className="text-3xl font-semibold text-gray-800 mb-8">Create Roll</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-4 lg:p-32">
          {/* Upload Photo Section */}
          <div className="flex flex-col items-center mb-12">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              accept="image/*"
              className="hidden"
            />
            <div 
              onClick={handlePhotoClick}
              className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mb-3 cursor-pointer hover:bg-yellow-100 transition-colors overflow-hidden"
            >
              {photo ? (
                <img src={photo} alt="Upload preview" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <p 
              onClick={handlePhotoClick}
              className="text-gray-800 font-medium cursor-pointer hover:text-gray-600"
            >
              Upload Photo
            </p>
          </div>

          {/* Form */}
          <div>
            {/* First Row - First Name and Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-gray-600 font-medium mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 bg-yellow-50 border-0 rounded text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    errors.firstName && touched.firstName ? 'focus:ring-red-400 ring-2 ring-red-400' : 'focus:ring-yellow-400'
                  }`}
                />
                {errors.firstName && touched.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 bg-yellow-50 border-0 rounded text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    errors.lastName && touched.lastName ? 'focus:ring-red-400 ring-2 ring-red-400' : 'focus:ring-yellow-400'
                  }`}
                />
                {errors.lastName && touched.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Second Row - Email and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-gray-600 font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 bg-yellow-50 border-0 rounded text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    errors.email && touched.email ? 'focus:ring-red-400 ring-2 ring-red-400' : 'focus:ring-yellow-400'
                  }`}
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 bg-yellow-50 border-0 rounded text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    errors.phone && touched.phone ? 'focus:ring-red-400 ring-2 ring-red-400' : 'focus:ring-yellow-400'
                  }`}
                />
                {errors.phone && touched.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Third Row - Role and Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
              <div>
                <label className="block text-gray-600 font-medium mb-2">
                  Role Name
                </label>
                <div className="relative">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 bg-yellow-50 border-0 rounded text-gray-700 appearance-none focus:outline-none focus:ring-2 cursor-pointer ${
                      errors.role && touched.role ? 'focus:ring-red-400 ring-2 ring-red-400' : 'focus:ring-yellow-400'
                    }`}
                  >
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700 pointer-events-none" />
                </div>
                {errors.role && touched.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 bg-yellow-50 border-0 rounded text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    errors.password && touched.password ? 'focus:ring-red-400 ring-2 ring-red-400' : 'focus:ring-yellow-400'
                  }`}
                />
                {errors.password && touched.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                className="px-12 py-3 bg-yellow-400 cursor-pointer font-bold hover:bg-yellow-500 text-black rounded transition-colors"
              >
                Add Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}