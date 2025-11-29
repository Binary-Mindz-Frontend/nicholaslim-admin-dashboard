import { BackButton } from '@/pages/Dashboard/vehicleType-PricingModel/vehicle-types/addVehicleTypes/_components/BackButton'
import UserCoinDetailsTable from './_components/UserCoinDetailsTable'
import { Button } from '@/components/ui/button'

const UserCoinDetails = () => {
    const handleBack = () => {
    window.history.back()
  }

  return (
    <div className='mx-6 mb-12 sm:mx-12'>
              <BackButton onClick={handleBack} label={"Back to Coin System"}/>

              <div className="flex justify-between items-center my-6">
          <h3 className="text-3xl font-bold text-gray-900">User Coin Audit & Tracking Adjustment</h3>

          <div className="flex justify-end">
            <Button
              // onClick={() => setOpenCreate(true)}
              className=" bg-[#FFCC00] hover:scale-101 cursor-pointer text-black text-lg px-6 py-3 font-semibold gap-2"
            >
             Manual Adjustment
            </Button>
          </div>
        </div>

          <h3 className="text-3xl font-bold text-gray-900 mt-14 mb-6">Coin Accumulation History</h3>
        <UserCoinDetailsTable />
    </div>
  )
}

export default UserCoinDetails