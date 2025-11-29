
import { useState } from "react";
import { Package, Clock, Calendar, Truck } from "lucide-react";
import { JSX } from "react/jsx-runtime";

interface StatsCard {
  title: string;
  value: number;
  icon: JSX.Element;
}

export default function TrackOrderSection() {
  const [orderId, setOrderId] = useState("");

  const statsData: StatsCard[] = [
    {
      title: "Total Orders",
      value: 1250,
      icon: <Package className="h-6 w-6 text-gray-700" />,
    },
    {
      title: "Ongoing",
      value: 550,
      icon: <Truck className="h-6 w-6 text-gray-700" />,
    },
    {
      title: "Pending",
      value: 220,
      icon: <Clock className="h-6 w-6 text-gray-700" />,
    },
    {
      title: "Scheduled",
      value: 110,
      icon: <Calendar className="h-6 w-6 text-gray-700" />,
    },
  ];

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
            className="w-full mt-1 bg-[#FFF7D6] border border-yellow-300 rounded-full 
                       px-4 py-1 sm:py-3 placeholder-gray-500 outline-none"
          />
        </div>

        <button
          className="bg-yellow-400 hover:bg-yellow-500 transition text-black px-2 sm:px-6 py-1 sm:py-3 
                     mt-6 rounded-full font-medium whitespace-nowrap"
        >
          Track Order
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsData.map((card, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white p-4 rounded-xl 
                       shadow-sm border"
          >
            <div>
              <p className="text-black text-sm sm:text-base font-semibold">{card.title}</p>
              <h2 className="text-xl font-bold">{card.value}</h2>
            </div>

            <div className="p-3 bg-[#FFF7D6] rounded-lg shadow-sm">
              {card.icon}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
