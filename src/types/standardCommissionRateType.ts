/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CommissionRule {
  id?: number;
  ruleName: string;
  percentage: number;
  serviceAreaIds: (string | number)[];
}

export interface StandardCommissionRateProps {
  standardCommissionRateData: any[];
  applicableUser: "USER" | "RAIDER";
  onAddCommissionRate: (data: {
    ruleName: string;
    percentage: number;
    serviceAreaIds: (string | number)[];
  }) => Promise<any>;
  onUpdateCommissionRate: (data: {
    id: number;
    ruleName: string;
    percentage: number;
    serviceAreaIds: (string | number)[];
  }) => Promise<any>;
  onDeleteCommissionRate: (id: number) => Promise<any>;
}