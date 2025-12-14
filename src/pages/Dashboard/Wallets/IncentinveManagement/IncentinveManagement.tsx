import type React from "react"
import IncentivesManagement from "./_components/IncentivesManagement"
import IncentivesList from "./_components/IncentivesList"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import CreateIncentiveDialog from "./CreateIncentive/CreateIncentiveDialog"

const IncentiveManagementPage: React.FC = () => {
  const [openCreate, setOpenCreate] = useState(false)  

  const handleCreateNew = () => {
    setOpenCreate(true) 
  }


  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Incentive Management</h1>
        
        <IncentivesManagement onCreateNew={handleCreateNew} />

        <div className="flex justify-between items-center mt-12">
          <h3 className="text-lg font-bold text-gray-900">Incentives List</h3>

          <div className="flex justify-end">
            <Button 
              onClick={() => setOpenCreate(true)}
              className="bg-[#0088FF] hover:bg-[#FFCC00] cursor-pointer hover:text-black text-white font-semibold gap-2"
            >
              <Plus className="w-5 h-5" />
              Create New Incentive
            </Button>
          </div>
        </div>

        <IncentivesList/>

        <CreateIncentiveDialog open={openCreate} onOpenChange={setOpenCreate} />
      </div>
    </main>
  )
}

export default IncentiveManagementPage
