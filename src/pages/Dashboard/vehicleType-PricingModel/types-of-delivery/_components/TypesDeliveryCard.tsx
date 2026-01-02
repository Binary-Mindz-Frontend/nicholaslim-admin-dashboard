"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface DeliveryType {
  id: string;
  name: string;
  percentage: number;
  pickupTime: number;
  pickupUnit: "Min" | "Hour";
  deliveryTime: number;
  deliveryUnit: "Min" | "Hour";
}

interface TypesDeliveryCardProps {
  delivery: DeliveryType;
  onSave?: (data: DeliveryType) => void;
  isSaving?: boolean;
}

const TypesDeliveryCard: React.FC<TypesDeliveryCardProps> = ({
  delivery,
  onSave,
  isSaving = false,
}) => {
  const [percentageDisplay, setPercentageDisplay] = useState<string>(
    delivery.percentage.toString()
  );
  const [pickupTimeDisplay, setPickupTimeDisplay] = useState<string>("");
  const [pickupUnit, setPickupUnit] = useState<"Min" | "Hour">(
    delivery.pickupUnit
  );
  const [deliveryTimeDisplay, setDeliveryTimeDisplay] = useState<string>("");
  const [deliveryUnit, setDeliveryUnit] = useState<"Min" | "Hour">(
    delivery.deliveryUnit
  );

  const [originalDelivery, setOriginalDelivery] =
    useState<DeliveryType>(delivery);

  useEffect(() => {
    if (delivery.pickupUnit === "Hour") {
      setPickupTimeDisplay((delivery.pickupTime / 60).toString());
    } else {
      setPickupTimeDisplay(delivery.pickupTime.toString());
    }

    if (delivery.deliveryUnit === "Hour") {
      setDeliveryTimeDisplay((delivery.deliveryTime / 60).toString());
    } else {
      setDeliveryTimeDisplay(delivery.deliveryTime.toString());
    }

    setPercentageDisplay(delivery.percentage.toString());
    setPickupUnit(delivery.pickupUnit);
    setDeliveryUnit(delivery.deliveryUnit);
    setOriginalDelivery(delivery);
  }, [delivery]);

  const convertDisplayToMinutes = (
    value: string,
    unit: "Min" | "Hour"
  ): number => {
    const numValue = parseFloat(value) || 0;
    return unit === "Hour" ? Math.round(numValue * 60) : Math.round(numValue);
  };

  const handleSave = () => {
    const pickupMinutes = convertDisplayToMinutes(
      pickupTimeDisplay,
      pickupUnit
    );
    const deliveryMinutes = convertDisplayToMinutes(
      deliveryTimeDisplay,
      deliveryUnit
    );
    const percentageValue = parseFloat(percentageDisplay) || 0;

    const updatedData: DeliveryType = {
      ...originalDelivery,
      percentage: percentageValue,
      pickupTime: pickupMinutes,
      pickupUnit: pickupUnit,
      deliveryTime: deliveryMinutes,
      deliveryUnit: deliveryUnit,
    };

    onSave?.(updatedData);
  };

  const handlePickupUnitChange = (newUnit: "Min" | "Hour") => {
    if (pickupTimeDisplay) {
      const currentValue = parseFloat(pickupTimeDisplay) || 0;
      if (newUnit === "Hour" && pickupUnit === "Min") {
        setPickupTimeDisplay((currentValue / 60).toString());
      } else if (newUnit === "Min" && pickupUnit === "Hour") {
        setPickupTimeDisplay((currentValue * 60).toString());
      }
    }
    setPickupUnit(newUnit);
  };

  const handleDeliveryUnitChange = (newUnit: "Min" | "Hour") => {
    if (deliveryTimeDisplay) {
      const currentValue = parseFloat(deliveryTimeDisplay) || 0;
      if (newUnit === "Hour" && deliveryUnit === "Min") {
        setDeliveryTimeDisplay((currentValue / 60).toString());
      } else if (newUnit === "Min" && deliveryUnit === "Hour") {
        setDeliveryTimeDisplay((currentValue * 60).toString());
      }
    }
    setDeliveryUnit(newUnit);
  };

  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
      if ((value.match(/\./g) || []).length <= 1) {
        setPercentageDisplay(value);
      }
    }
  };

  const handlePickupTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      if ((value.match(/\./g) || []).length <= 1) {
        setPickupTimeDisplay(value);
      }
    }
  };

  const handleDeliveryTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      if ((value.match(/\./g) || []).length <= 1) {
        setDeliveryTimeDisplay(value);
      }
    }
  };

  const getTimeUnitSymbol = (unit: "Min" | "Hour"): string => {
    return unit === "Hour" ? "h" : "m";
  };

  const handlePercentageBlur = () => {
    if (percentageDisplay === "" || percentageDisplay === "-") {
      setPercentageDisplay("0");
    } else if (percentageDisplay.endsWith(".")) {
      setPercentageDisplay(percentageDisplay.slice(0, -1));
    }
  };

  const handlePickupTimeBlur = () => {
    if (pickupTimeDisplay === "" || pickupTimeDisplay === ".") {
      setPickupTimeDisplay("0");
    } else if (pickupTimeDisplay.endsWith(".")) {
      setPickupTimeDisplay(pickupTimeDisplay.slice(0, -1));
    }
  };

  const handleDeliveryTimeBlur = () => {
    if (deliveryTimeDisplay === "" || deliveryTimeDisplay === ".") {
      setDeliveryTimeDisplay("0");
    } else if (deliveryTimeDisplay.endsWith(".")) {
      setDeliveryTimeDisplay(deliveryTimeDisplay.slice(0, -1));
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="max-w-3xl mx-auto">
        {/* Title */}
        <h3 className="text-center text-xl font-semibold text-gray-900 mb-6">
          {originalDelivery.name}
        </h3>

        {/* Percentage Field */}
        <div className="mb-6 w-full sm:w-[50%] mx-auto">
          <label className="block text-base font-medium text-gray-700 mb-2">
            Percentage
          </label>
          <input
            type="text"
            value={percentageDisplay}
            onChange={handlePercentageChange}
            onBlur={handlePercentageBlur}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent outline-none"
            placeholder="30 (can be negative)"
            disabled={isSaving}
          />
        </div>

        {/* Pickup Time and Delivery Time Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Pickup Time */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-base font-medium text-gray-700 mb-2">
                Pickup Time
              </label>
              <Select
                value={pickupUnit}
                onValueChange={(value: "Min" | "Hour") =>
                  handlePickupUnitChange(value)
                }
                disabled={isSaving}
              >
                <SelectTrigger className="w-24 border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Min">Min</SelectItem>
                  <SelectItem value="Hour">Hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={pickupTimeDisplay}
                onChange={handlePickupTimeChange}
                onBlur={handlePickupTimeBlur}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent outline-none"
                placeholder={pickupUnit === "Hour" ? "1" : "30"}
                disabled={isSaving}
              />
              <div className="flex items-center px-3 bg-gray-100 border border-gray-300 rounded-md text-gray-700 min-w-[60px] justify-center">
                {getTimeUnitSymbol(pickupUnit)}
              </div>
            </div>
            {/* <p className="text-sm text-gray-500 mt-1">
              API will receive number:{" "}
              {convertDisplayToMinutes(pickupTimeDisplay, pickupUnit)} minutes
            </p> */}
          </div>

          {/* Delivery Time */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-base font-medium text-gray-700 mb-2">
                Delivery Time
              </label>
              <Select
                value={deliveryUnit}
                onValueChange={(value: "Min" | "Hour") =>
                  handleDeliveryUnitChange(value)
                }
                disabled={isSaving}
              >
                <SelectTrigger className="w-24 border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Min">Min</SelectItem>
                  <SelectItem value="Hour">Hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={deliveryTimeDisplay}
                onChange={handleDeliveryTimeChange}
                onBlur={handleDeliveryTimeBlur}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent outline-none"
                placeholder={deliveryUnit === "Hour" ? "1" : "45"}
                disabled={isSaving}
              />
              <div className="flex items-center px-3 bg-gray-100 border border-gray-300 rounded-md text-gray-700 min-w-[60px] justify-center">
                {getTimeUnitSymbol(deliveryUnit)}
              </div>
            </div>
            {/* <p className="text-sm text-gray-500 mt-1">
              API will receive number:{" "}
              {convertDisplayToMinutes(deliveryTimeDisplay, deliveryUnit)}{" "}
              minutes
            </p> */}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#FFCC00] hover:bg-[#E6B800] text-black font-semibold text-lg px-8 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TypesDeliveryCard;
