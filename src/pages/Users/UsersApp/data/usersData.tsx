// Define TUser type without using static data
export type TUser = {
  is_verified: boolean;
  activeStatus: boolean;
  id: string;
  name: string;
  contactEmail: string;
  contactNum: string;
  totalOrders: number;
  totalCost: string;
  joiningDate: string;
  isActive: boolean;
};
