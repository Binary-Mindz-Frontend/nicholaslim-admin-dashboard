
import type React from "react"

import { useState } from "react"

export default function OrderPlacementPage() {
  const [orderType, setOrderType] = useState<"individual" | "bulk">("individual")
  const [deliveryType, setDeliveryType] = useState("express")
  const [routeType, setRouteType] = useState("oneway")
  const [vehicleType, setVehicleType] = useState("bike")

  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const [senderData, setSenderData] = useState({
    name: "Athena Lin",
    number: "6596556622",
    address: "657 Ang Mo Kio Ave 9, S560657",
    floor: "#07-108",
  })

  const [recipientData, setRecipientData] = useState({
    name: "Athena Lin",
    number: "6596556622",
    address: "657 Ang Mo Kio Ave 9, S560657",
    floor: "#07-108",
  })

  const [notes, setNotes] = useState("")

  const [routeSelection, setRouteSelection] = useState<"notfixed" | "fixed">("notfixed")
  const [collectTime, setCollectTime] = useState<"now" | "schedule">("now")
  const [selectedServices, setSelectedServices] = useState<{
    [key: string]: boolean
  }>({
    securezone: false,
    foodbeverage: false,
    others: true,
  })
  const [promoCode, setPromoCode] = useState("")
  const [redeemCoins, setRedeemCoins] = useState(false)
  const [favoriteRiders, setFavoriteRiders] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("stripe")

  const additionalServices = [
    {
      id: "securezone",
      label: "Secure zone (extra delivery time required)",
      price: 15.0,
    },
    { id: "foodbeverage", label: "Buy for me (Food / beverage only)", price: 15.0 },
    {
      id: "others",
      label: "Buy for me (Others except food / beverage)",
      price: 15.0,
    },
  ]

  const deliveryPrice = 15.0
  const additionalServicesTotal = Object.keys(selectedServices)
    .filter((key) => selectedServices[key])
    .reduce((sum) => sum + 15.0, 0)
  const feePrice = 0.0
  const subtotal = deliveryPrice + additionalServicesTotal + feePrice
  const coinsRedeemed = 0.0
  const saved = 50.0
  const total = subtotal - coinsRedeemed - saved

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.size <= 10 * 1024 * 1024) {
      setUploadedFile(file)
    } else if (file) {
      alert("File size exceeds 10 MB limit")
    }
  }

  const handleDragDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0]
    if (file && file.size <= 10 * 1024 * 1024) {
      setUploadedFile(file)
    } else if (file) {
      alert("File size exceeds 10 MB limit")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Placement</h1>

        {/* Order Type Toggle */}
        <div className="mb-8 flex gap-2">
          <button
            onClick={() => setOrderType("individual")}
            className={`px-8 py-2 rounded-full border-2 font-medium transition-colors ${
              orderType === "individual"
                ? "bg-yellow-100 border-yellow-400 text-gray-900"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            Individual Order
          </button>
          <button
            onClick={() => setOrderType("bulk")}
            className={`px-8 py-2 rounded-full border-2 font-medium transition-colors ${
              orderType === "bulk"
                ? "bg-yellow-100 border-yellow-400 text-gray-900"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            Bulk Order
          </button>
        </div>

        {/* Dropdowns Row */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {/* Delivery Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Type</label>
            <select
              value={deliveryType}
              onChange={(e) => setDeliveryType(e.target.value)}
              className="w-full px-4 py-3 bg-yellow-50 border border-gray-300 rounded text-gray-900 appearance-none cursor-pointer"
            >
              <option value="express">Express</option>
              <option value="standard">Standard</option>
              <option value="economy">Economy</option>
            </select>
          </div>

          {/* Route Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Route Type</label>
            <select
              value={routeType}
              onChange={(e) => setRouteType(e.target.value)}
              className="w-full px-4 py-3 bg-yellow-50 border border-gray-300 rounded text-gray-900 appearance-none cursor-pointer"
            >
              <option value="oneway">One Way</option>
              <option value="roundtrip">Round Trip</option>
            </select>
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Vehicle</label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full px-4 py-3 bg-yellow-50 border border-gray-300 rounded text-gray-900 appearance-none cursor-pointer"
            >
              <option value="bike">Bike</option>
              <option value="car">Car</option>
              <option value="van">Van</option>
            </select>
          </div>
        </div>

        {orderType === "bulk" && (
          <div className="bg-white rounded-lg p-8 mb-8 border border-gray-200">
            {/* File Upload Area */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDragDrop}
              className="border-2 border-dashed border-gray-400 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors mb-8"
            >
              <input
                type="file"
                id="file-upload"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {/* Icon */}
                <div className="mb-4 flex justify-center">
                  <svg className="w-16 h-16 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54h2.86v2h-4v-2h2.19L9.5 8.5c-.12-.15-.04-.42.12-.58.16-.16.43-.24.58-.12l3.22 2.87.64-.73c.12-.15.04-.42-.12-.58-.16-.16-.43-.24-.58-.12l-.9 1.03z" />
                  </svg>
                </div>
                <p className="text-blue-600 font-medium text-lg mb-1">Drop your spreadsheet here</p>
                <p className="text-gray-600 text-sm mb-1">or click to browse your CSV file</p>
                <p className="text-gray-500 text-sm">(Max. File size: 10 MB)</p>
              </label>
            </div>

            {/* Display uploaded file info */}
            {uploadedFile && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">File uploaded:</span> {uploadedFile.name}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Sender Information */}
        <div className="bg-white rounded-lg p-8 mb-8 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Sender Information</h2>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Sender Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sender Name</label>
              <input
                type="text"
                value={senderData.name}
                onChange={(e) => setSenderData({ ...senderData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Sender Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sender Number</label>
              <input
                type="text"
                value={senderData.number}
                onChange={(e) => setSenderData({ ...senderData, number: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Sender Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sender Address</label>
              <input
                type="text"
                value={senderData.address}
                onChange={(e) => setSenderData({ ...senderData, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Floor or Unit No */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Floor or Unit no.</label>
              <input
                type="text"
                value={senderData.floor}
                onChange={(e) => setSenderData({ ...senderData, floor: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Note to Driver - Only show for Individual orders */}
          {orderType === "individual" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Note to driver</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter text..."
                className="w-full px-4 py-3 border border-gray-300 rounded text-gray-900 placeholder-gray-400 resize-none h-32"
              />
            </div>
          )}
        </div>

        {/* Recipient Information - Only show for Individual orders */}
        {orderType === "individual" && (
          <div className="bg-white rounded-lg p-8 border border-gray-200 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Recipient 1</h2>

            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Recipient Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient 1</label>
                <input
                  type="text"
                  value={recipientData.name}
                  onChange={(e) => setRecipientData({ ...recipientData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-500"
                />
              </div>

              {/* Recipient Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient 1 Number</label>
                <input
                  type="text"
                  value={recipientData.number}
                  onChange={(e) =>
                    setRecipientData({
                      ...recipientData,
                      number: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Recipient Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient 1 Address</label>
                <input
                  type="text"
                  value={recipientData.address}
                  onChange={(e) =>
                    setRecipientData({
                      ...recipientData,
                      address: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-500"
                />
              </div>

              {/* Floor or Unit No */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Floor or Unit no.</label>
                <input
                  type="text"
                  value={recipientData.floor}
                  onChange={(e) => setRecipientData({ ...recipientData, floor: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Route Selection */}
        <div className="bg-white rounded-lg p-8 border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Route</h3>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center px-4 py-3 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="route"
                value="notfixed"
                checked={routeSelection === "notfixed"}
                onChange={(e) => setRouteSelection(e.target.value as "notfixed" | "fixed")}
                className="w-4 h-4 accent-green-500"
              />
              <span className="ml-3 text-gray-900">Not Fixed</span>
            </label>
            <label className="flex items-center px-4 py-3 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="route"
                value="fixed"
                checked={routeSelection === "fixed"}
                onChange={(e) => setRouteSelection(e.target.value as "notfixed" | "fixed")}
                className="w-4 h-4 accent-green-500"
              />
              <span className="ml-3 text-gray-900">Fixed</span>
            </label>
          </div>
        </div>

        {/* Collect Time Selection */}
        <div className="bg-white rounded-lg p-8 border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Collect Time</h3>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center px-4 py-3 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="collecttime"
                value="now"
                checked={collectTime === "now"}
                onChange={(e) => setCollectTime(e.target.value as "now" | "schedule")}
                className="w-4 h-4 accent-green-500"
              />
              <span className="ml-3 text-gray-900">Now</span>
            </label>
            <label className="flex items-center px-4 py-3 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="collecttime"
                value="schedule"
                checked={collectTime === "schedule"}
                onChange={(e) => setCollectTime(e.target.value as "now" | "schedule")}
                className="w-4 h-4 accent-green-500"
              />
              <span className="ml-3 text-gray-900">Schedule</span>
              <svg className="w-4 h-4 ml-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </label>
          </div>
        </div>

        {/* Additional Services */}
        <div className="bg-white rounded-lg p-8 border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Services</h3>
          <div className="space-y-3">
            {additionalServices.map((service) => (
              <label
                key={service.id}
                className={`flex items-center justify-between px-4 py-3 rounded cursor-pointer transition-colors ${
                  selectedServices[service.id]
                    ? "bg-yellow-100 border border-yellow-400"
                    : "bg-yellow-50 border border-yellow-200 hover:bg-yellow-100"
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedServices[service.id] || false}
                    onChange={(e) =>
                      setSelectedServices({
                        ...selectedServices,
                        [service.id]: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-green-500"
                  />
                  <span className="ml-3 text-gray-900">{service.label}</span>
                </div>
                <span className="text-gray-900 font-medium">+S${service.price.toFixed(2)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-white rounded-lg p-8 border border-gray-200 mb-8">
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-gray-700">
              <span>Delivery</span>
              <span>+S${deliveryPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Additional Services</span>
              <span>+S${additionalServicesTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Fee</span>
              <span>+S${feePrice.toFixed(2)}</span>
            </div>
            <div className="border-t pt-4 flex justify-between text-lg font-semibold text-gray-900">
              <span>Total</span>
              <span>+S${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Promo Code */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-yellow-500">💳</span>
              <label className="text-sm font-medium text-gray-700">Promo Code</label>
            </div>
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter Code"
              className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Toggles */}
          <div className="space-y-3 mb-6 pb-6 border-b">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Redeem 10 Coins</span>
              <button
                onClick={() => setRedeemCoins(!redeemCoins)}
                className={`relative inline-flex w-10 h-6 rounded-full transition-colors ${
                  redeemCoins ? "bg-gray-400" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    redeemCoins ? "translate-x-4.5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Favourite Riders</span>
              <button
                onClick={() => setFavoriteRiders(!favoriteRiders)}
                className={`relative inline-flex w-10 h-6 rounded-full transition-colors ${
                  favoriteRiders ? "bg-gray-400" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    favoriteRiders ? "translate-x-4.5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Final Totals */}
          <div className="space-y-3 mb-8">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>S${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Coin/s redeemed</span>
              <span>S${coinsRedeemed.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-red-600 font-medium">
              <span>Saved</span>
              <span>S${saved.toFixed(2)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>S${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 bg-white cursor-pointer appearance-none"
            >
              <option value="stripe">Stripe account</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
            </select>
          </div>

          {/* Confirm Order Button */}
          <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded transition-colors">
            Confirm order
          </button>
        </div>
      </div>
    </div>
  )
}
