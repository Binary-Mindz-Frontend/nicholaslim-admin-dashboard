/* eslint-disable @typescript-eslint/no-explicit-any */
import StandardCommissionRate from "./StandardCommissionRate";
import DriverCompensationRules from "./DriverCompensationRules";
import DeductionFees from "./DeductionFees";

interface RaiderTabContentProps {
  activeTab: "USER" | "RAIDER";
  standardCommissionRateData: any[];
  raiderCompensationRoleData: any[];
  raiderDeductionFeeData: any[];
  onAddCommissionRate: (data: any) => Promise<any>;
  onUpdateCommissionRate: (data: any) => Promise<any>;
  onDeleteCommissionRate: (id: number) => Promise<any>;
  onAddCompensationRule: (data: any) => Promise<any>;
  onUpdateCompensationRule: (data: any) => Promise<any>;
  onDeleteCompensationRule: (id: number) => Promise<any>;
  onAddDeductionFee: (data: any) => Promise<any>;
  onUpdateDeductionFee: (data: any) => Promise<any>;
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