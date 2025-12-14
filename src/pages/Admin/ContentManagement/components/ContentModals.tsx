import { ContentEntityType } from "@/types/contentManagementType";
import React from "react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import EditContentModal from "./EditContentModal";
import EditFAQModal from "./EditFAQModal";
import EditArticleModal from "./EditArticleModal";
import EditAboutUsModal from "./EditAboutUsModal";

interface ContentModalsProps {
  // Modal states
  deleteModalOpen: boolean;
  editContentModalOpen: boolean;
  editFAQModalOpen: boolean;
  editArticleModalOpen: boolean;
  editAboutUsModalOpen: boolean;
  
  // Selected data
  selectedContentId: number | null;
  selectedContentType: ContentEntityType;
  selectedContentData: any;
  selectedFAQData: any;
  selectedArticleData: any;
  selectedAboutUsData: any;
  
  // Loading states
  isDeletingContent?: boolean;
  isDeletingFAQ?: boolean;
  isDeletingArticle?: boolean;
  isDeletingAboutUs?: boolean;
  isUpdatingContent?: boolean;
  isUpdatingFAQ?: boolean;
  isUpdatingArticle?: boolean;
  isUpdatingAboutUs?: boolean;
  
  // Handlers
  onCloseDeleteModal: () => void;
  onCloseEditContentModal: () => void;
  onCloseEditFAQModal: () => void;
  onCloseEditArticleModal: () => void;
  onCloseEditAboutUsModal: () => void;
  onDeleteConfirm: () => void;
  onEditSave: (data: any, type: ContentEntityType) => void;
}

const ContentModals: React.FC<ContentModalsProps> = ({
  deleteModalOpen,
  editContentModalOpen,
  editFAQModalOpen,
  editArticleModalOpen,
  editAboutUsModalOpen,
//   selectedContentId,
  selectedContentType,
  selectedContentData,
  selectedFAQData,
  selectedArticleData,
  selectedAboutUsData,
  isDeletingContent = false,
  isDeletingFAQ = false,
  isDeletingArticle = false,
  isDeletingAboutUs = false,
  isUpdatingContent = false,
  isUpdatingFAQ = false,
  isUpdatingArticle = false,
  isUpdatingAboutUs = false,
  onCloseDeleteModal,
  onCloseEditContentModal,
  onCloseEditFAQModal,
  onCloseEditArticleModal,
  onCloseEditAboutUsModal,
  onDeleteConfirm,
  onEditSave,
}) => {
  return (
    <>
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={onCloseDeleteModal}
        onConfirm={onDeleteConfirm}
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
        onClose={onCloseEditContentModal}
        contentData={selectedContentData}
        onSave={(data) => onEditSave(data, "content")}
        isLoading={isUpdatingContent}
        contentType="content"
      />

      {/* Edit FAQ Modal */}
      <EditFAQModal
        isOpen={editFAQModalOpen}
        onClose={onCloseEditFAQModal}
        faqData={selectedFAQData}
        onSave={(data) => onEditSave(data, "faq")}
        isLoading={isUpdatingFAQ}
      />

      {/* Edit Article Modal */}
      <EditArticleModal
        isOpen={editArticleModalOpen}
        onClose={onCloseEditArticleModal}
        articleData={selectedArticleData}
        onSave={(data) => onEditSave(data, "article")}
        isLoading={isUpdatingArticle}
      />

      {/* Edit About Us Modal */}
      <EditAboutUsModal
        isOpen={editAboutUsModalOpen}
        onClose={onCloseEditAboutUsModal}
        aboutUsData={selectedAboutUsData}
        onSave={(data) => onEditSave(data, "aboutus")}
        isLoading={isUpdatingAboutUs}
      />
    </>
  );
};

export default ContentModals;