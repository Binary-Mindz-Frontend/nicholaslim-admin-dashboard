import { z } from "zod";

export const userProfileSchema = z.object({

  id: z.string(),
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Invalid Email"),
  phone: z.string().min(1, "Required"),
  dob: z.string().min(1, "Required"),
  gender: z.string().min(1, "Required"),
  emergencyContact: z.string().min(1, "Required"),
  driverId: z.string().min(1, "Required"),

  address: z.string().min(1, "Required"),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  postal: z.string().min(1, "Required"),
  rating: z.string(),         
  followers: z.string(),       
  deliveries: z.string(),
  cancellations: z.string(),
  incentives: z.string(),
  drivingLicense: z.string().min(1, "Required"),
  dlIssueDate: z.string().min(1, "Required"),
  dlExpiryDate: z.string().min(1, "Required"),
  vehiclePlate1: z.string().min(1, "Required"),
  vehicleType: z.string().min(1, "Required"),
  vehiclePlate2: z.string().min(1, "Required"),
  model: z.string().min(1, "Required"),
  registrationDate: z.string().min(1, "Required"),
  vehicleLog: z.string().min(1, "Required"),
  vehicleIssueDate: z.string().min(1, "Required"),
  vehicleExpiryDate: z.string().min(1, "Required"),
  policyNumber: z.string().min(1, "Required"),
  policyIssue: z.string().min(1, "Required"),
  policyExpiry: z.string().min(1, "Required"),
  bank: z.string().min(1, "Required"),
  accountNumber: z.string().min(1, "Required"),
});

export type UserProfileType = z.infer<typeof userProfileSchema>;
