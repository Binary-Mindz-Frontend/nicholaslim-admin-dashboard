import { useState, useEffect } from "react";
import ContentEditorSection from "./components/ContentEditorSection";
import FAQManagement from "./components/FAQSection";
import ArticleManagement from "./components/HelpArticle";
import AboutUsManagement from "./components/AboutUs";
import ContentHistoryTable from "./components/History";
import {
  useAddContentMutation,
  useDeleteContentMutation,
  useGetContentQuery,
  useUpdateContentMutation,
} from "@/redux/features/contentManagement/contentManagementApi";
import {
  useGetFAQQuery,
  useAddFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
  useUpdateFAQStatusMutation,
} from "@/redux/features/faq/faqApi";
import {
  useGetArticlesQuery,
  useAddArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useUpdateArticleStatusMutation,
} from "@/redux/features/article/articleApi";
import {
  useGetAboutUsQuery,
  useAddAboutUsMutation,
  useUpdateAboutUsMutation,
  useDeleteAboutUsMutation,
  useUpdateAboutUsStatusMutation,
} from "@/redux/features/aboutUs/aboutUsApi";
import toast from "react-hot-toast";
import EditContentModal from "./components/EditContentModal";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import EditFAQModal from "./components/EditFAQModal";
import EditArticleModal from "./components/EditArticleModal";
import EditAboutUsModal from "./components/EditAboutUsModal";

// Define content types that match API enum values
export type ContentType =
  | "Terms & Conditions"
  | "Privacy Policy"
  | "Cancellation & Waiting Policy"
  | "FAQ List"
  | "Help Articles List"
  | "About Us";

// Map UI content types to API enum values
const CONTENT_TYPE_MAP: Record<ContentType, string> = {
  "Terms & Conditions": "TERMSANDCONDITION",
  "Privacy Policy": "PRIVANCYPOLICY",
  "Cancellation & Waiting Policy": "CANCELLATIONANDWAITINGPOLICY",
  "FAQ List": "FAQ",
  "Help Articles List": "HELPARTICLES",
  "About Us": "ABOUTUS",
};

// Reverse mapping for API to UI
const API_TO_UI_MAP: Record<string, ContentType> = {
  TERMSANDCONDITION: "Terms & Conditions",
  PRIVACYPOLICY: "Privacy Policy",
  CANCELLATIONANDWAITINGPOLICY: "Cancellation & Waiting Policy",
  FAQ: "FAQ List",
  HELPARTICLES: "Help Articles List",
  ABOUTUS: "About Us",
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
  const [contentData, setContentData] = useState<Record<ContentType, string>>({
    "Terms & Conditions": "",
    "Privacy Policy": "",
    "Cancellation & Waiting Policy": "",
    "FAQ List": "",
    "Help Articles List": "",
    "About Us": "",
  });

  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editContentModalOpen, setEditContentModalOpen] = useState(false);
  const [editFAQModalOpen, setEditFAQModalOpen] = useState(false);
  const [editArticleModalOpen, setEditArticleModalOpen] = useState(false);
  const [editAboutUsModalOpen, setEditAboutUsModalOpen] = useState(false);

  // Selected data states
  const [selectedContentId, setSelectedContentId] = useState<number | null>(
    null
  );
  const [selectedContentData, setSelectedContentData] = useState<any>(null);
  const [selectedFAQData, setSelectedFAQData] = useState<any>(null);
  const [selectedArticleData, setSelectedArticleData] = useState<any>(null);
  const [selectedAboutUsData, setSelectedAboutUsData] = useState<any>(null);

  const [selectedContentType, setSelectedContentType] = useState<
    "content" | "faq" | "article" | "aboutus"
  >("content");

  // API hooks for Content Management
  const [addContent, { isLoading: isAddingContent }] = useAddContentMutation();
  const { data: contentResponse, refetch: refetchContent } =
    useGetContentQuery("");
  const [updateContent, { isLoading: isUpdatingContent }] =
    useUpdateContentMutation();
  const [deleteContent, { isLoading: isDeletingContent }] =
    useDeleteContentMutation();

  // API hooks for FAQ
  const { data: faqResponse, refetch: refetchFAQ } = useGetFAQQuery("");
  const [addFAQ, { isLoading: isAddingFAQ }] = useAddFAQMutation();
  const [updateFAQ, { isLoading: isUpdatingFAQ }] = useUpdateFAQMutation();
  const [updateFAQStatus] =
    useUpdateFAQStatusMutation();
  const [deleteFAQ, { isLoading: isDeletingFAQ }] = useDeleteFAQMutation();

  // API hooks for Articles
  const { data: articleResponse, refetch: refetchArticles } =
    useGetArticlesQuery("");
  const [addArticle, { isLoading: isAddingArticle }] = useAddArticleMutation();
  const [updateArticle, { isLoading: isUpdatingArticle }] =
    useUpdateArticleMutation();
  const [updateArticleStatus] =
    useUpdateArticleStatusMutation();
  const [deleteArticle, { isLoading: isDeletingArticle }] =
    useDeleteArticleMutation();

  // API hooks for About Us
  const { data: aboutUsResponse, refetch: refetchAboutUs } =
    useGetAboutUsQuery("");
  const [addAboutUs, { isLoading: isAddingAboutUs }] = useAddAboutUsMutation();
  const [updateAboutUs, { isLoading: isUpdatingAboutUs }] =
    useUpdateAboutUsMutation();
  const [updateAboutUsStatus] =
    useUpdateAboutUsStatusMutation();
  const [deleteAboutUs, { isLoading: isDeletingAboutUs }] =
    useDeleteAboutUsMutation();

  // Load content data from API
  useEffect(() => {
    if (contentResponse?.data) {
      const newContentData: Record<ContentType, string> = {
        "Terms & Conditions": "",
        "Privacy Policy": "",
        "Cancellation & Waiting Policy": "",
        "FAQ List": "",
        "Help Articles List": "",
        "About Us": "",
      };

      contentResponse.data.forEach((item: any) => {
        const uiType = API_TO_UI_MAP[item.contenttype];
        if (uiType) {
          newContentData[uiType] = item.description;
        }
      });

      setContentData(newContentData);
    }
  }, [contentResponse]);

  // Handler for when the "Publish" button is clicked for regular content
  const handlePublish = async (newContent: string) => {
    try {
      // Check if content already exists for this type
      const existingContent = contentResponse?.data?.find(
        (item: any) => CONTENT_TYPE_MAP[activeTab] === item.contenttype
      );

      if (existingContent) {
        // Update existing content
        const updateData = {
          id: existingContent.id,
          contenttype: CONTENT_TYPE_MAP[activeTab],
          description: newContent,
          isPublished: true,
        };

        const response = await updateContent(updateData).unwrap();

        if (response.success) {
          setContentData((prev) => ({
            ...prev,
            [activeTab]: newContent,
          }));
          refetchContent();
          toast.success(response.message || "Content updated successfully!");
        } else {
          toast.error(response.message || "Failed to update content.");
        }
      } else {
        // Create new content
        const contentData = {
          contenttype: CONTENT_TYPE_MAP[activeTab],
          description: newContent,
          isPublished: true,
        };

        const response = await addContent(contentData).unwrap();

        if (response.success) {
          setContentData((prev) => ({
            ...prev,
            [activeTab]: newContent,
          }));
          refetchContent();
          toast.success(response.message || "Content published successfully!");
        } else {
          toast.error(response.message || "Failed to publish content.");
        }
      }
    } catch (error: any) {
      console.error("Failed to publish content:", error);
      toast.error(error?.data?.message || "Failed to publish content.");
    }
  };

  // Handle delete action for all content types
  const handleDeleteClick = (
    id: number,
    type: "content" | "faq" | "article" | "aboutus",
    data?: any
  ) => {
    setSelectedContentId(id);
    setSelectedContentType(type);

    // Set the appropriate data based on type
    if (type === "faq") setSelectedFAQData(data);
    else if (type === "article") setSelectedArticleData(data);
    else if (type === "aboutus") setSelectedAboutUsData(data);
    else setSelectedContentData(data);

    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedContentId) return;

    try {
      let response;
      let refetchFn;
      let successMessage = "";

      switch (selectedContentType) {
        case "content":
          response = await deleteContent(selectedContentId).unwrap();
          refetchFn = refetchContent;
          successMessage = "Content deleted successfully!";
          break;
        case "faq":
          response = await deleteFAQ(selectedContentId).unwrap();
          refetchFn = refetchFAQ;
          successMessage = "FAQ deleted successfully!";
          break;
        case "article":
          response = await deleteArticle(selectedContentId).unwrap();
          refetchFn = refetchArticles;
          successMessage = "Article deleted successfully!";
          break;
        case "aboutus":
          response = await deleteAboutUs(selectedContentId).unwrap();
          refetchFn = refetchAboutUs;
          successMessage = "About Us content deleted successfully!";
          break;
        default:
          throw new Error("Unknown content type");
      }

      if (response?.success) {
        toast.success(successMessage);
        if (refetchFn) refetchFn();
        setDeleteModalOpen(false);
        setSelectedContentId(null);
        setSelectedContentData(null);
        setSelectedFAQData(null);
        setSelectedArticleData(null);
        setSelectedAboutUsData(null);
      } else if (response?.message) {
        toast.error(response.message || "Failed to delete content.");
      }
    } catch (error: any) {
      console.error("Failed to delete content:", error);
      toast.error(error?.data?.message || "Failed to delete content.");
      setDeleteModalOpen(false);
      setSelectedContentId(null);
    }
  };

  // Handle edit action
  const handleEditClick = (
    content: any,
    type: "content" | "faq" | "article" | "aboutus"
  ) => {
    setSelectedContentType(type);

    // Open the appropriate modal
    switch (type) {
      case "content":
        setSelectedContentData(content);
        setEditContentModalOpen(true);
        break;
      case "faq":
        setSelectedFAQData(content);
        setEditFAQModalOpen(true);
        break;
      case "article":
        setSelectedArticleData(content);
        setEditArticleModalOpen(true);
        break;
      case "aboutus":
        setSelectedAboutUsData(content);
        setEditAboutUsModalOpen(true);
        break;
    }
  };

  const handleEditSave = async (
    updatedData: any,
    type: "content" | "faq" | "article" | "aboutus"
  ) => {
    try {
      let response;
      let refetchFn;
      let successMessage = "";

      switch (type) {
        case "content":
          response = await updateContent(updatedData).unwrap();
          refetchFn = refetchContent;
          successMessage = "Content updated successfully!";
          break;
        case "faq":
          response = await updateFAQ(updatedData).unwrap();
          refetchFn = refetchFAQ;
          successMessage = "FAQ updated successfully!";
          break;
        case "article":
          response = await updateArticle(updatedData).unwrap();
          refetchFn = refetchArticles;
          successMessage = "Article updated successfully!";
          break;
        case "aboutus":
          console.log(updatedData);
          response = await updateAboutUs(updatedData).unwrap();
          refetchFn = refetchAboutUs;
          successMessage = "About Us content updated successfully!";
          break;
        default:
          throw new Error("Unknown content type");
      }

      if (response?.success) {
        toast.success(successMessage);
        if (refetchFn) refetchFn();

        // Close the appropriate modal
        switch (type) {
          case "content":
            setEditContentModalOpen(false);
            setSelectedContentData(null);
            break;
          case "faq":
            setEditFAQModalOpen(false);
            setSelectedFAQData(null);
            break;
          case "article":
            setEditArticleModalOpen(false);
            setSelectedArticleData(null);
            break;
          case "aboutus":
            setEditAboutUsModalOpen(false);
            setSelectedAboutUsData(null);
            break;
        }
      } else if (response?.message) {
        toast.error(response.message || "Failed to update content.");
      }
    } catch (error: any) {
      console.error("Failed to update content:", error);
      toast.error(error?.data?.message || "Failed to update content.");
    }
  };

  // Get data for active tab
  const getActiveTabData = () => {
    switch (activeTab) {
      case "Terms & Conditions":
      case "Privacy Policy":
      case "Cancellation & Waiting Policy":
        const apiType = CONTENT_TYPE_MAP[activeTab];
        return (
          contentResponse?.data?.filter(
            (item: any) => item.contenttype === apiType
          ) || []
        );

      case "FAQ List":
        return (
          faqResponse?.data?.map((item: any) => ({
            id: item.id,
            contenttype: "FAQ",
            description: item.question,
            isPublished: item.isActive,
            version: null,
            answer: item.answer,
            question: item.question,
            isActive: item.isActive,
          })) || []
        );

      case "Help Articles List":
        return (
          articleResponse?.data?.map((item: any) => ({
            id: item.id,
            contenttype: "ARTICLE",
            description: item.title,
            content: item.content,
            isPublished: item.published,
            version: null,
            title: item.title,
            published: item.published,
          })) || []
        );

      case "About Us":
        return (
          aboutUsResponse?.data?.map((item: any) => ({
            id: item.id,
            contenttype: "ABOUTUS",
            description: item.title,
            content: item.content,
            isPublished: item.isActive,
            version: null,
            title: item.title,
            isActive: item.isActive,
          })) || []
        );

      default:
        return [];
    }
  };

  // Handle toggle status for all content types - FIXED VERSION
  const handleToggleStatus = async (id: number, isPublished: boolean) => {
    try {
      switch (activeTab) {
        case "Terms & Conditions":
        case "Privacy Policy":
        case "Cancellation & Waiting Policy":
          const content = contentResponse?.data?.find(
            (item: any) => item.id === id
          );
          if (content) {
            const updateData = {
              id,
              contenttype: content.contenttype,
              description: content.description,
              isPublished,
            };
            await updateContent(updateData).unwrap();
            refetchContent();
            toast.success(
              `Content ${
                isPublished ? "activated" : "deactivated"
              } successfully!`
            );
          }
          break;

        case "FAQ List":
          // Fixed: Pass only id, not { id, ...data }
          await updateFAQStatus(id).unwrap();
          refetchFAQ();
          toast.success(
            `FAQ status updated successfully!`
          );
          break;

        case "Help Articles List":
          // Fixed: Pass only id, not { id, ...data }
          await updateArticleStatus(id).unwrap();
          refetchArticles();
          toast.success(
            `Article status updated successfully!`
          );
          break;

        case "About Us":
          // Fixed: Pass only id, not { id, ...data }
          await updateAboutUsStatus(id).unwrap();
          refetchAboutUs();
          toast.success(
            `About Us status updated successfully!`
          );
          break;
      }
    } catch (error: any) {
      console.error("Failed to update status:", error);
      toast.error(error?.data?.message || "Failed to update status.");
    }
  };

  // Handle publish for FAQ
  const handlePublishFAQ = async (faqData: { question: string; answer: string }[]) => {
    try {
      const promises = faqData.map(async (faq) => {
        if (faq.question.trim() && faq.answer.trim()) {
          return await addFAQ({
            question: faq.question,
            answer: faq.answer
          }).unwrap();
        }
        return null;
      });

      const results = await Promise.all(promises);
      const successful = results.filter(r => r?.success);
      
      if (successful.length > 0) {
        toast.success(`${successful.length} FAQ(s) published successfully!`);
        refetchFAQ();
      }
    } catch (error: any) {
      console.error("Failed to publish FAQs:", error);
      toast.error(error?.data?.message || "Failed to publish FAQs.");
    }
  };

  // Handle publish for Article
  const handlePublishArticle = async (articleData: { title: string; content: string }) => {
    try {
      const response = await addArticle(articleData).unwrap();
      
      if (response.success) {
        toast.success("Article published successfully!");
        refetchArticles();
      } else {
        toast.error(response.message || "Failed to publish article.");
      }
    } catch (error: any) {
      console.error("Failed to publish article:", error);
      toast.error(error?.data?.message || "Failed to publish article.");
    }
  };

  // Handle publish for About Us
  const handlePublishAboutUs = async (aboutUsData: { title: string; content: string }) => {
    try {
      const response = await addAboutUs(aboutUsData).unwrap();
      
      if (response.success) {
        toast.success("About Us content published successfully!");
        refetchAboutUs();
      } else {
        toast.error(response.message || "Failed to publish About Us content.");
      }
    } catch (error: any) {
      console.error("Failed to publish About Us content:", error);
      toast.error(error?.data?.message || "Failed to publish About Us content.");
    }
  };

  const Section = () => {
    switch (activeTab) {
      case "Terms & Conditions":
      case "Privacy Policy":
      case "Cancellation & Waiting Policy":
        return (
          <ContentEditorSection
            title={activeTab}
            initialContent={contentData[activeTab]}
            onPublish={handlePublish}
            isLoading={isAddingContent || isUpdatingContent}
          />
        );

      case "About Us":
        return (
          <AboutUsManagement
            onDelete={(id: number, type: "aboutus", data: any) =>
              handleDeleteClick(id, type, data)
            }
            onEdit={(content, type) => handleEditClick(content, type)}
            onPublish={handlePublishAboutUs}
            data={aboutUsResponse?.data || []}
            isLoading={isAddingAboutUs || isUpdatingAboutUs}
          />
        );

      case "FAQ List":
        return (
          <FAQManagement
            onDelete={(id: number, type: "faq", data: any) =>
              handleDeleteClick(id, type, data)
            }
            onEdit={(content, type) => handleEditClick(content, type)}
            onPublish={handlePublishFAQ}
            data={faqResponse?.data || []}
            isLoading={isAddingFAQ || isUpdatingFAQ}
          />
        );

      case "Help Articles List":
        return (
          <ArticleManagement
            onDelete={(id: number, type: "article", data: any) =>
              handleDeleteClick(id, type, data)
            }
            onEdit={(content, type) => handleEditClick(content, type)}
            onPublish={handlePublishArticle}
            data={articleResponse?.data || []}
            isLoading={isAddingArticle || isUpdatingArticle}
          />
        );

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
              px-6 py-3 rounded-full text-base font-medium border transition-all duration-200 cursor-pointer
              ${activeTab === item ? activeTabClass : inactiveTabClass}
            `}
            disabled={isAddingContent || isUpdatingContent}
          >
            {item}
          </button>
        ))}
      </div>

      {/* --- Content Editor Section --- */}
      <div className="py-4">
        <Section />
      </div>

      {/* --- History Table --- */}
      <div className="pt-8">
        <ContentHistoryTable
          data={getActiveTabData()}
          onEdit={(content) => {
            // Determine type based on active tab
            let type: "content" | "faq" | "article" | "aboutus" = "content";
            switch (activeTab) {
              case "FAQ List":
                type = "faq";
                break;
              case "Help Articles List":
                type = "article";
                break;
              case "About Us":
                type = "aboutus";
                break;
              default:
                type = "content";
            }
            handleEditClick(content, type);
          }}
          onDelete={(id) => {
            // Determine type based on active tab
            let type: "content" | "faq" | "article" | "aboutus" = "content";
            switch (activeTab) {
              case "FAQ List":
                type = "faq";
                break;
              case "Help Articles List":
                type = "article";
                break;
              case "About Us":
                type = "aboutus";
                break;
              default:
                type = "content";
            }

            // Find the data to pass
            const data = getActiveTabData().find((item: any) => item.id === id);
            handleDeleteClick(id, type, data);
          }}
          onToggleStatus={handleToggleStatus}
          activeTab={activeTab}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedContentId(null);
          setSelectedContentType("content");
          setSelectedContentData(null);
          setSelectedFAQData(null);
          setSelectedArticleData(null);
          setSelectedAboutUsData(null);
        }}
        onConfirm={handleDeleteConfirm}
        isLoading={
          isDeletingContent ||
          isDeletingFAQ ||
          isDeletingArticle ||
          isDeletingAboutUs
        }
        contentType={selectedContentType}
      />

      {/* Edit Content Modal */}
      <EditContentModal
        isOpen={editContentModalOpen}
        onClose={() => {
          setEditContentModalOpen(false);
          setSelectedContentData(null);
        }}
        contentData={selectedContentData}
        onSave={(data) => handleEditSave(data, "content")}
        isLoading={isUpdatingContent}
        contentType="content"
      />

      {/* Edit FAQ Modal */}
      <EditFAQModal
        isOpen={editFAQModalOpen}
        onClose={() => {
          setEditFAQModalOpen(false);
          setSelectedFAQData(null);
        }}
        faqData={selectedFAQData}
        onSave={(data) => handleEditSave(data, "faq")}
        isLoading={isUpdatingFAQ}
      />

      {/* Edit Article Modal */}
      <EditArticleModal
        isOpen={editArticleModalOpen}
        onClose={() => {
          setEditArticleModalOpen(false);
          setSelectedArticleData(null);
        }}
        articleData={selectedArticleData}
        onSave={(data) => handleEditSave(data, "article")}
        isLoading={isUpdatingArticle}
      />

      {/* Edit About Us Modal */}
      <EditAboutUsModal
        isOpen={editAboutUsModalOpen}
        onClose={() => {
          setEditAboutUsModalOpen(false);
          setSelectedAboutUsData(null);
        }}
        aboutUsData={selectedAboutUsData}
        onSave={(data) => handleEditSave(data, "aboutus")}
        isLoading={isUpdatingAboutUs}
      />
    </div>
  );
}