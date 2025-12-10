import { z } from "zod";

export const userProfileSchema = z.object({
  // Personal Information
  raider_name: z.string().min(1, "Name is required"),
  contact_number: z.string().min(1, "Contact number is required"),
  email_address: z.string().email("Invalid email address"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  
  // Driver Photos
  driver_photos: z.array(z.string()).optional(),
  
  // Emergency Contact
  emergency_contact_name: z.string().min(1, "Emergency contact name is required"),
  emergency_contact_number: z.string().min(1, "Emergency contact number is required"),
  
  // Identity Information
  identity_card_number: z.string().min(1, "Identity card number is required"),
  nid_front_images: z.string().min(1, "NID front image is required"),
  nid_back_images: z.string().min(1, "NID back image is required"),
  
  // Driving License
  driving_license_number: z.string().min(1, "Driving license number is required"),
  driving_license_issue_date: z.string().min(1, "License issue date is required"),
  driving_license_expire_date: z.string().min(1, "License expiry date is required"),
  driving_license_front_images: z.string().min(1, "License front image is required"),
  driving_license_back_images: z.string().min(1, "License back image is required"),
  
  // Vehicle Information
  vehicle_plate_number: z.string().min(1, "Vehicle plate number is required"),
  vehicle_type: z.string().min(1, "Vehicle type is required"),
  vehicle_brand: z.string().min(1, "Vehicle brand is required"),
  registration_date: z.string().min(1, "Registration date is required"),
  vehicle_front_images: z.string().min(1, "Vehicle front image is required"),
  vehicle_back_images: z.string().min(1, "Vehicle back image is required"),
  vehicle_driver_side_images: z.string().min(1, "Vehicle driver side image is required"),
  vehicle_passenger_side_images: z.string().min(1, "Vehicle passenger side image is required"),
  
  // Vehicle Log
  vehicle_log_number: z.string().min(1, "Vehicle log number is required"),
  vehicle_log_issue_date: z.string().min(1, "Vehicle log issue date is required"),
  vehicle_log_expire_date: z.string().min(1, "Vehicle log expiry date is required"),
  vehicle_log_images: z.string().min(1, "Vehicle log image is required"),
  
  // Vehicle Policy
  vehicle_policy_number: z.string().min(1, "Policy number is required"),
  vehicle_policy_issue_date: z.string().min(1, "Policy issue date is required"),
  vehicle_policy_expire_date: z.string().min(1, "Policy expiry date is required"),
  vehicle_policy_images: z.string().min(1, "Policy image is required"),
  
  // Current Address
  current_address: z.string().min(1, "Current address is required"),
  current_apartment: z.string().min(1, "Current apartment is required"),
  current_state_province: z.string().min(1, "Current state/province is required"),
  current_city: z.string().min(1, "Current city is required"),
  current_country: z.string().min(1, "Current country is required"),
  current_zip_post_code: z.string().min(1, "Current zip/postal code is required"),
  
  // Permanent Address
  permanent_address: z.string().min(1, "Permanent address is required"),
  permanent_apartment: z.string().optional(),
  permanent_state_province: z.string().min(1, "Permanent state/province is required"),
  permanent_city: z.string().min(1, "Permanent city is required"),
  permanent_country: z.string().min(1, "Permanent country is required"),
  permanent_zip_post_code: z.string().min(1, "Permanent zip/postal code is required"),
  
  // Bank Information
  bank_name: z.string().min(1, "Bank name is required"),
  account_number: z.string().min(1, "Account number is required"),
});

export type UserProfileType = z.infer<typeof userProfileSchema>;