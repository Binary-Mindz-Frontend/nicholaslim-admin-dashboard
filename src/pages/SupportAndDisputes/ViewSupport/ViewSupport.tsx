import { useParams } from "react-router-dom";
import { supportAndDisputesData } from "../data/SupportData";
import { CircleX } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ViewSupport = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [adjustmentType, setAdjustmentType] = useState("");
    const [amount, setAmount] = useState("");

    // User‐editable allocations
    const [companyAllocation, setCompanyAllocation] = useState(0);
    const [driverAllocation, setDriverAllocation] = useState(0);

    // Auto-calculated percentages
    const [companyPercentage, setCompanyPercentage] = useState(0);
    const [driverPercentage, setDriverPercentage] = useState(0);

    // Update allocations when amount changes

    useEffect(() => {
        const amt = Number(amount) || 0;
        const totalAlloc = companyAllocation + driverAllocation;

        // If user didn't type any custom value yet, split default 60/40
        if (totalAlloc === 0 && amt > 0) {
            setCompanyAllocation((amt * 60) / 100);
            setDriverAllocation((amt * 40) / 100);
        }
    }, [amount, companyAllocation, driverAllocation]);


    // Calculate percentages based on allocation amounts
    useEffect(() => {
        const totalAlloc = companyAllocation + driverAllocation;
        if (totalAlloc > 0) {
            setCompanyPercentage((companyAllocation / totalAlloc) * 100);
            setDriverPercentage((driverAllocation / totalAlloc) * 100);
        } else {
            setCompanyPercentage(0);
            setDriverPercentage(0);
        }
    }, [companyAllocation, driverAllocation]);

    const total = companyAllocation + driverAllocation;

    // find selected dispute
    const dispute = supportAndDisputesData.find((item) => item.caseId === id);
    if (!dispute) return <p className="p-10 text-red-500">Case not found</p>;

    return (
        <div className="px-8 sm:p-6 bg-[#F5F7FA]">
            <div className="w-full mx-auto space-y-4 mb-6">
                <div className="pt-2 sm:py-2 flex items-center justify-between">
                    <h1 className="text-black text-2xl font-bold">All Order</h1>

                    <button onClick={() => navigate(`/support`)}
                        className="flex items-center gap-1 cursor-pointer bg-primary py-2 px-4 rounded-md text-base">
                        Close Case <CircleX size={16} />
                    </button>
                </div>

                <div className="p-2 sm:p-10 md:px-28 space-y-6 bg-white rounded-2xl">
                    <h2 className="text-center text-lg font-semibold">Original Complaint</h2>

                    {/* Complaint Box */}
                    <div className="border rounded-lg p-6 bg-white shadow">
                        <div className=" text-sm mb-4">
                            <div className="flex items-center justify-between">
                                <p>Customer</p>
                                <p className="font-semibold">{dispute.customerName}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p>Order ID</p>
                                <p className="font-semibold">{dispute.orderId}</p>
                            </div>

                            <div className="flex items-center justify-between">
                                <p>Issue Type</p>
                                <p>{dispute.issueType}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p>Priority</p>
                                <p className="text-red-600 font-semibold">{dispute.priority}</p>
                            </div>
                            <div className="my-5 sm:my-2">
                                <hr />
                            </div>
                        </div>

                        <div>
                            <p className="font-semibold">Customer Statements</p>
                            <p className="text-gray-600 mt-1">{dispute.statement}</p>
                        </div>
                    </div>

                    {/* ---------------- FINANCIAL ADJUSTMENT ---------------- */}
                    <h2 className="text-center text-lg font-semibold">Financial Adjustment</h2>

                    <div className="border rounded-lg p-6 bg-white shadow space-y-6">

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                            {/* Select */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Adjustment Type</label>
                                <Select value={adjustmentType} onValueChange={setAdjustmentType}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select adjustment" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="Full Refund">Full Refund</SelectItem>
                                        <SelectItem value="Partial Refund">Partial Refund</SelectItem>
                                        <SelectItem value="Replacement">Replacement</SelectItem>
                                        <SelectItem value="Store Credit">Store Credit</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Amount Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Amount</label>
                                <Input
                                    type="number"
                                    placeholder="$0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* === SHOW WHEN adjustmentType SELECTED === */}
                        {adjustmentType && (
                            <div className="mt-6 flex flex-wrap gap-10">

                                {/* Company Allocation */}
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium">Company Allocation</label>

                                    {/* Editable allocation input */}
                                    <div className="flex items-center border px-2 py-1 rounded-md bg-white">
                                        <Input
                                            type="number"
                                            className="w-20 border-none p-0 text-center"
                                            value={companyAllocation}
                                            onChange={(e) => setCompanyAllocation(Number(e.target.value))}
                                        />
                                    </div>

                                    {/* Percentage display */}
                                    <span className="text-sm ml-1">{companyPercentage.toFixed(1)}%</span>
                                </div>

                                {/* Driver Allocation */}
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium">Driver Allocation</label>

                                    <div className="flex items-center border px-2 py-1 rounded-md bg-white">
                                        <Input
                                            type="number"
                                            className="w-20 border-none p-0 text-center"
                                            value={driverAllocation}
                                            onChange={(e) => setDriverAllocation(Number(e.target.value))}
                                        />
                                    </div>

                                    <span className="text-sm ml-1">{driverPercentage.toFixed(1)}%</span>
                                </div>

                                {/* Total */}
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium">Total</label>
                                    <div className="px-4 py-2 bg-yellow-50 rounded-md border text-sm">
                                        {total.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-4">
                            <p className="text-black font-medium">
                                Total Order Cost: ${dispute.totalOrderCost}
                            </p>

                            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
                                Proceed Adjustment
                            </button>
                        </div>
                    </div>

                    {/* Evidence Attachments */}
                    <h3 className="text-center font-semibold text-lg">Evidence Attachments</h3>
                    <div className="border rounded-xl p-6 bg-white shadow">
                        <div className="flex gap-6 justify-center sm:justify-start flex-wrap">
                            {dispute.images?.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    className="w-32 h-32 rounded-xl object-cover border shadow-sm"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewSupport;
