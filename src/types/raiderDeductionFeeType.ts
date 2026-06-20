/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DeductionFee {
  id?: number;
  deductionName: string;
  amount: string;
  type: string;
  applicableUser: "USER" | "RAIDER";
  serviceAreaIds: (string | number)[];
}

export interface DeductionFeesProps {
  deductionFeesData: any[];
  onAddDeductionFee: (data: {
    deductionName: string;
    amount: number;
    type: string;
    applicableUser: "USER" | "RAIDER";
    serviceAreaIds: (string | number)[];
  }) => Promise<any>;
  onUpdateDeductionFee: (data: {
    id: number;
    deductionName: string;
    amount: number;
    type: string;
    applicableUser: "USER" | "RAIDER";
    serviceAreaIds: (string | number)[];
  }) => Promise<any>;
  onDeleteDeductionFee: (id: number) => Promise<any>;
}