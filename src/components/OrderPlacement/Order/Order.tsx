import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IndivisualOrderTab from "../IndivisualOrder/IndivisualOrderTab/IndivisualOrderTab";
import BulkOrderTab from "../BulkOrder/BulkOrderTab/BulkOrderTab";
export default function OrderPlacementPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Order Placement
        </h1>

        {/* Main Tabs - Individual Order and Bulk Order */}
        <Tabs defaultValue="individual" className="">
          <div className="border border-[#2B2B2B]/60 rounded-full w-full max-w-[400px] flex items-center justify-center px-1 py-4.5 overflow-hidden bg-white ">
            <TabsList className="grid grid-cols-2 gap-4 bg-transparent border-0 rounded-full w-full  -mt-4 ">
              <TabsTrigger
                value="individual"
                className="px-6 py-3 text-center cursor-pointer shadow rounded-full font-medium border border-gray-300 data-[state=active]:bg-[#FFFAE6] data-[state=active]:border-[#FC0] data-[state=active]:text-gray-900"
              >
                Individual Order
              </TabsTrigger>

              <TabsTrigger
                value="bulk"
                className="px-6 py-3 text-center cursor-pointer shadow rounded-full font-medium border border-gray-300 data-[state=active]:bg-[#FFFAE6] data-[state=active]:border-[#FC0] data-[state=active]:text-gray-900"
              >
                Bulk Order
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Individual Order Tab */}
          <TabsContent value="individual" className="space-y-8">
            <IndivisualOrderTab />
          </TabsContent>

          {/* Bulk Order Tab */}
          <TabsContent value="bulk" className="space-y-8">
            <BulkOrderTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
