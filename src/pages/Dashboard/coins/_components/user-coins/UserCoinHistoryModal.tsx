import React from "react";
import { X, Calendar, Coins, User, History } from "lucide-react";

interface CoinHistoryItem {
  id: number;
  userId: number;
  role_triggered: string;
  coin_acc_amount: number;
  edited_by: string;
  type: string;
  created_at: string;
  updated_at: string;
}

interface UserCoinHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number | null;
  userCoinHistory: CoinHistoryItem[];
  isLoading: boolean;
}

const UserCoinHistoryModal: React.FC<UserCoinHistoryModalProps> = ({
  isOpen,
  onClose,
  userId,
  userCoinHistory,
  isLoading,
}) => {
  if (!isOpen) return null;

  // Calculate totals
  const totalAccumulated = userCoinHistory
    .filter(item => item.type === "ACCUMULATION")
    .reduce((sum, item) => sum + item.coin_acc_amount, 0);

  const totalDeducted = userCoinHistory
    .filter(item => item.type === "DEDUCTION")
    .reduce((sum, item) => sum + item.coin_acc_amount, 0);

  const currentBalance = totalAccumulated - totalDeducted;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <History className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Coin Transaction History
                </h2>
                <p className="text-sm text-gray-500">
                  User ID: {userId || "N/A"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="w-4 h-4 text-green-600" />
                  <h3 className="text-sm font-medium text-green-800">
                    Total Accumulated
                  </h3>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {totalAccumulated} coins
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="w-4 h-4 text-red-600" />
                  <h3 className="text-sm font-medium text-red-800">
                    Total Deducted
                  </h3>
                </div>
                <p className="text-2xl font-bold text-red-600">
                  {totalDeducted} coins
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-medium text-blue-800">
                    Current Balance
                  </h3>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {currentBalance} coins
                </p>
              </div>
            </div>

            {/* History Table */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
              </div>
            ) : userCoinHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No Transaction History
                </h3>
                <p className="text-gray-500">
                  No coin transactions found for this user
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Triggered By
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userCoinHistory.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg ${
                              transaction.type === "ACCUMULATION" 
                                ? "bg-green-100" 
                                : "bg-red-100"
                            }`}>
                              {transaction.type === "ACCUMULATION" ? (
                                <span className="text-green-600">↑</span>
                              ) : (
                                <span className="text-red-600">↓</span>
                              )}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {transaction.role_triggered.replace(/_/g, ' ')}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {transaction.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.type === "ACCUMULATION"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Coins className="w-4 h-4 text-yellow-600 mr-1" />
                            <span className={`text-sm font-medium ${
                              transaction.type === "ACCUMULATION"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}>
                              {transaction.type === "ACCUMULATION" ? "+" : "-"}
                              {transaction.coin_acc_amount} coins
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">
                              {transaction.edited_by}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm text-gray-900">
                                {new Date(transaction.created_at).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(transaction.created_at).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Summary */}
            {userCoinHistory.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Showing {userCoinHistory.length} transaction{userCoinHistory.length !== 1 ? "s" : ""}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Total Accumulated:</span>
                      <span className="ml-2 text-green-600 font-bold">+{totalAccumulated}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Total Deducted:</span>
                      <span className="ml-2 text-red-600 font-bold">-{totalDeducted}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Net Balance:</span>
                      <span className="ml-2 text-blue-600 font-bold">{currentBalance}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCoinHistoryModal;