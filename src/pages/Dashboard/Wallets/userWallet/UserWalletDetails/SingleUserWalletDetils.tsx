import CustomFilterBar from "@/pages/Dashboard/_components/FilterFieldCustom"
import SingleWalletTable from "./_components/SingleWalletTable"
import { filterFields } from "@/pages/Dashboard/_components/_data/filterData"

const SingleUserWalletDetils = () => {


     const handleFilterChange = (filters: Record<string, string>) => {
    console.log("Applied filters:", filters)
  }

  const handleResetFilter = () => {
    console.log("Filters reset")
  }


  return (
    <div className='mx-6 sm:mx-12'>
        <div>
             <h1 className="text-3xl font-bold text-gray-900 my-6">User Wallet History</h1>
        </div>
                <section className="mb-8 ">
                    <CustomFilterBar
                    fields={filterFields}
                    onFilterChange={handleFilterChange}
                    onReset={handleResetFilter}
                    showResetButton={true}
                    />
                </section>
        <SingleWalletTable />
    </div>
  )
}

export default SingleUserWalletDetils