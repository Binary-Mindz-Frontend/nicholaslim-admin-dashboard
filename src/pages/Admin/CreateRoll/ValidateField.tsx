 interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  password: string;
}
 export const validateField = (name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case 'firstName':
        if (!value.trim()) return 'First name is required';
        if (value.length < 2) return 'First name must be at least 2 characters';
        break;
      case 'lastName':
        if (!value.trim()) return 'Last name is required';
        if (value.length < 2) return 'Last name must be at least 2 characters';
        break;
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          return 'Invalid email address';
        }
        break;
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        if (!/^[0-9]{10,15}$/.test(value)) {
          return 'Phone number must be 10-15 digits';
        }
        break;
      case 'role':
        if (!value.trim()) return 'Role is required';
        break;
      case 'password':
        if (!value.trim()) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return 'Password must contain uppercase, lowercase, and number';
        }
        break;
    }
    return undefined;
  };