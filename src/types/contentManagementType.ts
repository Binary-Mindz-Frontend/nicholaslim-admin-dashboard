export type ContentType =
  | "Terms & Conditions"
  | "Privacy Policy"
  | "Cancellation & Waiting Policy"
  | "FAQ List"
  | "Help Articles List"
  | "About Us";

export type TabType = "User" | "Riders";

export type ContentEntityType = "content" | "faq" | "article" | "aboutus";

// Map UI content types to API enum values
export const CONTENT_TYPE_MAP: Record<ContentType, string> = {
  "Terms & Conditions": "TERMSANDCONDITION",
  "Privacy Policy": "PRIVANCYPOLICY",
  "Cancellation & Waiting Policy": "CANCELLATIONANDWAITINGPOLICY",
  "FAQ List": "FAQ",
  "Help Articles List": "HELPARTICLES",
  "About Us": "ABOUTUS",
};

export const CONTENT_TYPE_DISPLAY: Record<TabType, string> = {
  User: "User",
  Riders: "Riders",
};

// Reverse mapping for API to UI
export const API_TO_UI_MAP: Record<string, ContentType> = {
  TERMSANDCONDITION: "Terms & Conditions",
  PRIVACYPOLICY: "Privacy Policy",
  CANCELLATIONANDWAITINGPOLICY: "Cancellation & Waiting Policy",
  FAQ: "FAQ List",
  HELPARTICLES: "Help Articles List",
  ABOUTUS: "About Us",
};

export const tabItems: ContentType[] = [
  "Terms & Conditions",
  "Privacy Policy",
  "Cancellation & Waiting Policy",
  "FAQ List",
  "Help Articles List",
  "About Us",
];

export interface ContentData {
  id: number;
  contenttype: string;
  description: string;
  isPublished: boolean;
  version?: string | null;
  question?: string;
  answer?: string;
  isActive?: boolean;
  title?: string;
  content?: string;
  published?: boolean;
}

export interface FAQData {
  id: number;
  question: string;
  answer: string;
  isActive: boolean;
}

export interface ArticleData {
  id: number;
  title: string;
  content: string;
  published: boolean;
}

export interface AboutUsData {
  id: number;
  title: string;
  content: string;
  isActive: boolean;
}
