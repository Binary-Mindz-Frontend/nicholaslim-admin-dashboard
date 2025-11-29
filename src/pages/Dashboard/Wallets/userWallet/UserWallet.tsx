
import UserWalletTable from './_components/UserWalletTable'

const UserWallet = () => {
  return (
    <div className='mx-6 sm:mx-12'>
        <div>
                    <h1 className="text-3xl font-bold text-gray-900 my-6">User Wallet</h1>
        </div>
        <UserWalletTable />
    </div>
  )
}

export default UserWallet