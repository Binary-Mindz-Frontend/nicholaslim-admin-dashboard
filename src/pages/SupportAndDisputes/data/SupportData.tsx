export type TIssueType =
  | "Damaged Goods"
  | "Missing Items"
  | "Wrong Item"
  | "Late Delivery";

export type TPriority = "High" | "Medium" | "Low";

export type TOrderCategory = "Express" | "Standard" | "Stacked";

export type TSupportDispute = {
  caseId: string;
  customerName: string;
  issueType: TIssueType;
  date: string;
  category: TOrderCategory;
  priority: TPriority;

  // New fields for ViewSupport screen
  orderId: string;
  statement: string;
  totalOrderCost: number;
  images: string[]; // evidence attachments
};

export const supportAndDisputesData: TSupportDispute[] = [
  {
    caseId: "Disp#108B",
    customerName: "Christine Brooks",
    issueType: "Damaged Goods",
    date: "08 Oct 2025",
    category: "Express",
    priority: "High",
    orderId: "ORD-7845",
    statement:
      "The package arrived with visible damage to the outer box. Upon opening, I found that the ceramic vase I ordered was completely shattered. The item was not properly wrapped and there was insufficient padding material inside the box. I need a full refund or replacement.",
    totalOrderCost: 24.5,
    images: [
      "/images/evidence1.jpg",
      "/images/evidence2.jpg",
      "/images/evidence3.jpg",
    ],
  },

  {
    caseId: "Disp#109A",
    customerName: "Christine Brooks",
    issueType: "Missing Items",
    date: "08 Oct 2025",
    category: "Express",
    priority: "High",
    orderId: "ORD-7846",
    statement:
      "One of the items in the order was missing. The package was sealed but the contents did not match the invoice.",
    totalOrderCost: 45.0,
    images: [
      "/images/missing1.jpg",
      "/images/missing2.jpg",
      "/images/missing3.jpg",
    ],
  },

  {
    caseId: "Disp#110C",
    customerName: "Christine Brooks",
    issueType: "Damaged Goods",
    date: "08 Oct 2025",
    category: "Standard",
    priority: "High",
    orderId: "ORD-7847",
    statement:
      "The delivered item had multiple cracks. It seems the product was not handled carefully during delivery.",
    totalOrderCost: 32.99,
    images: [
      "/images/crack1.jpg",
      "/images/crack2.jpg",
      "/images/crack3.jpg",
    ],
  },

  {
    caseId: "Disp#111D",
    customerName: "Christine Brooks",
    issueType: "Damaged Goods",
    date: "08 Oct 2025",
    category: "Stacked",
    priority: "Medium",
    orderId: "ORD-7848",
    statement:
      "Package looked fine outside but the product inside was broken.",
    totalOrderCost: 19.99,
    images: [
      "/images/box1.jpg",
      "/images/box2.jpg",
      "/images/box3.jpg",
    ],
  },

  {
    caseId: "Disp#112E",
    customerName: "Christine Brooks",
    issueType: "Damaged Goods",
    date: "08 Oct 2025",
    category: "Express",
    priority: "Medium",
    orderId: "ORD-7849",
    statement:
      "The product was delivered in a bent condition due to packaging issues.",
    totalOrderCost: 12.0,
    images: [
      "/images/damage1.jpg",
      "/images/damage2.jpg",
      "/images/damage3.jpg",
    ],
  },

  {
    caseId: "Disp#113F",
    customerName: "Christine Brooks",
    issueType: "Damaged Goods",
    date: "08 Oct 2025",
    category: "Standard",
    priority: "Low",
    orderId: "ORD-7850",
    statement:
      "Minor scratch on the product but still noticeable. Requesting a small adjustment.",
    totalOrderCost: 15.5,
    images: [
      "/images/scratch1.jpg",
      "/images/scratch2.jpg",
      "/images/scratch3.jpg",
    ],
  },

  {
    caseId: "Disp#114G",
    customerName: "Christine Brooks",
    issueType: "Damaged Goods",
    date: "08 Oct 2025",
    category: "Standard",
    priority: "Low",
    orderId: "ORD-7851",
    statement:
      "Item had a loose part. Might be due to shipping vibrations.",
    totalOrderCost: 10.0,
    images: [
      "/images/loose1.jpg",
      "/images/loose2.jpg",
      "/images/loose3.jpg",
    ],
  },

  {
    caseId: "Disp#115H",
    customerName: "Christine Brooks",
    issueType: "Damaged Goods",
    date: "08 Oct 2025",
    category: "Express",
    priority: "Low",
    orderId: "ORD-7852",
    statement:
      "Light corner damage but usable.",
    totalOrderCost: 18.75,
    images: [
      "/images/corner1.jpg",
      "/images/corner2.jpg",
      "/images/corner3.jpg",
    ],
  },

  {
    caseId: "Disp#116I",
    customerName: "Christine Brooks",
    issueType: "Damaged Goods",
    date: "08 Oct 2025",
    category: "Express",
    priority: "Low",
    orderId: "ORD-7853",
    statement:
      "Packaging was wet when delivered. Possible water damage.",
    totalOrderCost: 22.0,
    images: [
      "/images/wet1.jpg",
      "/images/wet2.jpg",
      "/images/wet3.jpg",
    ],
  },
];

