
import CustomFilterBar from "@/pages/Dashboard/_components/FilterFieldCustom"
import UserAuditTable from "./UserAuditTable"
import { filterFields } from "@/pages/Dashboard/_components/_data/filterData"



  // Sample delivery data

const UserCoinAudit = () => {


//     const handleDeliverySave = (data: any) => {
//     console.log("Delivery data saved:", data)
//   }

  const handleFilterChange = (filters: Record<string, string>) => {
    console.log("Applied filters:", filters)
  }

  const handleResetFilter = () => {
    console.log("Filters reset")
  }


  return (
    <div className='mx-6 sm:mx-12 mt-12'>
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-16">User Coin Audit & Tracking</h1>

                    <section className="mb-8 ">
                        <CustomFilterBar
                        fields={filterFields}
                        onFilterChange={handleFilterChange}
                        onReset={handleResetFilter}
                        showResetButton={true}
                        />
                    </section>
            {/* filter will be here */}
        </div>
        <UserAuditTable />
    </div>
  )
}

export default UserCoinAudit