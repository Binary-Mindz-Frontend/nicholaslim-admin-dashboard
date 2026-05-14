export interface DeductionFee {
  id?: number;
  deductionName: string;
  amount: string;
  type: string;
  applicableUser: "USER" | "RAIDER";
}

export interface DeductionFeesProps {
  deductionFeesData: any[];
  onAddDeductionFee: (data: {
    deductionName: string;
    amount: number;
    type: string;
    applicableUser: "USER" | "RAIDER";
  }) => Promise<void>;
  onUpdateDeductionFee: (data: {
    id: number;
    deductionName: string;
    amount: number;
    type: string;
    applicableUser: "USER" | "RAIDER";
  }) => Promise<{ success: boolean; message: string }>;
  onDeleteDeductionFee: (id: number) => Promise<{ success: boolean; message: string }>;
}