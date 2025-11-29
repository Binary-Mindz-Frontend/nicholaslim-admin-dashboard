import { Button } from "@/components/ui/button";
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
import { PromoCodeIcons } from "@/components/Icons/Icons";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";

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
          <div className="border border-[#2B2B2B]/60 rounded-full w-3/12 flex items-center justify-center">
            <TabsList className="grid grid-cols-2 gap-4 mb-5 border-0 bg-transparent">
              <TabsTrigger
                value="individual"
                className="px-8 py-3 cursor-pointer rounded-full border-2 font-medium transition-colors data-[state=active]:bg-[#FFFAE6] data-[state=active]:border-[#FC0] data-[state=active]:text-gray-900
    data-[state=inactive]:bg-white data-[state=inactive]:border-gray-300 data-[state=inactive]:text-gray-900"
              >
                Individual Order
              </TabsTrigger>

              <TabsTrigger
                value="bulk"
                className="px-8 py-3 cursor-pointer rounded-full border-2 font-medium transition-colors data-[state=active]:bg-[#FFFAE6] data-[state=active]:border-[#FC0] data-[state=active]:text-gray-900
    data-[state=inactive]:bg-white data-[state=inactive]:border-gray-300 data-[state=inactive]:text-gray-900"
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
            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-700">
                  <span>Delivery</span>
                  <span>+S$15.00</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Additional Services</span>
                  <span>+S$15.00</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Fee</span>
                  <span>+S$0.00</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>+S$30.00</span>
                </div>
              </div>

              <div className="mb-6 flex justify-between">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-yellow-500">
                    <PromoCodeIcons />
                  </span>
                  <Label className="text-sm font-medium">Promo Code</Label>
                </div>

                <Input placeholder="Enter Code" className="w-[20%]" />
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-700">Redeem 10 Coins</Label>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-gray-700">Favourite Riders</Label>
                  <Switch />
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>S$30.00</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Coin/s redeemed</span>
                  <span>S$0.00</span>
                </div>
                <div className="flex justify-between text-red-600 font-medium">
                  <span>Saved</span>
                  <span>S$50.00</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>S$-20.00</span>
                </div>
              </div>

              <div className="mb-6 flex items-center justify-between">
                <Label className="mb-0">Payment method</Label>
                <Select defaultValue="stripe">
                  <SelectTrigger className="w-[20%]">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stripe">Stripe account</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            <Link to="/order-confirm">
              <Button className="w-full cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3">
                Confirm order
              </Button>
            </Link>
            </div>
          </TabsContent>

          {/* Bulk Order Tab */}
          <TabsContent value="bulk" className="space-y-8">
            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Bulk Order Upload
              </h2>

              <div className="border-2 border-dashed border-gray-400 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="mb-4 flex justify-center">
                    <svg
                      className="w-16 h-16 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54h2.86v2h-4v-2h2.19L9.5 8.5c-.12-.15-.04-.42.12-.58.16-.16.43-.24.58-.12l3.22 2.87.64-.73c.12-.15.04-.42-.12-.58-.16-.16-.43-.24-.58-.12l-.9 1.03z" />
                    </svg>
                  </div>
                  <p className="text-blue-600 font-medium text-lg mb-1">
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
            <div className="bg-white rounded-lg p-8 border border-gray-200">
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
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
