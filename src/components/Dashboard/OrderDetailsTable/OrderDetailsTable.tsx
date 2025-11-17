
const orderData = [
  { orderNumber: 1088, location: 'Punggol', dateTime: '12.09.2025 - 12:53 PM', price: '$26', status: 'Delivered' },
  { orderNumber: 1089, location: 'Punggol', dateTime: '12.09.2025 - 12:53 PM', price: '$26', status: 'Pending' },
  { orderNumber: 1090, location: 'Punggol', dateTime: '12.09.2025 - 12:53 PM', price: '$26', status: 'Cancelled' },
  { orderNumber: 1091, location: 'Punggol', dateTime: '12.09.2025 - 12:53 PM', price: '$26', status: 'Pending' },
  { orderNumber: 1092, location: 'Punggol', dateTime: '12.09.2025 - 12:53 PM', price: '$26', status: 'Delivered' },
  { orderNumber: 1093, location: 'Punggol', dateTime: '12.09.2025 - 12:53 PM', price: '$26', status: 'Delivered' },
];

/**
 * Renders a pill/badge component for the order status.
 * @param {string} status - The status text (Delivered, Pending, Cancelled).
 * @returns {JSX.Element}
 */
const StatusPill = ({ status }:any) => {
  let bgColor, textColor;

  switch (status) {
    case 'Delivered':
      bgColor = 'bg-green text-white border border-green-500/50'; 
      textColor = 'text-green-700';
      break;
    case 'Pending':
      bgColor = 'bg-primary text-white border border-yellow-500/50'; 
      textColor = 'text-white';
      break;
    case 'Cancelled':
      bgColor = 'bg-pink text-white border border-red-500/50';
      textColor = 'text-red-700';
      break;
    default:
      bgColor = 'bg-gray-100 border border-gray-400';
      textColor = 'text-gray-700';
  }

  return (
    <div className={`py-1 px-3 rounded-full text-sm font-semibold text-center min-w-20 ${bgColor} ${textColor}`}>
      {status}
    </div>
  );
};

/**
 * React component for the Order Details table.
 * @returns {JSX.Element}
 */
const OrderDetailsTable = () => {
  const headerClasses = 'py-3 px-4 text-left font-normal text-sm';
  const rowClasses = 'py-4 px-4 text-sm font-medium border-t border-[#FFEBD9]';

  return (
    <div className=" bg-white shadow-sm border border-border rounded-2xl w-full mt-8">
      
      {/* --- Header Section --- */}
      <div className="p-6 flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
        <div className="flex items-center">
          <button className="px-4 py-2 text-sm text-muted-foreground border border-border rounded-md hover:bg-secondary">
              Today
              </button>
         
        </div>
      </div>
      
      {/* --- Table Section --- */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed divide-y divide-gray-200">
          
          {/* Table Header (Mimicking the light yellow/cream background) */}
          <thead>
            <tr className="bg-secondary border-b border-secondary">
              <th className={`${headerClasses} w-1/12`}>Order Number</th>
              <th className={`${headerClasses} w-2/12`}>Location</th>
              <th className={`${headerClasses} w-4/12`}>Date - Time</th>
              <th className={`${headerClasses} w-1/12`}>Price</th>
              <th className={`${headerClasses} w-1/12`}>Details</th>
              <th className={`${headerClasses} w-2/12 text-center`}>Status</th>
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {orderData.map((order) => (
              <tr key={order.orderNumber} className="hover:bg-gray-50">
                
                {/* Order Number */}
                <td className={`${rowClasses} text-gray-800`}>{order.orderNumber}</td>
                
                {/* Location */}
                <td className={`${rowClasses} text-gray-600`}>{order.location}</td>
                
                {/* Date - Time */}
                <td className={`${rowClasses} text-gray-600`}>{order.dateTime}</td>
                
                {/* Price */}
                <td className={`${rowClasses} text-gray-800`}>{order.price}</td>
                
                {/* Details (View link) */}
                <td className={`${rowClasses}`}>
                  <button className="text-blue-500 underline hover:text-blue-700 font-medium text-sm">
                    View
                  </button>
                </td>
                
                {/* Status Pill */}
                <td className={`${rowClasses} text-center`}>
                  <div className="flex justify-center">
                    <StatusPill status={order.status} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDetailsTable;