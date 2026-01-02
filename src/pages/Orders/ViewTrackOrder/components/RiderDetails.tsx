/* eslint-disable @typescript-eslint/no-explicit-any */
import { Star } from "lucide-react"
import placeholderImg from '@/assets/placeholder.png'

interface RiderDetailsProps {
  userData?: any;
  vehicleData?: any;
}

export default function RiderDetails({ userData, vehicleData }: RiderDetailsProps) {
  // Map data from the API response
  const riderName = userData?.username || "Not Assigned";
  const riderImage = userData?.image || placeholderImg;
  const vehicleType = vehicleData?.vehicle_type || "N/A";
  const vehicleName = vehicleData?.dimension ? `SUV (${vehicleData.dimension})` : "Standard";
  const riderPhone = userData?.phone || "";

  return (
    <div className="flex items-center justify-center bg-gray-100 mb-8">
      <div className="w-full bg-white rounded-2xl border border-gray-300 p-8 shadow-sm">
        {/* Header */}
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-8">Rider's Detail</h2>

        {/* Profile Section */}
        <div className="flex flex-col items-center mb-6">
          {/* Profile Image */}
          <div className="mb-4">
            <img
              src={riderImage}
              alt={riderName}
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
            />
          </div>

          {/* Name */}
          <h3 className="text-xl font-semibold text-gray-800 mb-3">{riderName}</h3>

          {/* Badges */}
          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md font-medium">
              {vehicleType}
            </span>
            <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md font-medium">
              {vehicleName}
            </span>
          </div>

          {/* Stats - Note: Using fallback numbers as these aren't in the provided API snippet yet */}
          <div className="flex items-center justify-center gap-6 text-sm text-gray-700">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">4.8/5</span>
              <span className="text-gray-500">(Verified Rider)</span>
            </div>
            <span>ID: #{userData?.id || "N/A"}</span>
          </div>
          <span className="text-sm text-gray-700 my-3">Phone: {riderPhone}</span>
        </div>

        {/* Action Buttons */}
        {/* <div className="flex justify-between gap-4">
          <button className="flex-1 max-w-sm flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-400 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            <MessageSquareMore className="w-5 h-5" />
            <span>Message</span>
          </button>
          
          <a 
            href={`tel:${riderPhone}`}
            className="flex-1 max-w-sm flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-400 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            <Phone className="w-5 h-5" />
            <span>Call</span>
          </a>
        </div> */}
      </div>
    </div>
  )
}