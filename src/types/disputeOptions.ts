export const DISPUTE_ROLE_OPTIONS = [
  { value: "USER", label: "User" },
  { value: "DRIVER", label: "Driver" },
];

export const PREDEFINED_DISPUTES = {
  USER: [
    "Damage Item",
    "Delivery Issue",
    "Payment Dispute",
    "Unprofessional Behavior",
    "Missing Item",
    "Long Waiting Time",
    "Incident report",
    "Route / Dispatcher issue",
  ],
  DRIVER: [
    "Damage Item",
    "Delivery Issue",
    "Payment Dispute",
    "Unprofessional Behavior",
    "Missing Item",
    "Long Waiting Time",
    "Incident report",
    "Route / Dispatcher issue",
  ],
};

export const DEFAULT_DISPUTE_VALUES = {
  USER: PREDEFINED_DISPUTES.USER.reduce(
    (acc, item) => {
      acc[item] = { checked: true, errorPercentage: 3 };
      return acc;
    },
    {} as Record<string, { checked: boolean; errorPercentage: number }>,
  ),
  DRIVER: PREDEFINED_DISPUTES.DRIVER.reduce(
    (acc, item) => {
      acc[item] = { checked: true, errorPercentage: 3 };
      return acc;
    },
    {} as Record<string, { checked: boolean; errorPercentage: number }>,
  ),
};
