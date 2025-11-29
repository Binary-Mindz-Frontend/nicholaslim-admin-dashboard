import React, { useState } from "react";

// --- DATA STRUCTURES ---

interface AboutUsContent {
  title: string;
  text: string;
}

// --- MAIN ABOUT US MANAGEMENT COMPONENT ---

export default function AboutUsManagement() {
  const MAX_CHARACTERS = 1000; // Character limit for the About Us text

  // State for the About Us content
  const [aboutUs, setAboutUs] = useState<AboutUsContent>({
    title: "",
    text: "",
  });

  // Handler for input changes (title and text area)
  const handleInputChange = (field: "title" | "text", value: string) => {
    if (field === "text" && value.length > MAX_CHARACTERS) {
      // Prevent exceeding character limit for text area
      value = value.substring(0, MAX_CHARACTERS);
    }
    setAboutUs((prev) => ({ ...prev, [field]: value }));
  };

  // Handler for the Publish button
  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aboutUs.title.trim() || !aboutUs.text.trim()) {
      console.error(
        "Please enter both the title and About Us text before publishing."
      );
      // In a real application, you'd show a user-friendly error message (e.g., toast, modal)
      return;
    }
    console.log("Publishing About Us content:", aboutUs);
    // In a real application, you'd send this data to an API
    console.log("About Us content published successfully!");
    // In a real application, you'd show a success message to the user
  };

  // Style classes
  const inputClasses =
    "w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 text-base shadow-sm";
  const buttonPrimary =
    "bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-16 rounded-xl text-lg transition-colors shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-yellow-300 cursor-pointer";

  return (
    <div className="bg-white rounded-xl  p-6 md:p-10">
      <div className="max-w-4xl m-auto">
        <form onSubmit={handlePublish} className="space-y-8">
          {/* Title Input Section */}
          <div>
            <label
              htmlFor="about-us-title"
              className="block text-xl font-bold text-gray-900 mb-2"
            >
              Title
            </label>
            <input
              id="about-us-title"
              type="text"
              value={aboutUs.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter title for article"
              className={inputClasses}
              required
            />
          </div>

          {/* About Us Text Area Section with Character Counter */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <label
                htmlFor="about-us-text"
                className="block text-xl font-bold text-gray-900"
              >
                About us Text
              </label>
              <span className="text-sm text-gray-500">
                {aboutUs.text.length}/{MAX_CHARACTERS}
              </span>
            </div>
            <textarea
              id="about-us-text"
              rows={15}
              value={aboutUs.text}
              onChange={(e) => handleInputChange("text", e.target.value)}
              placeholder="Enter your text here..."
              className={`${inputClasses} resize-y`}
              required
            />
          </div>

          {/* Publish Button */}
          <div className="flex justify-center pt-4">
            <button type="submit" className={buttonPrimary}>
              Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
