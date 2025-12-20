
import { filterFields } from '../../_components/_data/filterData'
import CustomFilterBar from '../../_components/FilterFieldCustom'
import UserWalletTable from './UserWalletTable'

const UserWallet = () => {


     const handleFilterChange = (filters: Record<string, string>) => {
    console.log("Applied filters:", filters)
  }

  const handleResetFilter = () => {
    console.log("Filters reset")
  }

  return (
    <div className='mx-6 sm:mx-12'>
        <div>
             <h1 className="text-3xl font-bold text-gray-900 my-6">User Wallet</h1>
        </div>
            <section className="mb-8 ">
                <CustomFilterBar
                fields={filterFields}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilter}
                showResetButton={true}
                />
            </section>
    <UserWalletTable />
    </div>
  )
}

export default UserWallet