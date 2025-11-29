import { useState } from "react";
import ContentEditorSection from "./components/ContentEditorSection";
import FAQManagement from "./components/FAQSection";
import ArticleManagement from "./components/HelpArticle";
import AboutUsManagement from "./components/AboutUs";
import ContentHistoryTable from "./components/History";

// Define the available content types (tabs)
type ContentType =
  | "Terms & Conditions"
  | "Privacy Policy"
  | "Cancellation & Waiting Policy"
  | "FAQ List"
  | "Help Articles List"
  | "About Us";

// Mock content storage (in a real app, this would come from a database/API)
const initialContentState: Record<ContentType, string> = {
  "Terms & Conditions":
    "These are the full terms and conditions for using our service. They cover usage rights, liability limitations, and payment obligations. Please review them carefully.",
  "Privacy Policy":
    "Our privacy policy details how we collect, use, and protect your personal data, including information on data security and user rights.",
  "Cancellation & Waiting Policy":
    "This outlines the rules and fees related to order cancellation and driver waiting times.",
  "FAQ List":
    "Frequently Asked Questions about service use, billing, and support.",
  "Help Articles List":
    "A comprehensive index of articles designed to help users troubleshoot and understand the application features.",
  "About Us":
    "Information about our company, our mission, and the team behind the service.",
};

const tabItems: ContentType[] = [
  "Terms & Conditions",
  "Privacy Policy",
  "Cancellation & Waiting Policy",
  "FAQ List",
  "Help Articles List",
  "About Us",
];

const activeTabClass =
  "bg-yellow-100 border-yellow-500 text-gray-900 shadow-md";
const inactiveTabClass =
  "bg-white border-gray-300 text-gray-700 hover:bg-gray-50";

export default function ContentManagementApp() {
  const [activeTab, setActiveTab] = useState<ContentType>("Terms & Conditions");
  const [contentData, setContentData] = useState(initialContentState);

  // Handler for when the "Publish" button is clicked in the editor
  const handlePublish = (newContent: string) => {
    // 1. Update the state with the new content for the active tab
    setContentData((prevData) => ({
      ...prevData,
      [activeTab]: newContent,
    }));

    // 2. Perform mock API save (replace alert with actual API call)
    console.log(`Publishing content for: ${activeTab}`);
    console.log(`New Content: ${newContent.substring(0, 50)}...`);
    alert(`Successfully published new content for "${activeTab}"!`);
  };

  const Section = () => {
    switch (activeTab) {
      case "Terms & Conditions":
        return (
          <ContentEditorSection
            title={activeTab}
            initialContent={contentData[activeTab]}
            onPublish={handlePublish}
          />
        );

      case "Privacy Policy":
        return (
          <ContentEditorSection
            title={activeTab}
            initialContent={contentData[activeTab]}
            onPublish={handlePublish}
          />
        );

      case "Cancellation & Waiting Policy":
        return (
          <ContentEditorSection
            title={activeTab}
            initialContent={contentData[activeTab]}
            onPublish={handlePublish}
          />
        );

      case "FAQ List":
        return <FAQManagement />;

      case "Help Articles List":
        return <ArticleManagement />;

      case "About Us":
        return <AboutUsManagement />;

      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-8 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Content Management
      </h1>

      {/* --- Tab Navigation Section --- */}
      <div className="flex flex-wrap gap-3 mb-8">
        {tabItems.map((item) => (
          <button
            key={item}
            onClick={() => setActiveTab(item)}
            className={`
              px-6 py-3 rounded-full text-base font-medium border transition-all duration-200
              ${activeTab === item ? activeTabClass : inactiveTabClass}
            `}
          >
            {item}
          </button>
        ))}
      </div>

      {/* --- Content Editor Section --- */}
      <div className="py-4">
        <Section />
      </div>
      <div className="pt-8">
        <ContentHistoryTable />
      </div>
    </div>
  );
}
