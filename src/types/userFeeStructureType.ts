/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FeeStructure {
  id?: number;
  feeName: string;
  amount: number;
  displayAmount?: string;
  serviceAreaIds: (string | number)[];
  appliesTo: string;
  applicableUser: "USER" | "RAIDER";
  conditionValue?: number;
  ruleKey?: string;
  ruleOperator?: string;
  ruleValue?: string;
  conditionUnit?: string;
  isActive: boolean;
}

export interface UserFeeStructureProps {
  feeStructureData: any[];
  applicableUser: "USER" | "RAIDER";
  onAddFeeStructure: (data: any) => Promise<any>;
  onUpdateFeeStructure: (data: any) => Promise<any>;
  onDeleteFeeStructure: (id: number) => Promise<any>;
}
