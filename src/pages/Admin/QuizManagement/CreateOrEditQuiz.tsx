import QuizAttemptsTable from "./components/QuizTable";
import QuizSection from "./components/MainFileForQuiz";

export default function CreateOrEditQuiz() {
  return (
    <div>
      <QuizSection />
      <QuizAttemptsTable />
    </div>
  );
}
