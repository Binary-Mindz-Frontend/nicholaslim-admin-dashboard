// import CustomFilterBar from "@/pages/Dashboard/_components/FilterFieldCustom";
import { useGetAllUsersCoinsHistoryQuery } from "@/redux/features/coinManagement/coinManagementApi";
import UserAuditTable from "./UserAuditTable";
// import { filterFields } from "@/pages/Dashboard/_components/_data/filterData";

const UserCoinAudit = () => {
  const { data: usersCoinHistory, isLoading: isUserCoinHistoryLoading } = useGetAllUsersCoinsHistoryQuery("");

  // 从API获取数据
  const allUsersCoinHistory = usersCoinHistory?.data || [];

  // 转换API数据格式以匹配表格
  const tableData = allUsersCoinHistory.map((user: any) => ({
    id: user.userId,
    name: user.name || "N/A",
    totalCoinsAccumulated: user.acumulated_coin || 0,
    currentCoinBalance: user.totalCoin || 0,
  }));

  return (
    <div className="mx-6 sm:mx-12 mt-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-16">
          User Coin Audit & Tracking
        </h1>
      </div>
      
      <UserAuditTable 
        data={tableData} 
        isLoading={isUserCoinHistoryLoading} 
      />
    </div>
  );
};

export default UserCoinAudit;