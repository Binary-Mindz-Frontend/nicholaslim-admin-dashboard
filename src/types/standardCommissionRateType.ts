/* eslint-disable @typescript-eslint/no-explicit-any */
// export interface CommissionRule {
//   id?: number;
//   ruleName: string;
//   percentage: number;
//   serviceArea: string;
// }

// export interface StandardCommissionRateProps {
//   standardCommissionRateData: any[];
//   applicableUser: "USER" | "RAIDER";
//   onAddCommissionRate: (data: {
//     ruleName: string;
//     percentage: number;
//     serviceArea: string;
//   }) => Promise<void>;
//   onUpdateCommissionRate: (data: {
//     id: number;
//     ruleName: string;
//     percentage: number;
//     serviceArea: string;
//   }) => Promise<{ success: boolean; message: string }>;
//   onDeleteCommissionRate: (id: number) => Promise<{ success: boolean; message: string }>;
// }

// types/standardCommissionRateType.ts
export interface CommissionRule {
  id?: number;
  ruleName: string;
  percentage: number;
  serviceAreaId: number | null;
}

export interface StandardCommissionRateProps {
  standardCommissionRateData: any[];
  applicableUser: "USER" | "RAIDER";
  onAddCommissionRate: (data: {
    ruleName: string;
    percentage: number;
    serviceAreaId: number;
  }) => Promise<any>;
  onUpdateCommissionRate: (data: {
    id: number;
    ruleName: string;
    percentage: number;
    serviceAreaId: number;
  }) => Promise<any>;
  onDeleteCommissionRate: (id: number) => Promise<any>;
}