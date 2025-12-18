// UserCoinDetails.tsx
import { BackButton } from '@/pages/Dashboard/vehicleType-PricingModel/vehicle-types/addVehicleTypes/_components/BackButton'
import UserCoinDetailsTable from './_components/UserCoinDetailsTable'
import { Button } from '@/components/ui/button'
import { useParams } from 'react-router-dom'
import { useGetUserCoinHistoryByIdQuery } from '@/redux/features/coinManagement/coinManagementApi'

const UserCoinDetails = () => {
  const { id } = useParams<{ id: string }>()
  const { data: userHistory } = useGetUserCoinHistoryByIdQuery(id || "")
  
  const handleBack = () => {
    window.history.back()
  }

  const calculateTotalCoins = () => {
    if (!userHistory?.data) return 0
    return userHistory.data.reduce((total: number, transaction: any) => {
      return total + (parseInt(transaction.total_coin_acc) || 0)
    }, 0)
  }

  const getUserName = () => {
    if (userHistory?.data && userHistory.data.length > 0) {
      return userHistory.data[0].username || `User ${id}`
    }
    return `User ${id}`
  }

  return (
    <div className='mx-6 mb-12 sm:mx-12'>
      <BackButton onClick={handleBack} label={"Back to Coin System"}/>
      
      <div className="my-6">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{getUserName()}</h2>
              <div className="mt-2 space-y-1">
                <p className="text-gray-600">
                  <span className="font-medium">User ID:</span> {id}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Total Transactions:</span> {userHistory?.data?.length || 0}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Total Coins Accumulated:</span> {calculateTotalCoins()} Coins
                </p>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Button
                className="bg-[#FFCC00] hover:scale-105 cursor-pointer text-black text-lg px-6 py-3 font-semibold gap-2 transition-transform"
              >
                Manual Adjustment
              </Button>
            </div>
          </div>
        </div>

        <h3 className="text-3xl font-bold text-gray-900 mb-6">Coin Accumulation History</h3>
        
        <UserCoinDetailsTable />
      </div>
    </div>
  )
}

export default UserCoinDetails