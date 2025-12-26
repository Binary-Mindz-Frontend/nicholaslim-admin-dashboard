/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { DropIcons } from "@/components/Icons/Icons";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
// import { Link } from "react-router-dom";
import {
  useLazyExportOrdersCsvQuery,
  useUploadBulkOrderFileMutation,
  useBulkOrderMutation,
  useGetBulkOrdersTabQuery,
  useBulkOrderStatusPendingMutation,
} from "@/redux/features/orderPlacement/orderPlacementApi";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Swal from "sweetalert2";
import BulkOrdersTable from "../BulkOrderTable/BulkOrderTable";

const BulkOrderTab = () => {
  const [exportCsv, { isLoading: isDownloading }] =
    useLazyExportOrdersCsvQuery();
  const [uploadFile, { isLoading: isUploading }] =
    useUploadBulkOrderFileMutation();
  const [bulkOrder, { isLoading: isCreatingBulkOrder }] =
    useBulkOrderMutation();
  const [updateBulkOrderStatus, { isLoading: isUpdatingStatus }] = 
    useBulkOrderStatusPendingMutation(); // Add this mutation

  const { data: bulkOrdersData, refetch } = useGetBulkOrdersTabQuery(undefined);

  //  const navigate = useNavigate();

  // Extract bulk order IDs from the response
  const bulkOrderIds = bulkOrdersData?.data?.totalOrderIds?.map((order: any) => order.id) || [];

  // console.log(bulkOrderIds, 'bulkOrderIds')

  // I got the the id from here
  console.log(bulkOrdersData?.data, "bulkOrdersId");

  const totalBulkOrdersCost =
    bulkOrdersData?.data.totalCost._sum.total_cost || 0;

  // State for sender information
  const [senderName, setSenderName] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [senderFloorUnit, setSenderFloorUnit] = useState("");

  // State to track uploaded file
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Helper function to check if sender information is complete
  const isSenderInfoComplete = () => {
    return senderName && senderNumber && senderAddress && senderFloorUnit;
  };

  // CSV DOWNLOAD
  const handleDownload = async () => {
    try {
      const params = {};
      const blob = await exportCsv(params).unwrap();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "bulk_orders_template.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      Swal.fire({
        title: "Success!",
        text: "CSV template downloaded successfully!",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#3B82F6",
      });
    } catch (error) {
      console.error("CSV download failed", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to download CSV template.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Process bulk order creation
  const processBulkOrder = async (fileUrl: string) => {
    try {
      // Show loading state
      Swal.fire({
        title: "Creating Bulk Orders...",
        text: "Please wait while we process your orders.",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Create destinations dynamically based on sender info
      const destinations = [
        {
          address: senderAddress,
          floor_unit: senderFloorUnit,
          contact_name: senderName,
          contact_number: senderNumber,
          is_saved: false,
          type: "SENDER",
        },
      ];

      // Prepare the request data for the bulk order
      const requestData = {
        fileUrl: fileUrl,
        destinations: destinations,
      };

      console.log("Sending bulk order request:", requestData);

      // Trigger the bulk order API to create the orders
      const response = await bulkOrder(requestData).unwrap();

      // Close loading dialog
      Swal.close();

      console.log("Bulk order API response:", response);

      // Show success message
      Swal.fire({
        title: "Success!",
        text: response?.data?.message || "Bulk orders created successfully!",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#3B82F6",
      });

      // Clear the uploaded file state
      setUploadedFileUrl(null);
      setUploadedFileName(null);

      return response;
    } catch (error: any) {
      console.error("Failed to create bulk order", error);
      Swal.close();

      Swal.fire({
        title: "Error!",
        text: error?.data?.message || "Failed to create bulk orders.",
        icon: "error",
        confirmButtonText: "OK",
      });

      throw error;
    }
  };

  // CSV UPLOAD
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Check if sender information is complete before uploading the file
    if (!isSenderInfoComplete()) {
      Swal.fire({
        title: "Warning!",
        text: "Please fill in all sender information before uploading the file.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith(".csv")) {
      Swal.fire({
        title: "Error!",
        text: "Please upload a CSV file.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    // Validate file size (10 MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      Swal.fire({
        title: "Error!",
        text: "File size exceeds 10 MB limit.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const formData = new FormData();
    formData.append("images", file);

    try {
      // Show uploading progress
      Swal.fire({
        title: "Uploading...",
        text: "Please wait while we upload your CSV file.",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const uploadResponse = await uploadFile(formData).unwrap();
      Swal.close();

      console.log("CSV upload API response:", uploadResponse);

      const fileUrl = uploadResponse?.data[0] || uploadResponse?.fileUrl;

      if (!fileUrl) {
        throw new Error("No file URL returned from upload");
      }

      // Store the file URL and name
      setUploadedFileUrl(fileUrl);
      setUploadedFileName(file.name);

      console.log("File uploaded successfully:", fileUrl);

      // Automatically trigger bulk order creation
      await processBulkOrder(fileUrl);
    } catch (error: any) {
      Swal.close();
      console.error("CSV upload failed", error);

      Swal.fire({
        title: "Error!",
        text: error?.data?.message || "Failed to upload CSV file.",
        icon: "error",
        confirmButtonText: "OK",
      });

      // Reset states
      setUploadedFileUrl(null);
      setUploadedFileName(null);
    }

    // Reset file input
    e.target.value = "";
  };

  // Manual bulk order creation
  const handleManualBulkOrderCreation = async () => {
    if (!uploadedFileUrl) {
      Swal.fire({
        title: "Warning!",
        text: "No CSV file uploaded.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!isSenderInfoComplete()) {
      Swal.fire({
        title: "Warning!",
        text: "Please fill in all sender information.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      await processBulkOrder(uploadedFileUrl);
    } catch (error) {
      console.error("Manual bulk order creation failed", error);
    }
  };

  const handleConfirmOrder = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link navigation

    try {
      // Show loading state
      Swal.fire({
        title: "Updating Order Status...",
        text: "Please wait while we update your order status to pending.",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Update bulk order status to pending
      const response = await updateBulkOrderStatus(bulkOrderIds).unwrap();

      // Close loading dialog
      Swal.close();

      console.log("Bulk order status update response:", response);

      // Show success message
      Swal.fire({
        title: "Success!",
        text: response?.message || "Order status updated to pending successfully!",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#3B82F6",
      }).then((result) => {
        if (result.isConfirmed) {
          // Navigate to order confirmation page
          // navigate("/order-confirm");
        }
      });

    } catch (error: any) {
      console.error("Failed to update bulk order status", error);
      Swal.close();

      Swal.fire({
        title: "Error!",
        text: error?.data?.message || "Failed to update order status.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };


  
  useEffect(() => {
    refetch();
  }, [refetch]);
  return (
    <>
      <div className="bg-white rounded-lg p-8 border border-gray-200">
        <div className="flex justify-end py-4">
          <Button
            onClick={handleDownload}
            disabled={isDownloading || isUploading || isCreatingBulkOrder}
            className="px-6 text-xl text-black font-medium cursor-pointer rounded-lg flex items-center gap-2"
          >
            <Download />
            {isDownloading ? "Downloading..." : "as CSV"}
          </Button>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            isUploading || isCreatingBulkOrder
              ? "border-gray-300 bg-gray-50"
              : "border-gray-400 hover:bg-gray-50 hover:border-blue-400"
          }`}
        >
          <input
            type="file"
            id="file-upload"
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading || isCreatingBulkOrder}
          />

          <label
            htmlFor="file-upload"
            className={`cursor-pointer ${
              isUploading || isCreatingBulkOrder
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <div className="mb-4 flex justify-center">
              <DropIcons />
            </div>

            <p className="text-[#2F6EED] font-semibold text-lg lg:text-3xl mb-1">
              {isUploading
                ? "Uploading CSV..."
                : isCreatingBulkOrder
                ? "Creating Orders..."
                : "Drop your spreadsheet here"}
            </p>

            <p className="text-gray-600 text-sm mb-1">
              or click to browse your CSV file
            </p>
            <p className="text-gray-500 text-sm">(Max. File size: 10 MB)</p>
          </label>
        </div>

        {/* Show uploaded file info and create order button */}
        {uploadedFileUrl && !isCreatingBulkOrder && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 font-medium">{uploadedFileName}</p>
                <p className="text-blue-600 text-sm">
                  CSV file uploaded successfully
                </p>
              </div>
              <Button
                onClick={handleManualBulkOrderCreation}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!isSenderInfoComplete()}
              >
                Create Bulk Orders
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Sender Information */}
      <div className="bg-white rounded-lg p-8 border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold mb-4">Sender Information</h3>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <Label className="mb-2">Sender Name *</Label>
            <Input
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              disabled={isUploading || isCreatingBulkOrder}
              placeholder="Enter sender name"
            />
          </div>
          <div>
            <Label className="mb-2">Sender Number *</Label>
            <Input
              type="tel"
              value={senderNumber}
              onChange={(e) => setSenderNumber(e.target.value)}
              disabled={isUploading || isCreatingBulkOrder}
              placeholder="Enter phone number"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <Label className="mb-2">Sender Address *</Label>
            <Input
              value={senderAddress}
              onChange={(e) => setSenderAddress(e.target.value)}
              disabled={isUploading || isCreatingBulkOrder}
              placeholder="Enter full address"
            />
          </div>
          <div>
            <Label className="mb-2">Floor or Unit no. *</Label>
            <Input
              value={senderFloorUnit}
              onChange={(e) => setSenderFloorUnit(e.target.value)}
              disabled={isUploading || isCreatingBulkOrder}
              placeholder="e.g., 12A, Floor 3"
            />
          </div>
        </div>

        {!isSenderInfoComplete() && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700 text-sm">
              ⚠️ Please complete all sender information (marked with *) to
              upload CSV and create bulk orders.
            </p>
          </div>
        )}
      </div>

      <BulkOrdersTable />

      {/* Order Summary */}
      <div className="bg-white rounded-lg p-8 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Order Summary
        </h2>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between text-gray-700">
            <span>Delivery</span>
            <span>+${totalBulkOrdersCost}</span>
          </div>
          <div className="border-t pt-4 flex justify-between text-lg font-semibold text-gray-900">
            <span>Total</span>
            <span>+${totalBulkOrdersCost}</span>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <Label className="mb-0">Payment method</Label>
          <Select
            defaultValue="stripe"
            disabled={isUploading || isCreatingBulkOrder}
          >
            <SelectTrigger className="w-[20%]">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stripe">Stripe account</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        onClick={handleConfirmOrder}
        className="w-full bg-gray-300 hover:bg-gray-400 cursor-pointer text-gray-900 font-bold py-3"
        // disabled={isConfirmButtonDisabled}
      >
        {isUpdatingStatus ? "Updating Status..." : "Confirm Order"}
      </Button>
    </>
  );
};

export default BulkOrderTab;
