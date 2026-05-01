import DriverWalletAdminTable from "./DriverWalletAdminTable";


const DriverWalletAdmin = () => {
  return (
    <div className="mx-6 sm:mx-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 my-6">
          Driver Wallet Management for Admin
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
      <DriverWalletAdminTable />
    </div>
  );
}

export default DriverWalletAdmin;