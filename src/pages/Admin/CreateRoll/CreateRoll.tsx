/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable no-case-declarations */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState, useRef } from 'react';
// import { Camera, Eye, EyeOff } from 'lucide-react';
// import { useAddCustomRoleUserMutation } from '@/redux/features/users/usersApi';
// import { useUploadFileMutation } from '@/redux/features/fileUpload/fileuploadApi';
// import toast from 'react-hot-toast';

// interface FormData {
//   username: string;
//   email: string;
//   phone: string;
//   password: string;
//   role_name: string;
//   image?: string;
// }

// interface FormErrors {
//   username?: string;
//   email?: string;
//   password?: string;
//   role_name?: string;
// }

// type RequiredFormFields = 'username' | 'email' | 'password' | 'role_name';

// export default function CreateRollForm() {
//   const [formData, setFormData] = useState<FormData>({
//     username: '',
//     email: '',
//     phone: '',
//     password: '',
//     role_name: '',
//   });

//   const [addCustomRoleUser, { isLoading }] = useAddCustomRoleUserMutation();
//   const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

//   const [errors, setErrors] = useState<FormErrors>({});
//   const [touched, setTouched] = useState<Record<string, boolean>>({});
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [photoPreview, setPhotoPreview] = useState<string | null>(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const validateField = (name: RequiredFormFields, value: string): string => {
//     if (!value.trim()) {
//       return `${name} is required`;
//     }

//     switch (name) {
//       case 'username':
//         if (value.length < 3) return 'Username must be at least 3 characters';
//         if (!/^[a-zA-Z0-9_]+$/.test(value)) {
//           return 'Username can only contain letters, numbers, and underscores';
//         }
//         break;
//       case 'email':
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(value)) {
//           return 'Please enter a valid email address';
//         }
//         break;
//       case 'password':
//         if (value.length < 6) return 'Password must be at least 6 characters';
//         break;
//       case 'role_name':
//         if (value.length < 2) return 'Role name must be at least 2 characters';
//         break;
//     }
//     return '';
//   };

//   const validateForm = (): boolean => {
//     const newErrors: FormErrors = {};
//     let isValid = true;

//     const fieldsToValidate: RequiredFormFields[] = ['username', 'email', 'password', 'role_name'];

//     fieldsToValidate.forEach((key) => {
//       const error = validateField(key, formData[key]);
//       if (error) {
//         newErrors[key] = error;
//         isValid = false;
//       }
//     });

//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });

//     if (touched[name]) {
//       if (name === 'username' || name === 'email' || name === 'password' || name === 'role_name') {
//         const error = validateField(name as RequiredFormFields, value);
//         setErrors({
//           ...errors,
//           [name]: error
//         });
//       }
//     }
//   };

//   const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setTouched({
//       ...touched,
//       [name]: true
//     });

//     if (name === 'username' || name === 'email' || name === 'password' || name === 'role_name') {
//       const error = validateField(name as RequiredFormFields, value);
//       setErrors({
//         ...errors,
//         [name]: error
//       });
//     }
//   };

//   const uploadImage = async (file: File): Promise<string | null> => {
//     try {
//       const response = await uploadFile(file).unwrap();

//       if (response.success && response.data && response.data.length > 0) {
//         return response.data[0];
//       }
//       return null;
//     } catch (error: any) {
//       console.error('Image upload failed:', error);
//       toast.error(error?.data?.message || 'Failed to upload image');
//       return null;
//     }
//   };

//   const handleSubmit = async () => {
//     const allTouched = Object.keys(formData).reduce((acc, key) => {
//       acc[key] = true;
//       return acc;
//     }, {} as Record<string, boolean>);
//     setTouched(allTouched);

//     if (!validateForm()) {
//       toast.error('Please fill all required fields correctly');
//       return;
//     }

//     toast.loading('Creating user...');

//     try {
//       let imageUrl = '';

//       if (selectedFile) {
//         toast.loading('Uploading image...', { id: 'upload' });
//         const uploadedUrl = await uploadImage(selectedFile);
//         toast.dismiss('upload');

//         if (!uploadedUrl) {
//           toast.error('Failed to upload image. Please try again.');
//           return;
//         }

//         imageUrl = uploadedUrl;
//         toast.success('Image uploaded successfully!');
//       }

//       const userData: FormData = {
//         username: formData.username,
//         email: formData.email,
//         phone: formData.phone,
//         password: formData.password,
//         role_name: formData.role_name,
//       };

//       if (imageUrl) {
//         userData.image = imageUrl;
//       }

//       const response = await addCustomRoleUser(userData).unwrap();

//       if (!response.success) {
//         toast.dismiss();
//         toast.error(response.message || 'Failed to create user. Please try again.');
//         return;
//       }

//       toast.dismiss();
//       toast.success(response.message || 'User created successfully!');

//       setFormData({
//         username: '',
//         email: '',
//         phone: '',
//         password: '',
//         role_name: '',
//       });
//       setSelectedFile(null);
//       setPhotoPreview(null);
//       setErrors({});
//       setTouched({});
//       setShowPassword(false);

//     } catch (error: any) {
//       toast.dismiss();
//       console.error('API Error:', error);
//       toast.error(error?.data?.message || 'Failed to create user. Please try again.');
//     }
//   };

//   const handlePhotoClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       // Validate file type
//       if (!file.type.startsWith('image/')) {
//         toast.error('Please select an image file');
//         return;
//       }

//       // Validate file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error('Image size should be less than 5MB');
//         return;
//       }

//       setSelectedFile(file);

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPhotoPreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 px-8 sm:px-0 lg:p-8">
//       <div>
//         <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 pt-2 sm:pt-0 mb-8">
//           Create Custom Role User
//         </h1>

//         <div className="bg-white rounded-lg shadow-sm p-4 lg:p-32">
//           <div className="flex flex-col items-center mb-12">
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handlePhotoChange}
//               accept="image/*"
//               className="hidden"
//             />
//             <div
//               onClick={handlePhotoClick}
//               className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mb-3 cursor-pointer hover:bg-yellow-100 transition-colors overflow-hidden"
//             >
//               {photoPreview ? (
//                 <img
//                   src={photoPreview}
//                   alt="Upload preview"
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <Camera className="w-8 h-8 text-gray-400" />
//               )}
//             </div>
//             <p
//               onClick={handlePhotoClick}
//               className="text-gray-800 font-medium cursor-pointer hover:text-gray-600"
//             >
//               {isUploading ? 'Uploading...' : 'Upload Photo'}
//             </p>
//             {selectedFile && (
//               <p className="text-sm text-gray-500 mt-2">
//                 {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
//               </p>
//             )}
//           </div>

//           <div>
//             <div className="mb-8">
//               <label className="block text-gray-600 font-medium mb-2">
//                 Username *
//               </label>
//               <input
//                 type="text"
//                 name="username"
//                 placeholder="Enter username"
//                 value={formData.username}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 className={`w-full px-4 py-3 bg-yellow-50 border-0 rounded text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 ${
//                   errors.username && touched.username
//                     ? "focus:ring-red-400 ring-2 ring-red-400"
//                     : "focus:ring-yellow-400"
//                 }`}
//               />
//               {errors.username && touched.username && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.username}
//                 </p>
//               )}
//             </div>

//             <div className="mb-8">
//               <label className="block text-gray-600 font-medium mb-2">
//                 Email Address *
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Enter email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 className={`w-full px-4 py-3 bg-yellow-50 border-0 rounded text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 ${
//                   errors.email && touched.email
//                     ? "focus:ring-red-400 ring-2 ring-red-400"
//                     : "focus:ring-yellow-400"
//                 }`}
//               />
//               {errors.email && touched.email && (
//                 <p className="text-red-500 text-sm mt-1">{errors.email}</p>
//               )}
//             </div>

//             <div className="mb-8">
//               <label className="block text-gray-600 font-medium mb-2">
//                 Phone Number
//               </label>
//               <input
//                 type="tel"
//                 name="phone"
//                 placeholder="Enter phone number (optional)"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 bg-yellow-50 border-0 rounded text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//               />
//             </div>

//             <div className="mb-8">
//               <label className="block text-gray-600 font-medium mb-2">
//                 Role Name *
//               </label>
//               <input
//                 type="text"
//                 name="role_name"
//                 placeholder="Enter custom role name"
//                 value={formData.role_name}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 className={`w-full px-4 py-3 bg-yellow-50 border-0 rounded text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 ${
//                   errors.role_name && touched.role_name
//                     ? "focus:ring-red-400 ring-2 ring-red-400"
//                     : "focus:ring-yellow-400"
//                 }`}
//               />
//               {errors.role_name && touched.role_name && (
//                 <p className="text-red-500 text-sm mt-1">{errors.role_name}</p>
//               )}
//             </div>

//             <div className="mb-12 relative">
//               <label className="block text-gray-600 font-medium mb-2">
//                 Password *
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   placeholder="Enter Password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className={`w-full px-4 py-3 bg-yellow-50 border-0 rounded text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 pr-10 ${
//                     errors.password && touched.password
//                       ? "focus:ring-red-400 ring-2 ring-red-400"
//                       : "focus:ring-yellow-400"
//                   }`}
//                 />
//                 <button
//                   type="button"
//                   onClick={togglePasswordVisibility}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="w-5 h-5" />
//                   ) : (
//                     <Eye className="w-5 h-5" />
//                   )}
//                 </button>
//               </div>
//               {errors.password && touched.password && (
//                 <p className="text-red-500 text-sm mt-1">{errors.password}</p>
//               )}
//             </div>

//             <div className="flex justify-center">
//               <button
//                 onClick={handleSubmit}
//                 disabled={isLoading || isUploading}
//                 className="px-12 py-3 bg-yellow-400 font-bold hover:bg-yellow-500 text-black rounded transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
//               >
//                 {isLoading ? 'Creating...' : 'Create User'}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import CustomTable from "@/components/Dashboard/DataTable/DataTable";
import {
  useAddRoleBasedAccessControlMutation,
  useDeleteRoleBasedAccessControlMutation,
  useGetRoleBasedAccessControlQuery,
  useUpdateRoleBasedAccessControlRoleMutation,
  useUpdateRoleBasedAccessControlStatusMutation,
  useUpdateRoleBasedAccessControlMutation,
} from "@/redux/features/roleBasedAccessControl/roleBasedAccessControlApi";
import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  // MoreVertical,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import RoleFormModal from "@/components/Dashboard/CreateRoll/RoleFormModal";
import ConfirmModal from "@/components/Dashboard/CreateRoll/ConfirmModal";
import PermissionsModal from "@/components/Dashboard/CreateRoll/PermissionsModal";
import toast from "react-hot-toast";

interface Role {
  id: number;
  name: string;
  isStatic: boolean;
  isActive: boolean;
  permissions: any[];
  _count: {
    users: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

const CreateRoll: React.FC = () => {
  const {
    data: roles,
    isLoading,
    error,
  } = useGetRoleBasedAccessControlQuery("");
  const [addRole] = useAddRoleBasedAccessControlMutation();
  const [updateRole] = useUpdateRoleBasedAccessControlRoleMutation();
  const [updateStatus] = useUpdateRoleBasedAccessControlStatusMutation();
  const [deleteRole] = useDeleteRoleBasedAccessControlMutation();
  const [updateRolePermissions] = useUpdateRoleBasedAccessControlMutation();

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

  // Selected role states
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [editRoleData, setEditRoleData] = useState({ name: "" });

  // Handle form submission for creating role
  const handleCreateRole = async (data: {
    name: string;
    permissions: any[];
  }) => {
    toast.loading("Creating role...");
    try {
      const response = await addRole(data).unwrap();

      if (response.success) {
        setShowCreateModal(false);
        toast.dismiss();
        toast.success(response.message || "Role created successfully!");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Failed to add role:", error);
      toast.error("Failed to add role");
    }
  };

  // Handle form submission for editing role
  const handleEditRole = async (data: { name: string; permissions: any[] }) => {
    if (!selectedRole) return;

    toast.loading("Updating role...");

    try {
      const response = await updateRole({
        id: selectedRole.id,
        name: data.name,
      }).unwrap();

      if (response.success) {
        setShowEditModal(false);
        toast.dismiss();
        toast.success(response.message || "Role updated successfully!");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Failed to update role:", error);
      toast.error("Failed to update role");
    }
  };

  // Handle delete role
  const handleDeleteRole = async () => {
    if (!selectedRole) return;

    toast.loading("Deleting role...");

    try {
      const response = await deleteRole(selectedRole.id).unwrap();

      if (response.success) {
        setShowDeleteModal(false);
        toast.dismiss();
        toast.success(response.message || "Role deleted successfully!");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Failed to delete role:", error);
      toast.error("Failed to delete role");
    }
  };

  // Handle update permissions
  const handleUpdatePermissions = async (permissions: any[]) => {
    if (!selectedRole) return;

    try {
      await updateRolePermissions({
        id: selectedRole.id,
        permissions: permissions,
      }).unwrap();
      setShowPermissionsModal(false);
    } catch (error) {
      console.error("Failed to update permissions:", error);
    }
  };

  // Handle status toggle
  const handleToggleStatus = async (id: number) => {
    try {
      await updateStatus(id).unwrap();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  // Define table columns
  const orderColumns = [
    {
      header: "ID",
      accessor: "id" as const,
    },
    {
      header: "Role Name",
      accessor: "name" as const,
    },
    {
      header: "Created Date",
      cell: (row: Role) => (
        <span className="text-gray-600">
          {row.createdAt
            ? new Date(row.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "N/A"}
        </span>
      ),
    },
    {
      header: "Active/Inactive",
      cell: (row: Role) => (
        <div
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Switch
            checked={row.isActive}
            onCheckedChange={() => handleToggleStatus(row.id)}
            className="data-[state=checked]:bg-green data-[state=unchecked]:bg-gray-300 cursor-pointer"
          />
        </div>
      ),
    },
    {
      header: "Actions",
      cell: (row: Role) => (
        <div className="flex items-center space-x-2 justify-center">
          {/* View/Edit Permissions Button */}
          <button
            onClick={() => {
              setSelectedRole(row);
              setShowPermissionsModal(true);
            }}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors cursor-pointer"
            title="View/Edit Permissions"
          >
            <Eye size={18} />
          </button>

          {/* Edit Button */}
          <button
            onClick={() => {
              setSelectedRole(row);
              setEditRoleData({ name: row.name });
              setShowEditModal(true);
            }}
            disabled={row._count.users > 0 || row.isStatic}
            // className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded transition-colors cursor-pointer"
            className={`p-2 rounded transition-colors cursor-pointer ${
              row._count.users > 0 || row.isStatic
                ? "text-gray-400 hover:cursor-not-allowed"
                : "text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50"
            }`}
            title="Edit Role"
          >
            <Edit2 size={18} />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => {
              setSelectedRole(row);
              setShowDeleteModal(true);
            }}
            disabled={row._count.users > 0 || row.isStatic}
            className={`p-2 rounded transition-colors cursor-pointer ${
              row._count.users > 0 || row.isStatic
                ? "text-gray-400 hover:cursor-not-allowed"
                : "text-red-600 hover:text-red-800 hover:bg-red-50"
            }`}
            title={
              row.isStatic
                ? "Cannot delete static role"
                : row._count.users > 0
                ? "Cannot delete role with assigned users"
                : "Delete role"
            }
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading roles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Failed to load roles. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              Role Management
            </h1>
            <p className="text-gray-600 mt-2">
              Create and manage user roles with specific permissions
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-yellow-400 rounded-lg hover:bg-yellow-500 text-black transition-colors cursor-pointer"
          >
            <Plus size={20} className="mr-2" />
            Create New Role
          </button>
        </div>

        {/* Roles Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Existing Roles ({roles?.length || 0})
            </h2>
          </div>

          {roles && roles.length > 0 ? (
            <CustomTable
              columns={orderColumns}
              data={roles}
              isLoading={isLoading}
            />
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No roles found
              </h3>
              <p className="text-gray-500 mb-4">
                Get started by creating your first role
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} className="mr-2" />
                Create Your First Role
              </button>
            </div>
          )}
        </div>

        {/* Create Role Modal */}
        <RoleFormModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateRole}
          title="Create New Role"
          // isLoading={addRole.isLoading}
        />

        {/* Edit Role Modal */}
        <RoleFormModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedRole(null);
          }}
          onSubmit={handleEditRole}
          title="Edit Role"
          initialData={editRoleData}
          // isLoading={updateRole.isLoading}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedRole(null);
          }}
          onConfirm={handleDeleteRole}
          title="Delete Role"
          message={`Are you sure you want to delete the role "${selectedRole?.name}"? This action cannot be undone.`}
          confirmText="Delete Role"
          // isLoading={deleteRole.isLoading}
        />

        {/* Permissions Modal */}
        {selectedRole && (
          <PermissionsModal
            isOpen={showPermissionsModal}
            onClose={() => {
              setShowPermissionsModal(false);
              setSelectedRole(null);
            }}
            permissions={selectedRole.permissions}
            onUpdatePermissions={handleUpdatePermissions}
            roleName={selectedRole.name}
            // isLoading={updateRolePermissions.isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default CreateRoll;
