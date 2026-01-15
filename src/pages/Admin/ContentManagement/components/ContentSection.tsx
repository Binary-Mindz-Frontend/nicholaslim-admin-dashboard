import React from "react";
import ContentEditorSection from "./ContentEditorSection";
import { ContentEntityType, ContentType } from "@/types/contentManagementType";
import AboutUsManagement from "./AboutUs";
import FAQManagement from "./FAQSection";
import ArticleManagement from "./HelpArticle";

interface ContentSectionProps {
  activeTab: ContentType;
  contentData: Record<ContentType, string>;
  onPublish: (content: string) => void;
  onPublishFAQ: (faqData: { question: string; answer: string, faq_for?: string }[]) => void;
  onPublishArticle: (articleData: { title: string; content: string, faq_for?: string }) => void;
  onPublishAboutUs: (aboutUsData: { title: string; content: string, faq_for?: string }) => void;
  onDelete: (id: number, type: ContentEntityType, data?: any) => void;
  onEdit: (content: any, type: ContentEntityType, faq_for?: string) => void;
  
  // API responses
  faqResponse?: any;
  articleResponse?: any;
  aboutUsResponse?: any;
  
  // Loading states
  isAddingContent?: boolean;
  isUpdatingContent?: boolean;
  isAddingFAQ?: boolean;
  isUpdatingFAQ?: boolean;
  isAddingArticle?: boolean;
  isUpdatingArticle?: boolean;
  isAddingAboutUs?: boolean;
  isUpdatingAboutUs?: boolean;
  faq_for?: string
}

const ContentSection: React.FC<ContentSectionProps> = ({
  activeTab,
  contentData,
  onPublish,
  onPublishFAQ,
  onPublishArticle,
  onPublishAboutUs,
  onDelete,
  onEdit,
  faqResponse,
  articleResponse,
  aboutUsResponse,
  isAddingContent = false,
  isUpdatingContent = false,
  isAddingFAQ = false,
  isUpdatingFAQ = false,
  isAddingArticle = false,
  isUpdatingArticle = false,
  isAddingAboutUs = false,
  isUpdatingAboutUs = false,
  faq_for
}) => {
  switch (activeTab) {
    case "Terms & Conditions":
    case "Privacy Policy":
    case "Cancellation & Waiting Policy":
      return (
        <ContentEditorSection
          title={activeTab}
          initialContent={contentData[activeTab]}
          onPublish={onPublish}
          isLoading={isAddingContent || isUpdatingContent}
        />
      );

    case "About Us":
      return (
        <AboutUsManagement
          onDelete={(id: number, type: "aboutus", data: any) =>
            onDelete(id, type, data)
          }
          onEdit={(content, type, faq_for) => onEdit(content, type, faq_for)}
          onPublish={onPublishAboutUs}
          data={aboutUsResponse?.data || []}
          isLoading={isAddingAboutUs || isUpdatingAboutUs}
          faq_for={faq_for}
        />
      );

    case "FAQ List":
      return (
        <FAQManagement
          onDelete={(id: number, type: "faq", data: any) =>
            onDelete(id, type, data)
          }
          onEdit={(content, type, faq_for) => onEdit(content, type, faq_for)}
          onPublish={onPublishFAQ}
          data={faqResponse?.data || []}
          isLoading={isAddingFAQ || isUpdatingFAQ}
          faq_for={faq_for}
        />
      );

    case "Help Articles List":
      return (
        <ArticleManagement
          onDelete={(id: number, type: "article", data: any) =>
            onDelete(id, type, data)
          }
          onEdit={(content, type, faq_for) => onEdit(content, type, faq_for)}
          onPublish={onPublishArticle}
          data={articleResponse?.data || []}
          isLoading={isAddingArticle || isUpdatingArticle}
          faq_for={faq_for}
        />
      );

    default:
      return null;
  }
};

export default ContentSection;