/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CompensationRule {
  id?: number;
  scenario: string;
  percentage: number;
  serviceAreaIds: (string | number)[];
  applicableUser: "USER" | "RAIDER";
}

export interface DriverCompensationRulesProps {
  compensationRulesData: any[];
  onAddCompensationRule: (data: {
    scenario: string;
    percentage: number;
    serviceAreaIds: (string | number)[];
    applicableUser: "USER" | "RAIDER";
  }) => Promise<any>;
  onUpdateCompensationRule: (data: {
    id: number;
    scenario: string;
    percentage: number;
    serviceAreaIds: (string | number)[];
    applicableUser: "USER" | "RAIDER";
  }) => Promise<any>;
  onDeleteCompensationRule: (id: number) => Promise<any>;
}
