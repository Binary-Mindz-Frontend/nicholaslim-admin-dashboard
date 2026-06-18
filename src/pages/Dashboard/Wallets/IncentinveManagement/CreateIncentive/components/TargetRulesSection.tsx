import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TargetRulesSectionProps {
  formData: {
    ruleGroups: {
      label: string;
      rules: {
        metric: string;
        operator: string;
        value: string | number;
      }[];
    }[];
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export const TargetRulesSection: React.FC<TargetRulesSectionProps> = ({
  formData,
  setFormData,
}) => {
  const ruleGroups = formData.ruleGroups || [];

  const handleAddGroup = () => {
    setFormData((prev: any) => ({
      ...prev,
      ruleGroups: [
        ...prev.ruleGroups,
        {
          label: `Group ${String.fromCharCode(65 + prev.ruleGroups.length)}`,
          rules: [
            {
              metric: "COMPLETED_DELIVERIES",
              operator: "GTE",
              value: "",
            },
          ],
        },
      ],
    }));
  };

  const handleRemoveGroup = (groupIndex: number) => {
    setFormData((prev: any) => ({
      ...prev,
      ruleGroups: prev.ruleGroups.filter(
        (_: any, idx: number) => idx !== groupIndex,
      ),
    }));
  };

  const handleGroupLabelChange = (groupIndex: number, newLabel: string) => {
    setFormData((prev: any) => {
      const updated = [...prev.ruleGroups];
      updated[groupIndex] = {
        ...updated[groupIndex],
        label: newLabel,
      };
      return { ...prev, ruleGroups: updated };
    });
  };

  const handleAddRule = (groupIndex: number) => {
    setFormData((prev: any) => {
      const updated = [...prev.ruleGroups];
      const updatedGroup = { ...updated[groupIndex] };
      updatedGroup.rules = [
        ...updatedGroup.rules,
        {
          metric: "COMPLETED_DELIVERIES",
          operator: "GTE",
          value: "",
        },
      ];
      updated[groupIndex] = updatedGroup;
      return { ...prev, ruleGroups: updated };
    });
  };

  const handleRemoveRule = (groupIndex: number, ruleIndex: number) => {
    setFormData((prev: any) => {
      const updated = [...prev.ruleGroups];
      const updatedGroup = { ...updated[groupIndex] };
      updatedGroup.rules = updatedGroup.rules.filter(
        (_: any, idx: number) => idx !== ruleIndex,
      );
      updated[groupIndex] = updatedGroup;
      return { ...prev, ruleGroups: updated };
    });
  };

  const handleRuleChange = (
    groupIndex: number,
    ruleIndex: number,
    field: "metric" | "operator" | "value",
    value: any,
  ) => {
    setFormData((prev: any) => {
      const updated = [...prev.ruleGroups];
      const updatedGroup = { ...updated[groupIndex] };
      const updatedRules = [...updatedGroup.rules];
      updatedRules[ruleIndex] = {
        ...updatedRules[ruleIndex],
        [field]: value,
      };
      updatedGroup.rules = updatedRules;
      updated[groupIndex] = updatedGroup;
      return { ...prev, ruleGroups: updated };
    });
  };

  return (
    <div className="col-span-2 border-t pt-4 mt-2">
      <div className="flex justify-between items-center mb-4">
        <h4 className="md:text-lg font-bold text-gray-900">
          Target Rules / Conditions
        </h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddGroup}
          className="flex items-center gap-1 cursor-pointer hover:bg-slate-100 font-semibold text-xs border-slate-300"
        >
          <Plus className="h-3.5 w-3.5 text-[#F2A735]" />
          Add Rule Group
        </Button>
      </div>

      {ruleGroups.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed rounded-lg text-gray-400 text-sm">
          No target rules set. Click "Add Rule Group" above to configure.
        </div>
      ) : (
        <div className="space-y-4">
          {ruleGroups.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="border border-slate-200 rounded-lg p-4 bg-slate-50/30 relative"
            >
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center pb-3 border-b mb-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Label className="text-xs font-semibold text-gray-500 whitespace-nowrap">
                    Group Label:
                  </Label>
                  <Input
                    className="text-xs h-8 max-w-[200px]"
                    value={group.label}
                    onChange={(e) =>
                      handleGroupLabelChange(groupIndex, e.target.value)
                    }
                    placeholder="e.g. Group A"
                    required
                  />
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddRule(groupIndex)}
                    className="text-xs h-8 cursor-pointer flex items-center gap-1 hover:bg-slate-100"
                  >
                    <Plus className="h-3.5 w-3.5 text-blue-600" />
                    Add Rule
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveGroup(groupIndex)}
                    className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                    title="Remove this group"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {group.rules.length === 0 ? (
                <div className="text-center py-4 text-xs text-gray-400">
                  No rules in this group. Click "Add Rule" to add one.
                </div>
              ) : (
                <div className="space-y-3">
                  {group.rules.map((rule, ruleIndex) => (
                    <div
                      key={ruleIndex}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end"
                    >
                      <div className="sm:col-span-5 space-y-1">
                        {ruleIndex === 0 && (
                          <Label className="text-[10px] uppercase font-bold text-gray-400">
                            Metric
                          </Label>
                        )}
                        <Select
                          value={rule.metric}
                          onValueChange={(v) =>
                            handleRuleChange(groupIndex, ruleIndex, "metric", v)
                          }
                        >
                          <SelectTrigger className="text-xs h-9 bg-white w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="COMPLETED_DELIVERIES">
                              Completed Deliveries
                            </SelectItem>
                            <SelectItem value="TOTAL_EARNINGS">
                              Total Earnings
                            </SelectItem>
                            <SelectItem value="ONLINE_HOURS">
                              Online Hours
                            </SelectItem>
                            <SelectItem value="ACCEPTED_ORDERS">
                              Accepted Orders
                            </SelectItem>
                            <SelectItem value="ACCEPTANCE_RATE">
                              Acceptance Rate (%)
                            </SelectItem>
                            <SelectItem value="CONSECUTIVE_TRIPS">
                              Consecutive Trips
                            </SelectItem>
                            <SelectItem value="REFERRAL_COUNT">
                              Referral Count
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="sm:col-span-3 space-y-1">
                        {ruleIndex === 0 && (
                          <Label className="text-[10px] uppercase font-bold text-gray-400">
                            Operator
                          </Label>
                        )}
                        <Select
                          value={rule.operator}
                          onValueChange={(v) =>
                            handleRuleChange(
                              groupIndex,
                              ruleIndex,
                              "operator",
                              v,
                            )
                          }
                        >
                          <SelectTrigger className="text-xs h-9 bg-white w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GTE">GTE (&ge;)</SelectItem>
                            <SelectItem value="LTE">LTE (&le;)</SelectItem>
                            <SelectItem value="EQ">EQ (=)</SelectItem>
                            <SelectItem value="GT">GT (&gt;)</SelectItem>
                            <SelectItem value="LT">LT (&lt;)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="sm:col-span-3 space-y-1">
                        {ruleIndex === 0 && (
                          <Label className="text-[10px] uppercase font-bold text-gray-400">
                            Value
                          </Label>
                        )}
                        <Input
                          type="number"
                          className="text-xs h-9 bg-white"
                          value={rule.value}
                          onChange={(e) =>
                            handleRuleChange(
                              groupIndex,
                              ruleIndex,
                              "value",
                              e.target.value,
                            )
                          }
                          placeholder="10"
                          required
                        />
                      </div>

                      <div className="sm:col-span-1 flex justify-center pb-0.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={group.rules.length === 1}
                          onClick={() =>
                            handleRemoveRule(groupIndex, ruleIndex)
                          }
                          className="h-9 w-9 text-gray-400 hover:text-rose-500 disabled:opacity-30 cursor-pointer"
                          title="Remove this rule"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
