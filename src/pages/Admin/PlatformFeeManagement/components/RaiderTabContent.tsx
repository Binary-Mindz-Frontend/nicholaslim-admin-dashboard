/* eslint-disable @typescript-eslint/no-explicit-any */
import StandardCommissionRate from "./StandardCommissionRate";
import DriverCompensationRules from "./DriverCompensationRules";
import DeductionFees from "./DeductionFees";

interface RaiderTabContentProps {
  activeTab: "USER" | "RAIDER";
  standardCommissionRateData: any[];
  raiderCompensationRoleData: any[];
  raiderDeductionFeeData: any[];
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
  onAddCompensationRule: (data: {
    scenario: string;
    percentage: number;
    serviceAreaId: number;
    applicableUser: "USER" | "RAIDER";
  }) => Promise<any>;
  onUpdateCompensationRule: (data: {
    id: number;
    scenario: string;
    percentage: number;
    serviceAreaId: number;
    applicableUser: "USER" | "RAIDER";
  }) => Promise<any>;
  onDeleteCompensationRule: (id: number) => Promise<any>;
  onAddDeductionFee: (data: {
    deductionName: string;
    amount: string;
    type: string;
    applicableUser: "USER" | "RAIDER";
  }) => Promise<any>;
  onUpdateDeductionFee: (data: {
    id: number;
    deductionName: string;
    amount: string;
    type: string;
    applicableUser: "USER" | "RAIDER";
  }) => Promise<any>;
  onDeleteDeductionFee: (id: number) => Promise<any>;
}

export default function RaiderTabContent({
  activeTab,
  standardCommissionRateData,
  raiderCompensationRoleData,
  raiderDeductionFeeData,
  onAddCommissionRate,
  onUpdateCommissionRate,
  onDeleteCommissionRate,
  onAddCompensationRule,
  onUpdateCompensationRule,
  onDeleteCompensationRule,
  onAddDeductionFee,
  onUpdateDeductionFee,
  onDeleteDeductionFee,
}: RaiderTabContentProps) {
  return (
    <>
      <StandardCommissionRate
        standardCommissionRateData={standardCommissionRateData}
        applicableUser={activeTab}
        onAddCommissionRate={onAddCommissionRate}
        onUpdateCommissionRate={onUpdateCommissionRate}
        onDeleteCommissionRate={onDeleteCommissionRate}
      />

      <DriverCompensationRules
        compensationRulesData={raiderCompensationRoleData}
        onAddCompensationRule={onAddCompensationRule}
        onUpdateCompensationRule={onUpdateCompensationRule}
        onDeleteCompensationRule={onDeleteCompensationRule}
      />

      <DeductionFees
        deductionFeesData={raiderDeductionFeeData}
        onAddDeductionFee={onAddDeductionFee}
        onUpdateDeductionFee={onUpdateDeductionFee}
        onDeleteDeductionFee={onDeleteDeductionFee}
      />
    </>
  );
}