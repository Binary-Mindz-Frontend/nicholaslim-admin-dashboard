/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CompensationRule {
  id?: number;
  scenario: string;
  percentage: number;
  serviceAreaId: number | null;
  applicableUser: "USER" | "RAIDER";
}

export interface DriverCompensationRulesProps {
  compensationRulesData: any[];
  onAddCompensationRule: (data: {
    scenario: string;
    percentage: number;
    serviceAreaId: number;
    applicableUser: "USER" | "RAIDER";
  }) => Promise<void>;
  onUpdateCompensationRule: (data: {
    id: number;
    scenario: string;
    percentage: number;
    serviceAreaId: number;
    applicableUser: "USER" | "RAIDER";
  }) => Promise<{ success: boolean; message: string }>;
  onDeleteCompensationRule: (
    id: number,
  ) => Promise<{ success: boolean; message: string }>;
}
