import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PromoCodeIcons } from "@/components/Icons/Icons";
import { Switch } from "@/components/ui/switch";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const OrderSummery = () => {
  return (
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

            {/* <Link to="/order-confirm">
              <Button className="w-full cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3">
                Confirm order
              </Button>
            </Link> */}
            </div>
  )
}

export default OrderSummery