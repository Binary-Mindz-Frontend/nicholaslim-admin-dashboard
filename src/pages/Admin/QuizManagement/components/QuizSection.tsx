// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from "react";
// import QuizList from "./QuizList";
// import QuestionForm from "./CreateEditForm";
// import QuizAttemptsTable from "./QuizTable";
// import {
//   useGetAllQuestionsByQuizIdQuery,
//   useCreateQuestionMutation,
//   useUpdateQuestionMutation,
//   useDeleteQuestionMutation,
// } from "@/redux/features/questions/questionsApi";
// import { Question } from "@/types/questionsTypes";
// import toast from "react-hot-toast";
// import { useParams } from "react-router-dom";

// export default function QuizSection() {
//   const [view, setView] = useState<"list" | "form">("list");
//   const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
//   const { id } = useParams<{ id: string }>();

//   const {
//     data: questionsResponse,
//     isLoading,
//     refetch,
//   } = useGetAllQuestionsByQuizIdQuery(id);

//   const [createQuestion] = useCreateQuestionMutation();
//   const [updateQuestion] = useUpdateQuestionMutation();
//   const [deleteQuestion] = useDeleteQuestionMutation();

//   const questions: Question[] = questionsResponse?.data || [];

//   const handleSave = async (data: any) => {
//     toast.loading("Saving question...");
//     try {
//       // Ensure the quizId from URL is included in the data
//       const questionData = {
//         ...data,
//         quizId: data.quizId || Number(id), // Use data.quizId if exists, otherwise use URL id
//       };

//       if (currentQuestion && currentQuestion.id) {
//         // Update existing question - convert id to string if needed
//         const result = await updateQuestion({
//           id: currentQuestion.id.toString(),
//           ...questionData,
//         }).unwrap();

//         if (!result.success) {
//           toast.dismiss();
//           toast.error(result.message);
//           return;
//         }

//         toast.dismiss();
//         toast.success("Question updated successfully!");
//       } else {
//         // Create new question
//         const result = await createQuestion(questionData).unwrap();

//         if (!result.success) {
//           toast.dismiss();
//           toast.error(result.message);
//           return;
//         }

//         toast.dismiss();
//         toast.success("Question created successfully!");
//       }

//       refetch();
//       setView("list");
//       setCurrentQuestion(null);
//     } catch (error: any) {
//       console.error("Failed to save question:", error);
//       toast.dismiss();
//       toast.error(error?.data?.message || "Failed to save question");
//     }
//   };

//   const handleDelete = async (id: number) => {
//     toast.loading("Deleting question...");
//     try {
//       // Convert id to string for the API call
//       const result = await deleteQuestion(id.toString()).unwrap();

//       if (!result.success) {
//         toast.dismiss();
//         toast.error(result.message);
//         return;
//       }

//       toast.dismiss();
//       toast.success("Question deleted successfully!");
//       refetch();
//     } catch (error: any) {
//       console.error("Failed to delete question:", error);
//       toast.dismiss();
//       toast.error(error?.data?.message || "Failed to delete question");
//     }
//   };

//   if (isLoading) {
//     return <div>Loading questions...</div>;
//   }

//   return view === "list" ? (
//     <div>
//       <QuizList
//         questions={questions}
//         onCreate={() => {
//           setCurrentQuestion(null);
//           setView("form");
//         }}
//         onEdit={(q) => {
//           setCurrentQuestion(q);
//           setView("form");
//         }}
//         onDelete={handleDelete}
//       />
//       <QuizAttemptsTable />
//     </div>
//   ) : (
//     <QuestionForm
//       question={currentQuestion}
//       quizId={Number(id)} // Pass the quizId from URL params
//       onSave={handleSave}
//       onBack={() => {
//         setView("list");
//         setCurrentQuestion(null);
//       }}
//     />
//   );
// }

import { useState } from "react";
import QuizList from "./QuizList";
import QuestionForm from "./CreateEditForm";
import QuizAttemptsTable from "./QuizTable";
import {
  useGetAllQuestionsByQuizIdQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} from "@/redux/features/questions/questionsApi";
import { Question } from "@/types/questionsTypes";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export default function QuizSection() {
  const [view, setView] = useState<"list" | "form">("list");
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const { id: quizIdFromUrl } = useParams<{ id: string }>();

  const {
    data: questionsResponse,
    isLoading,
    refetch,
  } = useGetAllQuestionsByQuizIdQuery(quizIdFromUrl);

  const [createQuestion] = useCreateQuestionMutation();
  const [updateQuestion] = useUpdateQuestionMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();

  const questions: Question[] = questionsResponse?.data || [];

  const handleSave = async (data: any) => {
    toast.loading("Saving question...");
    try {
      const questionData = {
        ...data,
        quizId: Number(quizIdFromUrl),
      };

      if (currentQuestion && currentQuestion.id) {
        const result = await updateQuestion({
          id: currentQuestion.id.toString(),
          ...questionData,
        }).unwrap();

        if (!result.success) {
          toast.dismiss();
          toast.error(result.message);
          return;
        }
        toast.dismiss();
        toast.success("Question updated successfully!");
      } else {
        const result = await createQuestion(questionData).unwrap();

        if (!result.success) {
          toast.dismiss();
          toast.error(result.message);
          return;
        }
        toast.dismiss();
        toast.success("Question created successfully!");
      }

      refetch();
      setView("list");
      setCurrentQuestion(null);
    } catch (error: any) {
      console.error("Failed to save question:", error);
      toast.error(error?.data?.message || "Failed to save question");
    }
  };

  const handleDelete = async (id: number) => {
    toast.loading("Deleting question...");
    try {
      const result = await deleteQuestion(id.toString()).unwrap();

      if (!result.success) {
        toast.dismiss();
        toast.error(result.message);
        return;
      }
      toast.dismiss();
      toast.success("Question deleted successfully!");
      refetch();
    } catch (error: any) {
      console.error("Failed to delete question:", error);
      toast.dismiss();
      toast.error(error?.data?.message || "Failed to delete question");
    }
  };

  if (isLoading) {
    return <div>Loading questions...</div>;
  }

  return view === "list" ? (
    <div className="px-12">
      <QuizList
        questions={questions}
        onCreate={() => {
          setCurrentQuestion(null);
          setView("form");
        }}
        onEdit={(q) => {
          setCurrentQuestion(q);
          setView("form");
        }}
        onDelete={handleDelete}
      />
      <QuizAttemptsTable />
    </div>
  ) : (
    <QuestionForm
      question={currentQuestion}
      quizId={Number(quizIdFromUrl)}
      onSave={handleSave}
      onBack={() => {
        setView("list");
        setCurrentQuestion(null);
      }}
    />
  );
}
