// import CustomFilterBar from "@/pages/Dashboard/_components/FilterFieldCustom";
// import DriverWalletDetailsTable from "../DriverWalletDetailsTable"
// import { filterFields } from "@/pages/Dashboard/_components/_data/filterData";

import DriverWalletHistoryTable from "./DriverWalletHistoryTable";

const DriverWalletDetails = () => {
  // const handleFilterChange = (filters: Record<string, string>) => {
  //   console.log("Applied filters:", filters);
  // };
  // const handleResetFilter = () => {
  //   console.log("Filters reset");
  // };

  return (
    <div className="mx-6 sm:mx-12">

     

      {/* <section className="mb-8 ">
        <CustomFilterBar
          fields={filterFields}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilter}
          showResetButton={true}
        />
      </section> */}

      <DriverWalletHistoryTable />
    </div>
  );
};

export default DriverWalletDetails;
