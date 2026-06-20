/* eslint-disable @typescript-eslint/no-explicit-any */
import UserFeeStructure from "./UserFeeStructure";
import DynamicSurgePricing from "./DynamicSurgePricing";

interface UserTabContentProps {
  activeTab: "USER" | "RAIDER";
  userFeeStructureData: any[];
  dynamicSurgeData: any[];
  onAddFeeStructure: (data: any) => Promise<any>;
  onUpdateFeeStructure: (data: any) => Promise<any>;
  onDeleteFeeStructure: (id: number) => Promise<any>;
  onAddSurgeRule: (data: any) => Promise<any>;
  onUpdateSurgeRule: (data: any) => Promise<any>;
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