import { Button } from '@/components/ui/button'
import CoinSystemTable from './CoinSystemTable'

const CoinSystem = () => {
  return (
    <div className='mx-6 sm:mx-12'>
       <div className="flex justify-between items-center my-6">
          <h3 className="text-3xl font-bold text-gray-900">Coin System</h3>

          <div className="flex justify-end">
            <Button
              // onClick={() => setOpenCreate(true)}
              className=" bg-[#FFCC00] cursor-pointer text-black text-lg px-6 py-3 font-semibold gap-2"
            >
              Add Coin
            </Button>
          </div>
        </div>
          <CoinSystemTable />
    </div>
  )
}

export default CoinSystem