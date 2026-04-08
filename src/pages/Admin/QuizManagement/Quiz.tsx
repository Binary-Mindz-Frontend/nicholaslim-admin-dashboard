/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  useCreateQuizMutation,
  useDeleteQuizMutation,
  useGetAllQuizsLogsQuery,
  useGetQuizzesQuery,
  useUpdateQuizMutation,
} from "@/redux/features/quizzes/quizzesApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, BookOpen, AlertTriangle } from "lucide-react";
import AllQuizShowTable from "./components/AllQuizShowTable";
import QuizModal from "./components/QuizModal";
import QuizAttemptsTable from "./components/QuizTable";
import SimpleChangeLogTable from "@/components/Shared/DynamicChangeLogTable/SimpleChangeLogTable";

const Quiz: React.FC = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { data: quizzesResponse, isLoading, refetch } = useGetQuizzesQuery("");

  const { data: quizLogsResponse, isLoading: isLogsLoading } =
    useGetAllQuizsLogsQuery({
      page,
      limit,
      search,
    });

  const [createQuiz] = useCreateQuizMutation();
  const [updateQuiz] = useUpdateQuizMutation();
  const [deleteQuiz] = useDeleteQuizMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<any | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<number | null>(null);

  const quizzes = quizzesResponse?.data || [];

  const quizLogColumns = [
    {
      header: "Date",
      accessor: "createdAt",
      render: (row: any, index: number) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-700">
            {new Date(row.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
          {index === 0 && page === 1 && (
            <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold border border-amber-200">
              LATEST
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Quiz Info",
      accessor: "title",
      render: (row: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{row.title}</span>
          <span className="text-[11px] text-slate-500">{row.category}</span>
        </div>
      ),
    },
    {
      header: "Configuration",
      accessor: "quizOption",
      render: (row: any) => (
        <div className="text-[11px] text-slate-600">
          <div>Time: {row.quizOption?.timeLimit}m</div>
          <div className="capitalize">Diff: {row.quizOption?.difficulty}</div>
        </div>
      ),
    },
    {
      header: "Changed By",
      accessor: "changedByRole",
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold border border-slate-200">
            {row.changedByAdminId}
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase">
            {row.changedByRole}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "isActive",
      render: (row: any) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
            row.isActive
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-600 border-red-200"
          }`}
        >
          {row.isActive ? "ACTIVE" : "INACTIVE"}
        </span>
      ),
    },
  ];

  const confirmDelete = async () => {
    if (!quizToDelete) return;
    toast.loading("Deleting quiz...");
    try {
      const result = await deleteQuiz(quizToDelete).unwrap();
      if (!result.success) {
        toast.dismiss();
        toast.error(result.message);
        return;
      }
      toast.dismiss();
      toast.success("Quiz deleted successfully!");
      setIsDeleteModalOpen(false);
      setQuizToDelete(null);
      refetch();
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to delete quiz");
    }
  };

  const openDeleteModal = (id: number) => {
    setQuizToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleCreateQuiz = async (quizData: any) => {
    toast.loading("Creating quiz...");
    try {
      const result = await createQuiz(quizData).unwrap();
      if (!result.success) {
        toast.dismiss();
        toast.error(result.message);
        return;
      }
      setIsModalOpen(false);
      toast.dismiss();
      toast.success("Quiz created successfully!");
      refetch();
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to create quiz");
    }
  };

  const handleEditQuiz = async (quizData: any) => {
    if (!editingQuiz?.id) return;
    toast.loading("Updating quiz...");
    const { created_at, updated_at, QuizOption, ...updateFields } = quizData;
    const payload = {
      ...updateFields,
      QuizOption: QuizOption ? { ...QuizOption } : undefined,
    };
    try {
      const result = await updateQuiz({
        id: editingQuiz.id,
        ...payload,
      }).unwrap();
      if (!result.success) {
        toast.dismiss();
        toast.error(result.message);
        return;
      }
      setIsModalOpen(false);
      setEditingQuiz(null);
      toast.dismiss();
      toast.success("Quiz updated successfully!");
      refetch();
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to update quiz");
    }
  };

  const handleToggleActive = async (quiz: any) => {
    toast.loading("Toggling active status...");
    try {
      const result = await updateQuiz({
        id: quiz.id!,
        is_active: !quiz.is_active,
      }).unwrap();
      if (!result.success) {
        toast.dismiss();
        toast.error(result.message);
        return;
      }
      toast.dismiss();
      toast.success("Active status toggled successfully!");
      refetch();
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to toggle active status");
    }
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setEditingQuiz(null);
    setIsModalOpen(true);
  };
  const openEditModal = (quiz: any) => {
    setIsEditMode(true);
    setEditingQuiz(quiz);
    setIsModalOpen(true);
  };
  const handleAddQuestions = (quizId: number) =>
    navigate(`/quiz-create-edit/${quizId}`);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header & Create Button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <BookOpen className="w-8 h-8 mr-3 text-yellow-500" />
          Quiz Management
        </h1>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-md flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Quiz
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mb-8">
        <AllQuizShowTable
          quizzes={quizzes}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onToggleActive={handleToggleActive}
          onAddQuestions={handleAddQuestions}
        />
      </div>

      {/* Results Table Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mb-8">
        <h2 className="md:text-xl font-bold text-gray-800 px-6 py-4 border-b border-gray-200">
          Quiz Results & Attempts
        </h2>
        <QuizAttemptsTable />
      </div>

      <SimpleChangeLogTable
        logs={quizLogsResponse?.data?.data || []}
        columns={quizLogColumns}
        meta={quizLogsResponse?.data?.meta}
        isLoading={isLogsLoading}
        page={page}
        limit={limit}
        search={search}
        onPageChange={setPage}
        onLimitChange={setLimit}
        onSearchChange={setSearch}
      />

      {/* Modals */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Are you sure?
              </h3>
              <p className="text-gray-500 mb-8">
                This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <QuizModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingQuiz(null);
        }}
        onSubmit={isEditMode ? handleEditQuiz : handleCreateQuiz}
        initialData={editingQuiz}
        isEditMode={isEditMode}
      />
    </div>
  );
};

export default Quiz;
