/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { OrderDetail } from '@/types/fleet';
import { useGetSingleOrderQuery } from '@/redux/features/orders/ordersApi';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderDetail | null;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  onClose,
  order
}) => {
  const { data: orderData, refetch } = useGetSingleOrderQuery(order?.id || '', {
    skip: !order?.id
  });

  useEffect(() => {
    if (order?.id) {
      refetch();
    }
  }, [order?.id, refetch]);

  const actualOrder = orderData?.data || order;

  if (!isOpen || !actualOrder) return null;

  // Get vehicle type name
  const getVehicleTypeName = () => {
    if (actualOrder.vehicle_type_id) {
      // You would need to map vehicle_type_id to actual name
      // For now, return a placeholder
      return 'Bike';
    }
    return 'Unknown';
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get pickup and delivery locations
  const getLocations = () => {
    const stops = actualOrder.orderStops || [];
    const pickup = stops.find((stop: any) => stop.type === 'PICKUP');
    const delivery = stops.find((stop: any) => stop.type === 'DROP');
    
    return {
      pickup: pickup?.address || 'N/A',
      delivery: delivery?.address || 'N/A'
    };
  };

  const locations = getLocations();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex">
        {/* Left Side - Map Legend & Details */}
        <div className="w-1/3 border-r border-gray-200 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Real-Time Fleet Map</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Map Legend:</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-green-500"></span>
                <span className="text-sm text-gray-700">All vehicles (Q1)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-purple-500"></span>
                <span className="text-sm text-gray-700">Bikes (Q2)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-yellow-700"></span>
                <span className="text-sm text-gray-700">Cars (Q3)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-red-500"></span>
                <span className="text-sm text-gray-700">Van (Q4)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-500"></span>
                <span className="text-sm text-gray-700">Truck (Q5)</span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Driver's Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Driver's Detail</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Name:</span>
                  <p className="font-medium">{actualOrder.assign_rider?.user?.username || 'Harry Dine'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Phone:</span>
                  <p className="font-medium">{actualOrder.assign_rider?.user?.phone || '+0123456789'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Vehicle Type:</span>
                  <p className="font-medium">{getVehicleTypeName()}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Zone:</span>
                  <p className="font-medium">Pampoli</p>
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Order Id:</span>
                  <p className="font-medium">{actualOrder.id}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Created:</span>
                  <p className="font-medium">{formatDate(actualOrder.created_at)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Requested Time:</span>
                  <p className="font-medium">2:20 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Order Details */}
        <div className="w-2/3 p-6 overflow-y-auto">
          {/* Customer Details */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <span className="text-sm text-gray-600">Name:</span>
                <p className="font-medium">{actualOrder.user?.username || 'Ismailer Markosis'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Phone:</span>
                <p className="font-medium">{actualOrder.user?.phone || '+65 45612345'}</p>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-gray-600">Pickup Location:</span>
                <p className="font-medium">{locations.pickup}</p>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-gray-600">Delivery Location:</span>
                <p className="font-medium">{locations.delivery}</p>
              </div>
            </div>
          </div>

          {/* Package Details */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Package Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <span className="text-sm text-gray-600">Type:</span>
                <p className="font-medium">Customs</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Weight:</span>
                <p className="font-medium">12 Kg</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Dimension:</span>
                <p className="font-medium">40.30x15 cm</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Order Type:</span>
                <p className="font-medium">Duron</p>
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Special Instructions</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                Handle with care - fragile electronics. Ring doorbell on arrival. Leave with concierge if customer unavailable.
              </p>
            </div>
          </div>

          {/* Financial Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Details</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className="font-medium text-yellow-600">Pending</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">Visa ***4242</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee:</span>
                  <span className="font-medium">$524.50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Additional Services:</span>
                  <span className="font-medium">$920.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fee:</span>
                  <span className="font-medium">$60.50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">$645.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reimbursed 10 coins:</span>
                  <span className="font-medium text-green-600">-$90.07</span>
                </div>
                <div className="flex justify-between border-t border-gray-300 pt-3 mt-3">
                  <span className="text-gray-800 font-bold">Total Amount:</span>
                  <span className="text-gray-800 font-bold">$544.43</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
              Contact Driver
            </button>
            <button className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition">
              Update Status
            </button>
            <button className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition">
              View Full Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;