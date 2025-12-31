export interface FeeStructure {
  id?: number;
  feeName: string;
  amount: number;
  displayAmount?: string;
  serviceArea: string;
  appliesTo: "ALL_ORDERS" | "ORDER_LESS" | "EXPRESS_ORDERS" | "SCHEDULED_ORDERS" | "STACKED_ORDERS" | "STANDARD_ORDERS";
  applicableUser: "USER" | "RAIDER";
  conditionValue?: number;
}

export interface UserFeeStructureProps {
  feeStructureData: any[];
  applicableUser: "USER" | "RAIDER";
  onAddFeeStructure: (data: {
    feeName: string;
    amount: number;
    serviceArea: string;
    appliesTo: "ALL_ORDERS" | "ORDER_LESS" | "EXPRESS_ORDERS" | "SCHEDULED_ORDERS" | "STACKED_ORDERS" | "STANDARD_ORDERS";
    applicableUser: "USER" | "RAIDER";
    conditionValue?: number;
  }) => Promise<void>;
  onUpdateFeeStructure: (data: {
    id: number;
    feeName: string;
    amount: number;
    serviceArea: string;
    appliesTo: "ALL_ORDERS" | "ORDER_LESS" | "EXPRESS_ORDERS" | "SCHEDULED_ORDERS" | "STACKED_ORDERS" | "STANDARD_ORDERS";
    applicableUser: "USER" | "RAIDER";
    conditionValue?: number;
  }) => Promise<{ success: boolean; message: string }>;
  onDeleteFeeStructure: (id: number) => Promise<{ success: boolean; message: string }>;
}