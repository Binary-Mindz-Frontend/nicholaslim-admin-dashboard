export interface CommissionRule {
  id?: number;
  ruleName: string;
  percentage: number;
  serviceArea: string;
}

export interface StandardCommissionRateProps {
  standardCommissionRateData: any[];
  applicableUser: "USER" | "RAIDER";
  onAddCommissionRate: (data: {
    ruleName: string;
    percentage: number;
    serviceArea: string;
  }) => Promise<void>;
  onUpdateCommissionRate: (data: {
    id: number;
    ruleName: string;
    percentage: number;
    serviceArea: string;
  }) => Promise<{ success: boolean; message: string }>;
  onDeleteCommissionRate: (id: number) => Promise<{ success: boolean; message: string }>;
}
