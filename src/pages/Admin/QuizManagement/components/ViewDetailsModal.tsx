import { Badge } from "@/components/ui/badge";
import { X, User, Calendar, FileText, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useGetQuizResultsByRaiderIdQuery } from "@/redux/features/questions/questionsApi";

interface ViewDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  raiderId: number;
}

const ViewDetailsModal = ({ isOpen, onClose, raiderId }: ViewDetailsModalProps) => {
  const { data: response, isLoading, error } = useGetQuizResultsByRaiderIdQuery(raiderId, {
    skip: !isOpen
  });

  const quizResult = response?.data;

  const getStatus = (score: number): string => {
    if (score >= 70) return "Passed";
    if (score >= 40) return "Completed";
    return "Failed";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">
            Quiz Result Details
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-500 mx-auto" />
            <p className="mt-3 text-gray-600">Loading details...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto" />
            <p className="mt-3 text-red-600">Failed to load details</p>
          </div>
        ) : quizResult ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Raider ID</p>
                    <p className="font-medium text-gray-900">R-{quizResult.raiderId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Score</p>
                    <p className="font-medium text-gray-900">{quizResult.score}%</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Correct Answers</p>
                    <p className="font-medium text-gray-900">{quizResult.correct_answers}/{quizResult.total_questions}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Completed Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(quizResult.completed_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <FileText className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Attempt Count</p>
                    <p className="font-medium text-gray-900">{quizResult.attempt_count}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${quizResult.score >= 70 ? 'bg-green-100' : quizResult.score >= 40 ? 'bg-teal-100' : 'bg-red-100'}`}>
                    {quizResult.score >= 70 ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : quizResult.score >= 40 ? (
                      <FileText className="w-5 h-5 text-teal-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <Badge className={quizResult.score >= 70 ? "bg-green-100 text-green-800 border-green-300" : quizResult.score >= 40 ? "bg-teal-100 text-teal-800 border-teal-300" : "bg-red-100 text-red-800 border-red-300"}>
                      {getStatus(quizResult.score)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {quizResult.raider && (
              <div className="mt-8 pt-6 border-t">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Raider Information</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Raider Status</p>
                    <p className="font-medium text-gray-900">{quizResult.raider.raider_status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Verification</p>
                    <p className="font-medium text-gray-900">{quizResult.raider.raider_verificationFromAdmin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Login Type</p>
                    <p className="font-medium text-gray-900">{quizResult.raider.LoginType}</p>
                  </div>
                </div>
              </div>
            )}

            {quizResult.quiz && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Quiz Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Quiz Title</p>
                    <p className="font-medium text-gray-900">{quizResult.quiz.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium text-gray-900">{quizResult.quiz.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <Badge className={quizResult.quiz.is_active ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300"}>
                      {quizResult.quiz.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  {quizResult.quiz.QuizOption && (
                    <div>
                      <p className="text-sm text-gray-500">Difficulty</p>
                      <p className="font-medium text-gray-900 capitalize">{quizResult.quiz.QuizOption.difficulty}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-600">No details available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDetailsModal;