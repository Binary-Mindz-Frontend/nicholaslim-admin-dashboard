export interface SurgeRule {
  id: number;
  ruleName: string;
  ratioFrom: string;
  ratioTo: string;
  priceMultiplier: string;
  maxCap: string;
  status: 'ACTIVE' | 'INACTIVE';
  serviceZones: any[];
  deliveryTypes: any[];
}