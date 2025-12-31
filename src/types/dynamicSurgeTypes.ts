export interface PricingRule {
  id: string;
  title: string;
  timeRange?: string;
  days?: string;
  charge: string;
  enabled: boolean;
  applicable_user?: "USER" | "RAIDER";
  role_name?: string;
  price_multiplier?: number;
  condition?: string;
  time_range?: string;
  is_active?: boolean;
}