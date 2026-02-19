import {
  useAddContentMutation,
  useDeleteContentMutation,
  useGetAllContentLogsQuery,
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

export const useContentApiHooks = () => {
  // Content Management API hooks
  const [addContent, { isLoading: isAddingContent }] = useAddContentMutation();
  const { data: contentResponse, refetch: refetchContent } = useGetContentQuery("");
  const [updateContent, { isLoading: isUpdatingContent }] = useUpdateContentMutation();
  const [deleteContent, { isLoading: isDeletingContent }] = useDeleteContentMutation();

  // FAQ API hooks
  const { data: faqResponse, refetch: refetchFAQ } = useGetFAQQuery("");
  const [addFAQ, { isLoading: isAddingFAQ }] = useAddFAQMutation();
  const [updateFAQ, { isLoading: isUpdatingFAQ }] = useUpdateFAQMutation();
  const [updateFAQStatus] = useUpdateFAQStatusMutation();
  const [deleteFAQ, { isLoading: isDeletingFAQ }] = useDeleteFAQMutation();

  // Articles API hooks
  const { data: articleResponse, refetch: refetchArticles } = useGetArticlesQuery("");
  const [addArticle, { isLoading: isAddingArticle }] = useAddArticleMutation();
  const [updateArticle, { isLoading: isUpdatingArticle }] = useUpdateArticleMutation();
  const [updateArticleStatus] = useUpdateArticleStatusMutation();
  const [deleteArticle, { isLoading: isDeletingArticle }] = useDeleteArticleMutation();

  // About Us API hooks
  const { data: aboutUsResponse, refetch: refetchAboutUs } = useGetAboutUsQuery("");
  const [addAboutUs, { isLoading: isAddingAboutUs }] = useAddAboutUsMutation();
  const [updateAboutUs, { isLoading: isUpdatingAboutUs }] = useUpdateAboutUsMutation();
  const [updateAboutUsStatus] = useUpdateAboutUsStatusMutation();
  const [deleteAboutUs, { isLoading: isDeletingAboutUs }] = useDeleteAboutUsMutation();

  const { data: contentLogs, isLoading } = useGetAllContentLogsQuery("");

  return {
    // Content
    addContent,
    contentResponse,
    refetchContent,
    updateContent,
    deleteContent,
    isAddingContent,
    isUpdatingContent,
    isDeletingContent,

    // FAQ
    faqResponse,
    refetchFAQ,
    addFAQ,
    updateFAQ,
    updateFAQStatus,
    deleteFAQ,
    isAddingFAQ,
    isUpdatingFAQ,
    isDeletingFAQ,

    // Articles
    articleResponse,
    refetchArticles,
    addArticle,
    updateArticle,
    updateArticleStatus,
    deleteArticle,
    isAddingArticle,
    isUpdatingArticle,
    isDeletingArticle,

    // About Us
    aboutUsResponse,
    refetchAboutUs,
    addAboutUs,
    updateAboutUs,
    updateAboutUsStatus,
    deleteAboutUs,
    isAddingAboutUs,
    isUpdatingAboutUs,
    isDeletingAboutUs,

    contentLogs,
    isLoading,
  };
};