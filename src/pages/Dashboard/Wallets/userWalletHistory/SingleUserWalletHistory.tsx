// import CustomFilterBar from "@/pages/Dashboard/_components/FilterFieldCustom";
// import DriverWalletDetailsTable from "../DriverWalletDetailsTable"
// import { filterFields } from "@/pages/Dashboard/_components/_data/filterData";
import { ArrowLeft } from "lucide-react";
import SingleWalletTable from "./SingleWalletTable";

const SingleUserWalletHistory = () => {
 

  return (
    <div className="mx-6 sm:mx-12">
      <button
        onClick={() => window.history.back()}
        className="mb-4 px-6 py-2 bg-yellow-500 cursor-pointer text-white font-semibold rounded-lg flex items-center gap-2 hover:bg-yellow-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#00BFFF]"
      >
        <ArrowLeft className="w-5 h-5" /> Go Back
      </button>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 my-6">
          User Wallet History
        </h1>
      </div>

      {/* <section className="mb-8 ">
        <CustomFilterBar
          fields={filterFields}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilter}
          showResetButton={true}
        />
      </section> */}

      <SingleWalletTable />
    </div>
  );
};

export default SingleUserWalletHistory;
