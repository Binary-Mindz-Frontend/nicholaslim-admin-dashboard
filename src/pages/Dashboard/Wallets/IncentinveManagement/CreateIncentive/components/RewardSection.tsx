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

interface RewardSectionProps {
    formData: {
        reward_type: string;
        reward_value: string;
        max_claim: string;
        claim_type: string;
        claim_expire: string;
        time_constant: string;
        status: string;
    };
    setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export const RewardSection: React.FC<RewardSectionProps> = ({
    formData,
    setFormData,
}) => {
    return (
        <div className="col-span-2 border-t pt-4 mt-2 space-y-4">
            <h4 className="md:text-lg font-bold mb-3">Reward</h4>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Reward Type</Label>
                    <Select
                        value={formData.reward_type}
                        onValueChange={(v) =>
                            setFormData((prev: any) => ({ ...prev, reward_type: v }))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="FIXED">FIXED</SelectItem>
                            <SelectItem value="PERCENTAGE">PERCENTAGE</SelectItem>
                            <SelectItem value="POINTS">POINTS</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Reward Value</Label>
                    <Input
                        type="number"
                        value={formData.reward_value}
                        onChange={(e) =>
                            setFormData((prev: any) => ({ ...prev, reward_value: e.target.value }))
                        }
                        placeholder="50"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Max Claim</Label>
                    <Input
                        type="number"
                        value={formData.max_claim}
                        onChange={(e) =>
                            setFormData((prev: any) => ({ ...prev, max_claim: e.target.value }))
                        }
                        placeholder="5"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Claim Type</Label>
                    <Select
                        value={formData.claim_type}
                        onValueChange={(v) =>
                            setFormData((prev: any) => ({ ...prev, claim_type: v }))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="AUTO">AUTO</SelectItem>
                            <SelectItem value="MANUAL">MANUAL</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {formData.claim_type === "MANUAL" && (
                    <>
                        <div className="space-y-2 col-span-2">
                            <Label>Claim Expire</Label>
                            <Input
                                type="number"
                                value={formData.claim_expire}
                                onChange={(e) =>
                                    setFormData((prev: any) => ({
                                        ...prev,
                                        claim_expire: e.target.value,
                                    }))
                                }
                                placeholder="2"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Mins/Hours/Days</Label>
                            <Select
                                value={formData.time_constant}
                                onValueChange={(v) =>
                                    setFormData((prev: any) => ({ ...prev, time_constant: v }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MINUTES">Mins</SelectItem>
                                    <SelectItem value="HOURS">Hours</SelectItem>
                                    <SelectItem value="DAYS">Days</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </>
                )}
                <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                        value={formData.status}
                        onValueChange={(v) =>
                            setFormData((prev: any) => ({ ...prev, status: v }))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                            <SelectItem value="DISABLED">DISABLED</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
};
