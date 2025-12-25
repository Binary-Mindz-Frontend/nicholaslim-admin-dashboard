
import { useState } from "react";


interface TrackOrderSectionProps {
  onTrack: (id: string) => void;
}

export default function LiveTrackOrderSection({onTrack} : TrackOrderSectionProps) {
  const [orderId, setOrderId] = useState("");


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onTrack(orderId);
    }
  };

  const handleButtonClick = () => {
    onTrack(orderId);
  }


  return (
    <div className="w-full bg-[#F5F7FA]  space-y-6">

      {/* Input Section */}
      <div className="flex flex-row items-center gap-3">
        <div className="flex-1">
          <label className="text-sm text-gray-600">Track By Order ID</label>
          <input
            type="text"
            placeholder="Enter Order Id"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full mt-1 bg-[#FFF7D6] border border-yellow-300 rounded-full 
                       px-4 py-1 sm:py-3 placeholder-gray-500 outline-none"
          />
        </div>

        <button
          onClick={handleButtonClick}
          className="bg-yellow-400 hover:bg-yellow-500 transition text-black px-2 sm:px-6 py-1 sm:py-3 
                     mt-6 rounded-full font-medium whitespace-nowrap"
        >
          Track Order
        </button>
      </div>
    </div>
  );
}
