import UserAuditTable from "./UserAuditTable"


const UserCoinAudit = () => {
  return (
    <div className='mx-6 sm:mx-12 mt-12'>
        <div>
            <h1 className="text-3xl font-bold text-gray-900 my-6">User Wallet</h1>


            {/* filter will be here */}
        </div>
        <UserAuditTable />
    </div>
  )
}

export default UserCoinAudit