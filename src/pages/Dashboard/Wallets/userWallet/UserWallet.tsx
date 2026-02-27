// import { filterFields } from "../../_components/_data/filterData";
// import CustomFilterBar from "../../_components/FilterFieldCustom";
import UserWalletTable from "./UserWalletTable";

const UserWallet = () => {
 
  return (
    <div className="mx-6 sm:mx-12">
      <div>
        <h1 className="text-lg md:text-xl lg:text-3xl font-bold text-gray-900 my-6">
          User Wallet Management
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
      <UserWalletTable />
    </div>
  );
};

export default UserWallet;
