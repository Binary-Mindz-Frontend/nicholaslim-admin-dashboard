export type TOrderStatus =
  | "Completed"
  | "Pending"
  | "Cancelled"
  | "Ongoing"
  | "Scheduled";

export type TOrderCategory = "Express" | "Standard" | "Stacked";

export type TOrder = {
  orderId: string;
  customerName: string;
  address: string;
  date: string; // "08 Oct 2025"
  category: TOrderCategory;
  status: TOrderStatus;
};

export const ordersData: TOrder[] = [
  {
    orderId: "00001",
    customerName: "Christine Brooks",
    address: "089 Kutch Green Apt. 448",
    date: "08 Oct 2025",
    category: "Express",
    status: "Completed",
  },
  {
    orderId: "00002",
    customerName: "Christine Brooks",
    address: "8857 Frida Ports",
    date: "08 Oct 2025",
    category: "Express",
    status: "Pending",
  },
  {
    orderId: "00003",
    customerName: "Christine Brooks",
    address: "768 Destiny Lake Suite 600",
    date: "08 Oct 2025",
    category: "Standard",
    status: "Completed",
  },
  {
    orderId: "00004",
    customerName: "Christine Brooks",
    address: "089 Kutch Green Apt. 448",
    date: "08 Oct 2025",
    category: "Stacked",
    status: "Cancelled",
  },
  {
    orderId: "00005",
    customerName: "Christine Brooks",
    address: "089 Kutch Green Apt. 448",
    date: "08 Oct 2025",
    category: "Express",
    status: "Ongoing",
  },
  {
    orderId: "00006",
    customerName: "Christine Brooks",
    address: "768 Destiny Lake Suite 600",
    date: "08 Oct 2025",
    category: "Standard",
    status: "Cancelled",
  },
  {
    orderId: "00007",
    customerName: "Christine Brooks",
    address: "089 Kutch Green Apt. 448",
    date: "08 Oct 2025",
    category: "Standard",
    status: "Scheduled",
  },
  {
    orderId: "00008",
    customerName: "Christine Brooks",
    address: "089 Kutch Green Apt. 448",
    date: "08 Oct 2025",
    category: "Express",
    status: "Completed",
  },
];
