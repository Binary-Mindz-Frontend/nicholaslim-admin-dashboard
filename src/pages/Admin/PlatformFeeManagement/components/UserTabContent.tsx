/* eslint-disable @typescript-eslint/no-explicit-any */
import UserFeeStructure from "./UserFeeStructure";
import DynamicSurgePricing from "./DynamicSurgePricing";

interface UserTabContentProps {
  activeTab: "USER" | "RAIDER";
  userFeeStructureData: any[];
  dynamicSurgeData: any[];
  onAddFeeStructure: (data: {
    feeName: string;
    amount: number;
    serviceAreaId: number;
    appliesTo:
      | "ALL_ORDERS"
      | "ORDER_LESS"
      | "EXPRESS_ORDERS"
      | "SCHEDULED_ORDERS"
      | "STACKED_ORDERS"
      | "STANDARD_ORDERS";
    applicableUser: "USER" | "RAIDER";
    conditionValue?: number;
  }) => Promise<any>;
  onUpdateFeeStructure: (data: {
    id: number;
    feeName: string;
    amount: number;
    serviceAreaId: number;
    appliesTo:
      | "ALL_ORDERS"
      | "ORDER_LESS"
      | "EXPRESS_ORDERS"
      | "SCHEDULED_ORDERS"
      | "STACKED_ORDERS"
      | "STANDARD_ORDERS";
    applicableUser: "USER" | "RAIDER";
    conditionValue?: number;
  }) => Promise<any>;
  onDeleteFeeStructure: (id: number) => Promise<any>;
  onAddSurgeRule: (data: {
    ruleName: string;
    priceMultiplier: number;
    condition: string;
    timeRange: string;
    applicableUser: "USER" | "RAIDER";
  }) => Promise<any>;
  onUpdateSurgeRule: (data: {
    id: number;
    ruleName: string;
    priceMultiplier: number;
    condition: string;
    timeRange: string;
    applicableUser: "USER" | "RAIDER";
  }) => Promise<any>;
  onDeleteSurgeRule: (id: number) => Promise<any>;
}

export default function UserTabContent({
  activeTab,
  userFeeStructureData,
  dynamicSurgeData,
  onAddFeeStructure,
  onUpdateFeeStructure,
  onDeleteFeeStructure,
  onAddSurgeRule,
  onUpdateSurgeRule,
  onDeleteSurgeRule,
}: UserTabContentProps) {
  return (
    <>
      <UserFeeStructure
        feeStructureData={userFeeStructureData}
        applicableUser={activeTab}
        onAddFeeStructure={onAddFeeStructure}
        onUpdateFeeStructure={onUpdateFeeStructure}
        onDeleteFeeStructure={onDeleteFeeStructure}
      />
      
      <DynamicSurgePricing
        surgeRulesData={dynamicSurgeData}
        applicableUser={activeTab}
        onAddSurgeRule={onAddSurgeRule}
        onUpdateSurgeRule={onUpdateSurgeRule}
        onDeleteSurgeRule={onDeleteSurgeRule}
      />
    </>
  );
}