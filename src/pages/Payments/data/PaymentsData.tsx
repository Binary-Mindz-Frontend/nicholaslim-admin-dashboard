export type TPayment = {
  orderId: string;
  name: string;
  paymentMethod: string;
  amount: string;
  paymentType: string;
  status: "Completed" | "Pending" | "Failed";
};

export const paymentsData: TPayment[] = [
  {
    orderId: "#108B",
    name: "Christine Brooks",
    paymentMethod: "Credit Card",
    amount: "$24.50",
    paymentType: "Payment",
    status: "Completed",
  },
  {
    orderId: "#108B",
    name: "Christine Brooks",
    paymentMethod: "Digital Wallet",
    amount: "$24.50",
    paymentType: "Refund",
    status: "Completed",
  },
  {
    orderId: "#108B",
    name: "Christine Brooks",
    paymentMethod: "Credit Card",
    amount: "$24.50",
    paymentType: "Commission",
    status: "Completed",
  },
  {
    orderId: "#108B",
    name: "Christine Brooks",
    paymentMethod: "Cash On Delivery",
    amount: "$24.50",
    paymentType: "Payment",
    status: "Pending",
  },
  {
    orderId: "#108B",
    name: "Christine Brooks",
    paymentMethod: "Cash On Delivery",
    amount: "$24.50",
    paymentType: "Payment",
    status: "Pending",
  },
  {
    orderId: "#108B",
    name: "Christine Brooks",
    paymentMethod: "Cash On Delivery",
    amount: "$24.50",
    paymentType: "Payment",
    status: "Failed",
  },
  {
    orderId: "#108B",
    name: "Christine Brooks",
    paymentMethod: "Digital Wallet",
    amount: "$24.50",
    paymentType: "Payment",
    status: "Completed",
  },
  {
    orderId: "#108B",
    name: "Christine Brooks",
    paymentMethod: "Digital Wallet",
    amount: "$24.50",
    paymentType: "Refund",
    status: "Completed",
  },
  {
    orderId: "#108B",
    name: "Christine Brooks",
    paymentMethod: "Credit Card",
    amount: "$24.50",
    paymentType: "Commission",
    status: "Completed",
  },
];
