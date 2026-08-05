import React from "react";
import expressIcon from "@/assets/images/icons/express_delivery.png";
import walletIcon from "@/assets/images/icons/wallet_pricing.png";
import packageIcon from "@/assets/images/icons/additional_package.png";
import scheduleIcon from "@/assets/images/icons/scheduled_delivery.png";
import helperIcon from "@/assets/images/icons/helper_team.png";

export interface DeliveryTypeIconOption {
  name: string;
  label: string;
  src: string | null;
}

/** The "No Icon" sentinel value stored in formData.icon */
export const NO_ICON_VALUE = "";

export const DELIVERY_TYPE_ICONS: DeliveryTypeIconOption[] = [
  {
    name: NO_ICON_VALUE,
    label: "No Icon",
    src: null,
  },
  {
    name: "express_delivery.png",
    label: "Express",
    src: expressIcon,
  },
  {
    name: "wallet_pricing.png",
    label: "Wallet",
    src: walletIcon,
  },
  {
    name: "additional_package.png",
    label: "Extra Package",
    src: packageIcon,
  },
  {
    name: "scheduled_delivery.png",
    label: "Schedule",
    src: scheduleIcon,
  },
  {
    name: "helper_team.png",
    label: "Helper Team",
    src: helperIcon,
  },
];

export const getDeliveryTypeIconSrc = (iconName?: string) => {
  if (!iconName) return null;
  const match = DELIVERY_TYPE_ICONS.find(
    (item) => item.name === iconName || item.name.replace(".png", "") === iconName
  );
  return match ? match.src : null;
};

interface DeliveryTypeIconPickerProps {
  selectedIcon: string;
  onChange: (iconName: string) => void;
}

const DeliveryTypeIconPicker: React.FC<DeliveryTypeIconPickerProps> = ({
  selectedIcon,
  onChange,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Icon
      </label>
      {/* 3 cols on mobile → 6 cols on sm+ so all icons sit in one row */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {DELIVERY_TYPE_ICONS.map((item) => {
          const isSelected =
            selectedIcon === item.name ||
            (item.name !== NO_ICON_VALUE &&
              selectedIcon === item.name.replace(".png", ""));

          return (
            <button
              key={item.name === NO_ICON_VALUE ? "__no_icon__" : item.name}
              type="button"
              onClick={() => onChange(item.name)}
              title={item.label}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all cursor-pointer ${
                isSelected
                  ? "border-[#FFCC00] bg-yellow-50 shadow-sm ring-1 ring-[#FFCC00]"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              } ${item.src === null ? "border-dashed" : ""}`}
            >
              {item.src === null ? (
                /* "No Icon" cell — dashed box with a dash symbol */
                <div className="w-10 h-10 flex items-center justify-center mb-1">
                  <span
                    className={`text-2xl font-light select-none ${
                      isSelected ? "text-yellow-600" : "text-gray-400"
                    }`}
                  >
                    —
                  </span>
                </div>
              ) : (
                <img
                  src={item.src}
                  alt={item.label}
                  className="w-10 h-10 object-contain mb-1"
                />
              )}
              {/* <span
                className={`text-xs font-medium text-center leading-tight ${
                  isSelected ? "text-yellow-900 font-bold" : "text-gray-600"
                }`}
              >
                {item.label}
              </span> */}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DeliveryTypeIconPicker;
