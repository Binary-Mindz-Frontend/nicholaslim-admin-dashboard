
import DriverWalletDetailsTable from "./_components/DriverWalletDetailsTable"

const DriverWalletDetails = () => {
  return (
    <div className='mx-6 sm:mx-12'>
        <div>
                    <h1 className="text-3xl font-bold text-gray-900 my-6">User Wallet History</h1>
        </div>
        <DriverWalletDetailsTable />
    </div>
  )
}

export default DriverWalletDetails