/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import toast from "react-hot-toast";
import ContentHistoryTable from "./components/History";
import {
  CONTENT_TYPE_MAP,
  ContentEntityType,
  ContentType,
  CorrectContentType,
  tabs,
} from "@/types/contentManagementType";
import { useContentApiHooks } from "./components/ContentApiHooks";
import { useContentDataHandler } from "./components/ContentDataHandler";
import ContentTabs from "./components/ContentTabs";
import ContentSection from "./components/ContentSection";
import ContentModals from "./components/ContentModals";
import { ContentLogTable } from "@/components/Shared/DynamicChangeLogTable/ContentLogTable";
import { contentLogColumns } from "./components/contentLogColumns";
import { tabItems } from "@/types/contentManagementType";

export default function ContentManagementApp() {
  const [activeTab, setActiveTab] = useState<ContentType>("Terms & Conditions");
  const [activeTabByRoute, setActiveTabByRoute] =
    useState<CorrectContentType>("User");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editContentModalOpen, setEditContentModalOpen] = useState(false);
  const [editFAQModalOpen, setEditFAQModalOpen] = useState(false);
  const [editArticleModalOpen, setEditArticleModalOpen] = useState(false);
  const [editAboutUsModalOpen, setEditAboutUsModalOpen] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState<number | null>(
    null,
  );
  const [selectedContentData, setSelectedContentData] = useState<any>(null);
  const [selectedFAQData, setSelectedFAQData] = useState<any>(null);
  const [selectedArticleData, setSelectedArticleData] = useState<any>(null);
  const [selectedAboutUsData, setSelectedAboutUsData] = useState<any>(null);
  const [selectedContentType, setSelectedContentType] =
    useState<ContentEntityType>("content");
  const apiHooks = useContentApiHooks();
  const { contentData, setContentData } = useContentDataHandler(
    apiHooks.contentResponse,
  );

  // const route = window.location.pathname;
  // const faq_for = route.includes("content-management-driver")
  //   ? "RAIDER"
  //   : "USER";

  const faq_for = activeTabByRoute === "User" ? "USER" : "RAIDER";

  // const faq_for_1 =
  //   tabs.find((item: CorrectContentType) => item === activeTabByRoute) ||
  //   "USER";
  //   console.log(faq_for_1, "faq_for_1")

  const handlePublish = async (newContent: string) => {
    toast.loading("Publishing content...");
    try {
      const existingContent = apiHooks.contentResponse?.data?.find(
        (item: any) => CONTENT_TYPE_MAP[activeTab] === item.contenttype,
      );

      if (existingContent) {
        const updateData = {
          id: existingContent.id,
          contenttype: CONTENT_TYPE_MAP[activeTab],
          description: newContent,
          isPublished: true,
          faq_for: faq_for,
        };

        const response = await apiHooks.updateContent(updateData).unwrap();

        if (response.success) {
          setContentData((prev) => ({
            ...prev,
            [activeTab]: "",
          }));
          apiHooks.refetchContent();
          toast.dismiss();
          toast.success(response.message || "Content updated successfully!");
        } else {
          toast.dismiss();
          toast.error(response.message || "Failed to update content.");
        }
      } else {
        const contentData = {
          contenttype: CONTENT_TYPE_MAP[activeTab],
          description: newContent,
          isPublished: true,
          faq_for: faq_for,
        };

        const response = await apiHooks.addContent(contentData).unwrap();

        if (response.success) {
          setContentData((prev) => ({
            ...prev,
            [activeTab]: "",
          }));
          apiHooks.refetchContent();
          toast.dismiss();
          toast.success(response.message || "Content published successfully!");
        } else {
          toast.dismiss();
          toast.error(response.message || "Failed to publish content.");
        }
      }
    } catch (error: any) {
      toast.dismiss();
      console.error("Failed to publish content:", error);
      toast.error(error?.data?.message || "Failed to publish content.");
    }
  };
  const handleDeleteClick = (
    id: number,
    type: ContentEntityType,
    data?: any,
  ) => {
    setSelectedContentId(id);
    setSelectedContentType(type);
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
          response = await apiHooks.deleteContent(selectedContentId).unwrap();
          refetchFn = apiHooks.refetchContent;
          successMessage = "Content deleted successfully!";
          break;
        case "faq":
          response = await apiHooks.deleteFAQ(selectedContentId).unwrap();
          refetchFn = apiHooks.refetchFAQ;
          successMessage = "FAQ deleted successfully!";
          break;
        case "article":
          response = await apiHooks.deleteArticle(selectedContentId).unwrap();
          refetchFn = apiHooks.refetchArticles;
          successMessage = "Article deleted successfully!";
          break;
        case "aboutus":
          response = await apiHooks.deleteAboutUs(selectedContentId).unwrap();
          refetchFn = apiHooks.refetchAboutUs;
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
  const handleEditClick = (content: any, type: ContentEntityType) => {
    setSelectedContentType(type);
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
  const handleEditSave = async (updatedData: any, type: ContentEntityType) => {
    try {
      let response;
      let refetchFn;
      let successMessage = "";

      switch (type) {
        case "content":
          response = await apiHooks.updateContent(updatedData).unwrap();
          refetchFn = apiHooks.refetchContent;
          successMessage = "Content updated successfully!";
          break;
        case "faq":
          response = await apiHooks.updateFAQ(updatedData).unwrap();
          refetchFn = apiHooks.refetchFAQ;
          successMessage = "FAQ updated successfully!";
          break;
        case "article":
          response = await apiHooks.updateArticle(updatedData).unwrap();
          refetchFn = apiHooks.refetchArticles;
          successMessage = "Article updated successfully!";
          break;
        case "aboutus":
          response = await apiHooks.updateAboutUs(updatedData).unwrap();
          refetchFn = apiHooks.refetchAboutUs;
          successMessage = "About Us content updated successfully!";
          break;
        default:
          throw new Error("Unknown content type");
      }
      if (response?.success) {
        toast.success(successMessage);
        if (refetchFn) refetchFn();
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
  const getActiveTabData = () => {
    switch (activeTab) {
      case "Terms & Conditions":
      case "Privacy Policy":
      case "Cancellation & Waiting Policy":
        const apiType = CONTENT_TYPE_MAP[activeTab];
        return (
          apiHooks.contentResponse?.data?.filter(
            (item: any) =>
              item.contenttype === apiType && item.faq_for === faq_for,
          ) || []
        );

      case "FAQ List":
        return (
          apiHooks.faqResponse?.data
            ?.filter((item: any) => item.faq_for === faq_for)
            ?.map((item: any) => ({
              id: item.id,
              contenttype: "FAQ",
              description: item.question,
              isPublished: item.isActive,
              version: null,
              answer: item.answer,
              question: item.question,
              isActive: item.isActive,
              faq_for: item.faq_for,
            })) || []
        );
      case "Help Articles List":
        return (
          apiHooks.articleResponse?.data
            ?.filter((item: any) => item.faq_for === faq_for)
            ?.map((item: any) => ({
              id: item.id,
              contenttype: "ARTICLE",
              description: item.title,
              content: item.content,
              isPublished: item.published,
              version: null,
              title: item.title,
              published: item.published,
              faq_for: item.faq_for,
            })) || []
        );
      case "About Us":
        return (
          apiHooks.aboutUsResponse?.data
            ?.filter((item: any) => item.faq_for === faq_for)
            ?.map((item: any) => ({
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
  const handleToggleStatus = async (id: number, isPublished: boolean) => {
    try {
      switch (activeTab) {
        case "Terms & Conditions":
        case "Privacy Policy":
        case "Cancellation & Waiting Policy":
          const content = apiHooks.contentResponse?.data?.find(
            (item: any) => item.id === id,
          );
          if (content) {
            const updateData = {
              id,
              contenttype: content.contenttype,
              description: content.description,
              isPublished,
            };
            await apiHooks.updateContent(updateData).unwrap();
            apiHooks.refetchContent();
            toast.success(
              `Content ${
                isPublished ? "activated" : "deactivated"
              } successfully!`,
            );
          }
          break;

        case "FAQ List":
          await apiHooks.updateFAQStatus(id).unwrap();
          apiHooks.refetchFAQ();
          toast.success(`FAQ status updated successfully!`);
          break;

        case "Help Articles List":
          await apiHooks.updateArticleStatus(id).unwrap();
          apiHooks.refetchArticles();
          toast.success(`Article status updated successfully!`);
          break;

        case "About Us":
          await apiHooks.updateAboutUsStatus(id).unwrap();
          apiHooks.refetchAboutUs();
          toast.success(`About Us status updated successfully!`);
          break;
      }
    } catch (error: any) {
      console.error("Failed to update status:", error);
      toast.error(error?.data?.message || "Failed to update status.");
    }
  };
  const handlePublishFAQ = async (
    faqData: { question: string; answer: string }[],
  ) => {
    try {
      const promises = faqData.map(async (faq) => {
        if (faq.question.trim() && faq.answer.trim()) {
          return await apiHooks
            .addFAQ({
              question: faq.question,
              faq_for: faq_for,
              answer: faq.answer,
            })
            .unwrap();
        }
        return null;
      });

      const results = await Promise.all(promises);
      const successful = results.filter((r: any) => r?.success);

      if (successful.length > 0) {
        toast.success(`${successful.length} FAQ(s) published successfully!`);
        apiHooks.refetchFAQ();
      }
    } catch (error: any) {
      console.error("Failed to publish FAQs:", error);
      toast.error(error?.data?.message || "Failed to publish FAQs.");
    }
  };
  const handlePublishArticle = async (articleData: {
    title: string;
    content: string;
  }) => {
    try {
      const response = await apiHooks.addArticle(articleData).unwrap();

      if (response.success) {
        toast.success("Article published successfully!");
        apiHooks.refetchArticles();
      } else {
        toast.error(response.message || "Failed to publish article.");
      }
    } catch (error: any) {
      console.error("Failed to publish article:", error);
      toast.error(error?.data?.message || "Failed to publish article.");
    }
  };
  const handlePublishAboutUs = async (aboutUsData: {
    title: string;
    content: string;
  }) => {
    try {
      const response = await apiHooks.addAboutUs(aboutUsData).unwrap();

      if (response.success) {
        toast.success("About Us content published successfully!");
        apiHooks.refetchAboutUs();
      } else {
        toast.error(response.message || "Failed to publish About Us content.");
      }
    } catch (error: any) {
      console.error("Failed to publish About Us content:", error);
      toast.error(
        error?.data?.message || "Failed to publish About Us content.",
      );
    }
  };

  return (
    <div className="p-4 md:p-8 bg-white min-h-screen">
      <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
        Content Management
      </h1>

      <ContentTabs
        activeTab={activeTabByRoute}
        setActiveTab={setActiveTabByRoute}
        tabs={tabs}
      />

      <ContentTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        disabled={apiHooks.isAddingContent || apiHooks.isUpdatingContent}
        tabs={tabItems}
      />
      <div className="py-4">
        <ContentSection
          activeTab={activeTab}
          contentData={contentData}
          onPublish={handlePublish}
          onPublishFAQ={handlePublishFAQ}
          onPublishArticle={handlePublishArticle}
          onPublishAboutUs={handlePublishAboutUs}
          onDelete={handleDeleteClick}
          onEdit={handleEditClick}
          faqResponse={apiHooks.faqResponse}
          articleResponse={apiHooks.articleResponse}
          aboutUsResponse={apiHooks.aboutUsResponse}
          isAddingContent={apiHooks.isAddingContent}
          isUpdatingContent={apiHooks.isUpdatingContent}
          isAddingFAQ={apiHooks.isAddingFAQ}
          isUpdatingFAQ={apiHooks.isUpdatingFAQ}
          isAddingArticle={apiHooks.isAddingArticle}
          isUpdatingArticle={apiHooks.isUpdatingArticle}
          isAddingAboutUs={apiHooks.isAddingAboutUs}
          isUpdatingAboutUs={apiHooks.isUpdatingAboutUs}
          faq_for={faq_for}
        />
      </div>
      <div className="pt-8">
        <ContentHistoryTable
          data={getActiveTabData()}
          onEdit={(content) => {
            let type: ContentEntityType = "content";
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
            let type: ContentEntityType = "content";
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
            const data = getActiveTabData().find((item: any) => item.id === id);
            handleDeleteClick(id, type, data);
          }}
          onToggleStatus={handleToggleStatus}
          activeTab={activeTab}
        />
      </div>

      {/* All Modals */}
      <ContentModals
        deleteModalOpen={deleteModalOpen}
        editContentModalOpen={editContentModalOpen}
        editFAQModalOpen={editFAQModalOpen}
        editArticleModalOpen={editArticleModalOpen}
        editAboutUsModalOpen={editAboutUsModalOpen}
        selectedContentId={selectedContentId}
        selectedContentType={selectedContentType}
        selectedContentData={selectedContentData}
        selectedFAQData={selectedFAQData}
        selectedArticleData={selectedArticleData}
        selectedAboutUsData={selectedAboutUsData}
        isDeletingContent={apiHooks.isDeletingContent}
        isDeletingFAQ={apiHooks.isDeletingFAQ}
        isDeletingArticle={apiHooks.isDeletingArticle}
        isDeletingAboutUs={apiHooks.isDeletingAboutUs}
        isUpdatingContent={apiHooks.isUpdatingContent}
        isUpdatingFAQ={apiHooks.isUpdatingFAQ}
        isUpdatingArticle={apiHooks.isUpdatingArticle}
        isUpdatingAboutUs={apiHooks.isUpdatingAboutUs}
        onCloseDeleteModal={() => {
          setDeleteModalOpen(false);
          setSelectedContentId(null);
          setSelectedContentType("content");
          setSelectedContentData(null);
          setSelectedFAQData(null);
          setSelectedArticleData(null);
          setSelectedAboutUsData(null);
        }}
        onCloseEditContentModal={() => {
          setEditContentModalOpen(false);
          setSelectedContentData(null);
        }}
        onCloseEditFAQModal={() => {
          setEditFAQModalOpen(false);
          setSelectedFAQData(null);
        }}
        onCloseEditArticleModal={() => {
          setEditArticleModalOpen(false);
          setSelectedArticleData(null);
        }}
        onCloseEditAboutUsModal={() => {
          setEditAboutUsModalOpen(false);
          setSelectedAboutUsData(null);
        }}
        onDeleteConfirm={handleDeleteConfirm}
        onEditSave={handleEditSave}
      />

      <div className="mt-6">
        <ContentLogTable
          columns={contentLogColumns}
          activeTab={activeTab}
          activeTabByRoute={activeTabByRoute}
        />
      </div>
    </div>
  );
}
