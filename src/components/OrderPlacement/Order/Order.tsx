import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import BulkOrdersTable from "../BulkOrder/BulkOrderTable/BulkOrderTable";
import OrderSummery from "../IndivisualOrder/OrderSummery/OrderSummery";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropIcons } from "@/components/Icons/Icons";
import { Download } from "lucide-react";

export default function OrderPlacementPage() {
  const radioClassName = `
        border-2 border-gray-500
        data-[state=checked]:border-green-600
        data-[state=checked]:bg-green-600
        data-[state=checked]:text-white
      `;
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
                className="px-6 py-3 text-center cursor-pointer  shadow  rounded-full font-medium transition-colors
              data-[state=active]:bg-[#FFFAE6] data-[state=active]:border-[#FC0] data-[state=active]:text-gray-900
              data-[state=inactive]:bg-white data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-900"
              >
                Individual Order
              </TabsTrigger>

              <TabsTrigger
                value="bulk"
                className="px-6 py-3 text-center cursor-pointer shadow rounded-full font-medium transition-colors  data-[state=active]:bg-[#FFFAE6] data-[state=active]:border-[#FC0] data-[state=active]:text-gray-900
              data-[state=inactive]:bg-white data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-900             "
              > 
                Bulk Order
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Individual Order Tab */}
          <TabsContent value="individual" className="space-y-8">
            {/* Delivery Details Section */}
            <div className=" pt-8 ">
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Type
                  </label>

                  <Select>
                    <SelectTrigger className="w-full px-4 py-5 bg-[#FFFAE6] border border-gray-300 rounded text-gray-900 appearance-none cursor-pointer">
                      <SelectValue placeholder="Select Delivery Type" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="express">Express</SelectItem>
                      <SelectItem value="standard">Stacked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Route Type
                  </label>

                  <Select>
                    <SelectTrigger className="w-full px-4 py-5 bg-[#FFFAE6] border border-gray-300 rounded text-gray-900 appearance-none cursor-pointer">
                      <SelectValue placeholder="Select Route Type" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="oneway">One Way</SelectItem>
                      <SelectItem value="roundtrip">Round Trip</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Vehicle
                  </label>

                  <Select>
                    <SelectTrigger className="w-full px-4 py-5 bg-[#FFFAE6] border border-gray-300 rounded text-gray-900 appearance-none cursor-pointer">
                      <SelectValue placeholder="Select Vehicle" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="bike">Bike</SelectItem>
                      <SelectItem value="van">MPV</SelectItem>
                      <SelectItem value="van">1.7m Van</SelectItem>
                      <SelectItem value="car">Truck</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Sender Information Section */}
            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <Label className="mb-2">Sender Name</Label>
                  <Input defaultValue="Athena Lin" />
                </div>

                <div>
                  <Label className="mb-2">Sender Number</Label>
                  <Input defaultValue="6596556622" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <Label className="mb-2">Sender Address</Label>
                  <Input defaultValue="657 Ang Mo Kio Ave 9, S560657" />
                </div>

                <div>
                  <Label className="mb-2">Floor or Unit no.</Label>
                  <Input defaultValue="#07-108" />
                </div>
              </div>

              <div>
                <Label className="mb-2">Note to driver</Label>
                <Textarea placeholder="Enter text..." className="h-32" />
              </div>
            </div>

            {/* Recipient Information Section */}
            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <Label className="mb-2">Recipient 1</Label>
                  <Input defaultValue="Athena Lin" />
                </div>

                <div>
                  <Label className="mb-2">Recipient 1 Number</Label>
                  <Input defaultValue="6596556622" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="mb-2">Recipient 1 Address</Label>
                  <Input defaultValue="657 Ang Mo Kio Ave 9, S560657" />
                </div>

                <div>
                  <Label className="mb-2">Floor or Unit no.</Label>
                  <Input defaultValue="#07-108" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 border border-gray-200">
              {/* Route Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Route
                </h3>
                <RadioGroup
                  defaultValue="notfixed"
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2 border border-gray-300 rounded p-4">
                    <RadioGroupItem value="notfixed" id="notfixed" />
                    <Label htmlFor="notfixed">Not Fixed</Label>
                  </div>
                  <div className="flex items-center space-x-2 border border-gray-300  rounded p-4">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed">Fixed</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Collect Time Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Collect Time
                </h3>
                <RadioGroup
                  defaultValue="now"
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2 border border-gray-300 rounded p-4">
                    <RadioGroupItem value="now" id="now" />
                    <Label htmlFor="now">Now</Label>
                  </div>
                  <div className="flex items-center space-x-2 border border-gray-300 rounded p-4">
                    <RadioGroupItem value="schedule" id="schedule" />
                    <Label htmlFor="schedule">Schedule</Label>
                  </div>
                </RadioGroup>
              </div>
              {/* Additional Services Section */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Additional Services
                </h3>
                <RadioGroup defaultValue="others" className="space-y-3">
                  {/* Secure zone */}
                  <div className="flex items-center justify-between px-4 py-3 rounded bg-[#FFD52B] border border-yellow-200">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        className={`${radioClassName}`}
                        id="securezone"
                        value="securezone"
                      />
                      <Label htmlFor="securezone">
                        Secure zone (extra delivery time required)
                      </Label>
                    </div>
                    <span className="text-gray-900 font-medium">+S$15.00</span>
                  </div>

                  {/* Food / beverage */}
                  <div className="flex items-center justify-between px-4 py-3 rounded bg-[#FFD52B] border border-yellow-200">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        className={`${radioClassName}`}
                        id="foodbeverage"
                        value="foodbeverage"
                      />
                      <Label htmlFor="foodbeverage">
                        Buy for me (Food / beverage only)
                      </Label>
                    </div>
                    <span className="text-gray-900 font-medium">+S$15.00</span>
                  </div>

                  {/* Others */}
                  <div className="flex items-center justify-between px-4 py-3 rounded bg-yellow-100 border border-yellow-400">
                    <div className="flex items-center space-x-2 ">
                      <RadioGroupItem
                        className={`${radioClassName}`}
                        id="others"
                        value="others"
                      />
                      <Label htmlFor="others">
                        Buy for me (Others except food / beverage)
                      </Label>
                    </div>
                    <span className="text-gray-900 font-medium">+S$15.00</span>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Order Summary Section */}
            <OrderSummery />
            <Link to="/order-confirm">
              <Button className="w-full cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3">
                Confirm order
              </Button>
            </Link>
          </TabsContent>

          {/* Bulk Order Tab */}
          <TabsContent value="bulk" className="space-y-8">
            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <div className="flex justify-between py-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Bulk Order Upload
                </h2>
                <Button className=" px-6 text-xl text-black cursor-pointer font-medium rounded-lg ransition-colors flex items-center justify-center gap-2">
                  <Download />
                  as CSV
                </Button>
              </div>
              <div className="border-3 border-dashed border-gray-400 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="mb-4 flex justify-center">
                    <DropIcons />
                  </div>
                  <p className="text-[#2F6EED] font-semibold text-lg lg:text-3xl mb-1">
                    Drop your spreadsheet here
                  </p>
                  <p className="text-gray-600 text-sm mb-1">
                    or click to browse your CSV file
                  </p>
                  <p className="text-gray-500 text-sm">
                    (Max. File size: 10 MB)
                  </p>
                </label>
              </div>
            </div>

            {/* Bulk Order Summary */}
            {/* <div className="bg-white rounded-lg p-8 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Bulk Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-700">
                  <span>Total Orders</span>
                  <span>0</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Estimated Cost</span>
                  <span>S$0.00</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>S$0.00</span>
                </div>
              </div>
            </div> */}
            <BulkOrdersTable />

            <OrderSummery />
            <Link to="/order-confirm">
              <Button className="w-full cursor-pointer bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-3">
                Confirm order
              </Button>
            </Link>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
