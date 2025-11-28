export type TDriver = {
  id: string;
  name: string;
  contact: string;
  zone: string;
  totalOrders: number;
  onboardingType: "Assigned by Admin" | "Directly signed in";
  availability: {
    status: "Assigned Order" | "Currently Available";
    assignedOrderCount: number;
    activeStatus: "Online" | "Offline";
  };
};

export const driversData: TDriver[] = [
  {
    id: "D001",
    name: "Harry Dim",
    contact: "65******",
    zone: "Pungol",
    totalOrders: 3,
    onboardingType: "Assigned by Admin",
    availability: {
      status: "Assigned Order",
      assignedOrderCount: 100,
      activeStatus: "Online",
    },
  },
  {
    id: "D002",
    name: "Harry Dim",
    contact: "65******",
    zone: "Pungol",
    totalOrders: 3,
    onboardingType: "Directly signed in",
    availability: {
      status: "Assigned Order",
      assignedOrderCount: 100,
      activeStatus: "Online",
    },
  },
  {
    id: "D003",
    name: "Harry Dim",
    contact: "65******",
    zone: "Pungol",
    totalOrders: 3,
    onboardingType: "Assigned by Admin",
    availability: {
      status: "Currently Available",
      assignedOrderCount: 0,
      activeStatus: "Online",
    },
  },
  {
    id: "D004",
    name: "Harry Dim",
    contact: "65******",
    zone: "Pungol",
    totalOrders: 3,
    onboardingType: "Directly signed in",
    availability: {
      status: "Assigned Order",
      assignedOrderCount: 100,
      activeStatus: "Online",
    },
  },
  {
    id: "D005",
    name: "Harry Dim",
    contact: "65******",
    zone: "Pungol",
    totalOrders: 3,
    onboardingType: "Directly signed in",
    availability: {
      status: "Currently Available",
      assignedOrderCount: 0,
      activeStatus: "Online",
    },
  },
  {
    id: "D006",
    name: "Harry Dim",
    contact: "65******",
    zone: "Pungol",
    totalOrders: 3,
    onboardingType: "Directly signed in",
    availability: {
      status: "Assigned Order",
      assignedOrderCount: 100,
      activeStatus: "Online",
    },
  },
  {
    id: "D007",
    name: "Harry Dim",
    contact: "65******",
    zone: "Pungol",
    totalOrders: 3,
    onboardingType: "Assigned by Admin",
    availability: {
      status: "Assigned Order",
      assignedOrderCount: 100,
      activeStatus: "Online",
    },
  },
];
