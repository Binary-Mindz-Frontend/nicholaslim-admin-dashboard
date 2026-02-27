// import { filterFields } from "../../_components/_data/filterData";
// import CustomFilterBar from "../../_components/FilterFieldCustom";
import DriverWalletTable from "./DriverWalletTable";

const DriverWallet = () => {
  return (
    <div className="mx-6 sm:mx-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 my-6">
          Driver Wallet Management
        </h1>
      </div>
      <section className="mb-8 ">
        {/* <CustomFilterBar
          fields={filterFields}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilter}
          showResetButton={true}
        /> */}
      </section>
      <DriverWalletTable />
    </div>
  );
};

export default DriverWallet;
