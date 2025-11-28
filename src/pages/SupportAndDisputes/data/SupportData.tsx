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
  date: string;       // "08 Oct 2025"
  category: TOrderCategory;
  priority: TPriority;
};

export const supportAndDisputesData: TSupportDispute[] = [
  {
    caseId: "Disp#108B",
    customerName: "Christine Brooks",
    issueType: "Damaged Goods",
    date: "08 Oct 2025",
    category: "Express",
    priority: "High",
  },
  {
    caseId: "Disp#108B",
    customerName: "Christine Brooks",
    issueType: "Missing Items",
    date: "08 Oct 2025",
    category: "Express",
    priority: "High",
  },
  {
    caseId: "Disp#108B",
    customerName: "Christine Brooks",
    issueType: "Damaged Goods",
    date: "08 Oct 2025",
    category: "Standard",
    priority: "High",
  },
  {
    caseId: "Disp#108B",
    customerName: "Christine Brooks",
    issueType: "Damaged Goods",
    date: "08 Oct 2025",
    category: "Stacked",
    priority: "Medium",
  },
  {
    caseId: "Disp#108B",
    customerName: "Christine Brooks",
    issueType: "Damaged Goods",
    date: "08 Oct 2025",
    category: "Express",
    priority: "Medium",
  },
  {
    caseId: "Disp#108B",
    customerName: "Christine Brooks",
    issueType: "Damaged Goods",
    date: "08 Oct 2025",
    category: "Standard",
    priority: "Low",
  },
  {
    caseId: "Disp#108B",
    customerName: "Christine Brooks",
    issueType: "Damaged Goods",
    date: "08 Oct 2025",
    category: "Standard",
    priority: "Low",
  },
  {
    caseId: "Disp#108B",
    customerName: "Christine Brooks",
    issueType: "Damaged Goods",
    date: "08 Oct 2025",
    category: "Express",
    priority: "Low",
  },
  {
    caseId: "Disp#108B",
    customerName: "Christine Brooks",
    issueType: "Damaged Goods",
    date: "08 Oct 2025",
    category: "Express",
    priority: "Low",
  },
];
