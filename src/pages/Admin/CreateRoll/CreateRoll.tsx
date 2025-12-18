import React, { useState, useRef } from 'react';
import { Camera, Eye, EyeOff } from 'lucide-react';
import { useAddCustomRoleUserMutation } from '@/redux/features/users/usersApi';
import { useUploadFileMutation } from '@/redux/features/fileUpload/fileuploadApi';
import toast from 'react-hot-toast';

interface FormData {
  username: string;
  email: string;
  phone: string;
  password: string;
  role_name: string;
  image?: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  role_name?: string;
}

type RequiredFormFields = 'username' | 'email' | 'password' | 'role_name';

export default function CreateRollForm() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    phone: '',
    password: '',
    role_name: '',
  });

  const [addCustomRoleUser, { isLoading }] = useAddCustomRoleUserMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateField = (name: RequiredFormFields, value: string): string => {
    if (!value.trim()) {
      return `${name} is required`;
    }

    switch (name) {
      case 'username':
        if (value.length < 3) return 'Username must be at least 3 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          return 'Username can only contain letters, numbers, and underscores';
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address';
        }
        break;
      case 'password':
        if (value.length < 6) return 'Password must be at least 6 characters';
        break;
      case 'role_name':
        if (value.length < 2) return 'Role name must be at least 2 characters';
        break;
    }
    return '';
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    const fieldsToValidate: RequiredFormFields[] = ['username', 'email', 'password', 'role_name'];
    
    fieldsToValidate.forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (touched[name]) {
      if (name === 'username' || name === 'email' || name === 'password' || name === 'role_name') {
        const error = validateField(name as RequiredFormFields, value);
        setErrors({
          ...errors,
          [name]: error
        });
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });

    if (name === 'username' || name === 'email' || name === 'password' || name === 'role_name') {
      const error = validateField(name as RequiredFormFields, value);
      setErrors({
        ...errors,
        [name]: error
      });
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const response = await uploadFile(file).unwrap();
      
      if (response.success && response.data && response.data.length > 0) {
        return response.data[0];
      }
      return null;
    } catch (error: any) {
      console.error('Image upload failed:', error);
      toast.error(error?.data?.message || 'Failed to upload image');
      return null;
    }
  };

  const handleSubmit = async () => {
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    if (!validateForm()) {
      toast.error('Please fill all required fields correctly');
      return;
    }

    try {
      let imageUrl = '';
      
      if (selectedFile) {
        toast.loading('Uploading image...', { id: 'upload' });
        const uploadedUrl = await uploadImage(selectedFile);
        toast.dismiss('upload');
        
        if (!uploadedUrl) {
          toast.error('Failed to upload image. Please try again.');
          return;
        }
        
        imageUrl = uploadedUrl;
        toast.success('Image uploaded successfully!');
      }

      const userData: FormData = {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role_name: formData.role_name,
      };

      if (imageUrl) {
        userData.image = imageUrl;
      }

      console.log('Sending user data:', userData);

      toast.loading('Creating user...', { id: 'create' });
      
      const response = await addCustomRoleUser(userData).unwrap();
      toast.dismiss('create');
      
      toast.success(response.message || 'User created successfully!');

      setFormData({
        username: '',
        email: '',
        phone: '',
        password: '',
        role_name: '',
      });
      setSelectedFile(null);
      setPhotoPreview(null);
      setErrors({});
      setTouched({});
      setShowPassword(false);
      
    } catch (error: any) {
      toast.dismiss('upload');
      toast.dismiss('create');
      
      console.error('API Error:', error);
      toast.error(error?.data?.message || 'Failed to create user. Please try again.');
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 sm:px-0 lg:p-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 pt-2 sm:pt-0 mb-8">
          Create Custom Role User
        </h1>

        <div className="bg-white rounded-lg shadow-sm p-4 lg:p-32">
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
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Upload preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <p
              onClick={handlePhotoClick}
              className="text-gray-800 font-medium cursor-pointer hover:text-gray-600"
            >
              {isUploading ? 'Uploading...' : 'Upload Photo'}
            </p>
            {selectedFile && (
              <p className="text-sm text-gray-500 mt-2">
                {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          <div>
            <div className="mb-8">
              <label className="block text-gray-600 font-medium mb-2">
                Username *
              </label>
              <input
                type="text"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 bg-yellow-50 border-0 rounded text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  errors.username && touched.username
                    ? "focus:ring-red-400 ring-2 ring-red-400"
                    : "focus:ring-yellow-400"
                }`}
              />
              {errors.username && touched.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username}
                </p>
              )}
            </div>

            <div className="mb-8">
              <label className="block text-gray-600 font-medium mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 bg-yellow-50 border-0 rounded text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  errors.email && touched.email
                    ? "focus:ring-red-400 ring-2 ring-red-400"
                    : "focus:ring-yellow-400"
                }`}
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="mb-8">
              <label className="block text-gray-600 font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter phone number (optional)"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-yellow-50 border-0 rounded text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div className="mb-8">
              <label className="block text-gray-600 font-medium mb-2">
                Role Name *
              </label>
              <input 
                type="text"
                name="role_name"
                placeholder="Enter custom role name"
                value={formData.role_name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 bg-yellow-50 border-0 rounded text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  errors.role_name && touched.role_name
                    ? "focus:ring-red-400 ring-2 ring-red-400"
                    : "focus:ring-yellow-400" 
                }`}
              />
              {errors.role_name && touched.role_name && (
                <p className="text-red-500 text-sm mt-1">{errors.role_name}</p>
              )}
            </div>

            <div className="mb-12 relative">
              <label className="block text-gray-600 font-medium mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 bg-yellow-50 border-0 rounded text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 pr-10 ${
                    errors.password && touched.password
                      ? "focus:ring-red-400 ring-2 ring-red-400"
                      : "focus:ring-yellow-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && touched.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={isLoading || isUploading}
                className="px-12 py-3 bg-yellow-400 font-bold hover:bg-yellow-500 text-black rounded transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}