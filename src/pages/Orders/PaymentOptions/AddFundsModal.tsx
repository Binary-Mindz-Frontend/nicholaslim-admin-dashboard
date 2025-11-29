import { CreditCard, User } from "lucide-react";

export default function AddFundsModal() {
  return (
    <div className="m-6">
      <h2 className="text-2xl font-bold text-gray-900 py-8">Add Funds</h2>
      <div className="bg-white rounded-2xl  overflow-hidden">
        <div className="overflow-x-auto flex flex-col items-center justify-center">
          {/* Header */}
          <div className="">
            <p className="text-2xl my-6 font-medium text-gray-600">
              How much do you want to add?
            </p>
          </div>
          <div className="grid grid-cols-2  md:grid-cols-4 gap-10">
            {["$10", "$20", "$40", "$100"].map((amount) => (
              <button
                key={amount}
                className={`px-14 py-1 rounded-md font-medium text-lg transition-all border-2 ${
                  amount === "$20"
                    ? "bg-yellow-400 border-yellow-400 text-yellow-900 shadow-sm"
                    : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                {amount}
              </button>
            ))}
          </div>
        </div>
        <div className="p-8 space-y-8">
          {/* Amount Buttons */}

          {/* Custom Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter a custom amount
            </label>
            <input
              className="w-full px-5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              placeholder="$0.00"
            />
          </div>

          {/* Choose Payment Method */}
          <div>
            <h3 className="text-xl text-center font-bold text-gray-800 mb-4">
              Choose Payment Method
            </h3>

           {/* Saved Card - Perfect Radio Button */}
<label className="flex items-center justify-between p-4 border-y border-gray-200 cursor-pointer hover:bg-gray-50 transition">
  {/* Hidden radio input */}
  <input
    type="radio"
    name="paymentMethod"
    defaultChecked
    className="peer sr-only"
  />

  {/* Card Info */}
  <div className="flex items-center gap-4">
    <img
      src="https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg"
      alt="Visa"
      className="w-12 h-8 object-contain"
    />
    <div>
      <p className="font-medium text-gray-900">Mastercard ****456</p>
      <p className="text-sm text-gray-500">Expires 12/26</p>
    </div>
  </div>

  {/* Custom Radio Circle - EXACTLY like your design */}
  <div className="relative w-8 h-8">
    {/* Outer circle: white when unchecked, yellow when checked */}
    <div className="absolute inset-0 rounded-full border-6 border-yellow-500 bg-white peer-checked:bg-yellow-400 transition-colors duration-200" />
    
    {/* Inner white dot - appears only when selected */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-4 h-4 rounded-full bg-white scale-0 peer-checked:scale-100 transition-transform duration-200" />
    </div>
  </div>
</label>
          </div>

          {/* Add New Card */}
          <div className=" border-gray-200 rounded-xl p-6 text-center">
            <h4 className="font-bold text-gray-800 mb-4 text-xl">
              Add payment method
            </h4>

            <div className="space-y-6">
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Card number"
                  className="w-full pl-12 pr-5 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="px-5 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  className="px-5 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Name on card"
                  className="w-full pl-12 pr-5 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <button className=" px-14 font-bold py-2 rounded-md bg-yellow-400 hover:bg-yellow-500 text-yellow-900  transition">
                Save Card
              </button>
            </div>
          </div>

          {/* Final Add Fund Button */}
          <button className="w-full py-2 rounded-md bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold text-xl  transition shadow-lg">
            Add Fund
          </button>
        </div>
      </div>
    </div>
  );
}
