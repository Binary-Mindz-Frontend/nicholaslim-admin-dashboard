// types/userFeeStructureType.ts
export interface FeeStructure {
  id?: number;
  feeName: string;
  amount: number;
  displayAmount?: string;
  serviceArea: string;
  appliesTo: "ALL_ORDERS" | "ORDERLESS15" | "EXPRESS_ORDERS";
  applicableUser: "USER" | "RAIDER";
}

export interface UserFeeStructureProps {
  feeStructureData: any[];
  applicableUser: "USER" | "RAIDER";
  onAddFeeStructure: (data: {
    feeName: string;
    amount: number;
    serviceArea: string;
    appliesTo: "ALL_ORDERS" | "ORDERLESS15" | "EXPRESS_ORDERS";
    applicableUser: "USER" | "RAIDER";
  }) => Promise<void>;
  onUpdateFeeStructure: (data: {
    id: number;
    feeName: string;
    amount: number;
    serviceArea: string;
    appliesTo: "ALL_ORDERS" | "ORDERLESS15" | "EXPRESS_ORDERS";
    applicableUser: "USER" | "RAIDER";
  }) => Promise<{ success: boolean; message: string }>;
  onDeleteFeeStructure: (id: number) => Promise<{ success: boolean; message: string }>;
}