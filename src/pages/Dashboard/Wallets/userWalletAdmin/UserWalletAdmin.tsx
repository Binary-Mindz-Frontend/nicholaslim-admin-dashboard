import UserWalletAdminTable from "./UserWalletAdminTable";


const UserWalletAdmin = () => {
  return (
    <div className="mx-6 sm:mx-12">
      <div>
        <h1 className="text-lg md:text-xl lg:text-3xl font-bold text-gray-900 my-6">
          User Wallet Management for Admin
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
        <UserWalletAdminTable />
    </div>
  );
}

export default UserWalletAdmin