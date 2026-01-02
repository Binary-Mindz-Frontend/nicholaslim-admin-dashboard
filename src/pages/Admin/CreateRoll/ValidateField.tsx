// export interface FormData {
//   username: string;
//   email: string;
//   phone: string;
//   password: string;
//   role_name: string;
//   image?: string;
//   referral_code?: string;
// }

// export const validateField = (
// key: string, name: keyof FormData, value: string): string | undefined => {
//   switch (name) {
//     case "username":
//       if (!value.trim()) return "Username is required";
//       if (value.length < 3) return "Username must be at least 3 characters";
//       if (!/^[a-zA-Z0-9_]+$/.test(value)) {
//         return "Username can only contain letters, numbers, and underscores";
//       }
//       break;
      
//     case "email":
//       if (!value.trim()) return "Email is required";
//       if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
//         return "Invalid email address";
//       }
//       break;
      
//     case "phone":
//       // Phone is optional, no validation required
//       break;
      
//     case "role_name":
//       if (!value.trim()) return "Role name is required";
//       if (value.length < 2) return "Role name must be at least 2 characters";
//       break;
      
//     case "password":
//       if (!value.trim()) return "Password is required";
//       if (value.length < 6) return "Password must be at least 6 characters";
//       break;
      
//     case "image":
//       // Image is optional, no validation required
//       break;
      
//     case "referral_code":
//       // Referral code is optional, no validation required
//       break;
//   }
//   return undefined;
// };