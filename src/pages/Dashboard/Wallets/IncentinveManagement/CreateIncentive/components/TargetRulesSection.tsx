import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface TargetRulesSectionProps {
    formData: {
        metric: string;
        operator: string;
        ruleValue: string;
    };
    setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export const TargetRulesSection: React.FC<TargetRulesSectionProps> = ({
    formData,
    setFormData,
}) => {
    return (
        <div className="col-span-2 border-t pt-4 mt-2">
            <h4 className="md:text-lg font-bold mb-3">Target Rules</h4>
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                    <Label className="text-xs">Metric</Label>
                    <Select
                        value={formData.metric}
                        onValueChange={(v) =>
                            setFormData((prev: any) => ({ ...prev, metric: v }))
                        }
                    >
                        <SelectTrigger className="text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="COMPLETED_DELIVERIES">
                                Completed Deliveries
                            </SelectItem>
                            <SelectItem value="TOTAL_EARNINGS">Total Earnings</SelectItem>
                            <SelectItem value="ONLINE_HOURS">Online Hours</SelectItem>
                            <SelectItem value="ACCEPTED_ORDERS">Accepted Orders</SelectItem>
                            <SelectItem value="ACCEPTANCE_RATE">Acceptance Rate (%)</SelectItem>
                            <SelectItem value="CONSECUTIVE_TRIPS">Consecutive Trips</SelectItem>
                            <SelectItem value="REFERRAL_COUNT">Referral Count</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">Operator</Label>
                    <Select
                        value={formData.operator}
                        onValueChange={(v) =>
                            setFormData((prev: any) => ({ ...prev, operator: v }))
                        }
                    >
                        <SelectTrigger className="text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="GTE">Greater Than or Equal (&ge;)</SelectItem>
                            <SelectItem value="LTE">Less Than or Equal (&le;)</SelectItem>
                            <SelectItem value="EQ">Equal To (=)</SelectItem>
                            <SelectItem value="GT">Greater Than (&gt;)</SelectItem>
                            <SelectItem value="LT">Less Than (&lt;)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1 col-span-2">
                    <Label className="text-xs">Target Value</Label>
                    <Input
                        type="number"
                        value={formData.ruleValue}
                        onChange={(e) =>
                            setFormData((prev: any) => ({ ...prev, ruleValue: e.target.value }))
                        }
                        placeholder="10"
                    />
                </div>
            </div>
        </div>
    );
};
