import { MessageSquareMore, Phone, Star } from "lucide-react"
import riders from '@/assets/images/riders/riders.svg'

export default function RiderDetails() {
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
              src={riders}
              alt="Harry Dim"
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
            />
          </div>

          {/* Name */}
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Harry Dim</h3>

          {/* Badges */}
          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md font-medium">Motorbike</span>
            <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md font-medium">Honda CBX-250</span>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 text-sm text-gray-700 mb-6">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">4/5</span>
              <span className="text-gray-500">(115 Reviews)</span>
            </div>
            <span>Total 625 Deliveries</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-4">
          <button className="flex-1 max-w-sm flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-400 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            <MessageSquareMore className="w-5 h-5" />
            <span>Message</span>
          </button>
          <button className="flex-1  max-w-sm  flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-400 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            <Phone className="w-5 h-5" />
            <span>Call</span>
          </button>
        </div>
      </div>
    </div>
  )
}
