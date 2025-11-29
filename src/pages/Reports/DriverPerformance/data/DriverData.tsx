export type TDriver = {
  id: string;
  name: string;
  orders: number;
  completed: number;
  cancelled: number;
  rating: number; 
  revenue: string; 
  complaints: number;
};

export const driversData: TDriver[] = [
  {
    id: "D001",
    name: "Amir Rahman",
    orders: 120,
    completed: 110,
    cancelled: 10,
    rating: 4.8,
    revenue: "$1,200",
    complaints: 0,
  },
  {
    id: "D002",
    name: "Adib Babu",
    orders: 100,
    completed: 80,
    cancelled: 20,
    rating: 4.6,
    revenue: "$950",
    complaints: 1,
  },
  {
    id: "D003",
    name: "Jihad Patori",
    orders: 105,
    completed: 100,
    cancelled: 5,
    rating: 4.9,
    revenue: "$1,100",
    complaints: 0,
  },
  {
    id: "D004",
    name: "Wei Jie",
    orders: 90,
    completed: 80,
    cancelled: 10,
    rating: 3.9,
    revenue: "$800",
    complaints: 5,
  },
  {
    id: "D005",
    name: "Jun Wei",
    orders: 102,
    completed: 100,
    cancelled: 2,
    rating: 4.5,
    revenue: "$1,300",
    complaints: 1,
  },
  {
    id: "D006",
    name: "Kai Wen",
    orders: 60,
    completed: 50,
    cancelled: 10,
    rating: 4.2,
    revenue: "$1,000",
    complaints: 0,
  },
];
