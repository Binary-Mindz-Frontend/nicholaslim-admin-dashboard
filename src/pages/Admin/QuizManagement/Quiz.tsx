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
import { Plus, BookOpen } from "lucide-react";
import AllQuizShowTable from "./components/AllQuizShowTable";
import QuizModal from "./components/QuizModal";
import QuizAttemptsTable from "./components/QuizTable";
import { DynamicChangeLogTable } from "@/components/Shared/DynamicChangeLogTable/DynamicChangeLogTable";

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const { data: quizzesResponse, isLoading, refetch } = useGetQuizzesQuery("");
  const { data: quizLogsResponse, isLoading: isLogsLoading } =
    useGetAllQuizsLogsQuery("");
  const [createQuiz] = useCreateQuizMutation();
  const [updateQuiz] = useUpdateQuizMutation();
  const [deleteQuiz] = useDeleteQuizMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<any | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

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
          {index === 0 && (
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
      console.error("Failed to create quiz:", error);
      toast.dismiss();
      toast.error("Failed to create quiz");
    }
  };

  const handleEditQuiz = async (quizData: any) => {
    if (!editingQuiz?.id) return;
    toast.loading("Updating quiz...");
    const { ...updateFields } = quizData;
    const payload = {
      ...updateFields,
      QuizOption: quizData.QuizOption ? { ...quizData.QuizOption } : undefined,
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
      console.error("Failed to update quiz:", error);
      toast.dismiss();
      toast.error("Failed to update quiz");
    }
  };

  const handleDeleteQuiz = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        const result = await deleteQuiz(id).unwrap();
        if (!result.success) {
          toast.error(result.message);
          return;
        }
        toast.success("Quiz deleted successfully!");
        refetch();
      } catch (error) {
        console.error("Failed to delete quiz:", error);
        toast.error("Failed to delete quiz");
      }
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
      console.error("Failed to toggle active status:", error);
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

  const handleAddQuestions = (quizId: number) => {
    navigate(`/quiz-create-edit/${quizId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <BookOpen className="w-8 h-8 mr-3 text-yellow-500" />
          Quiz Management
        </h1>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-md cursor-pointer flex items-center transition-colors duration-200 shadow-sm hover:shadow"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Quiz
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mb-8">
        <AllQuizShowTable
          quizzes={quizzes}
          onEdit={openEditModal}
          onDelete={handleDeleteQuiz}
          onToggleActive={handleToggleActive}
          onAddQuestions={handleAddQuestions}
        />
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mb-8">
        <h2 className="md:text-xl font-bold text-gray-800 px-6 py-4 border-b border-gray-200">
          Quiz Results & Attempts
        </h2>
        <QuizAttemptsTable />
      </div>

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

      <DynamicChangeLogTable
        columns={quizLogColumns}
        data={quizLogsResponse?.data || []}
        isLoading={isLogsLoading}
      />
    </div>
  );
};

export default Quiz;
