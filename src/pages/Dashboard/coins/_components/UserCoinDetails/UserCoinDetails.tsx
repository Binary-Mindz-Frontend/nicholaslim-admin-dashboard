
import { BackButton } from '@/pages/Dashboard/vehicleType-PricingModel/vehicle-types/addVehicleTypes/_components/BackButton'
import UserCoinDetailsTable from './_components/UserCoinDetailsTable'

const UserCoinDetails = () => {
    const handleBack = () => {
    window.history.back()
  }

  return (
    <div className='mx-6 sm:mx-12'>
              <BackButton onClick={handleBack} label={"Back to Coin System"}/>
        <UserCoinDetailsTable />
    </div>
  )
}

export default UserCoinDetails