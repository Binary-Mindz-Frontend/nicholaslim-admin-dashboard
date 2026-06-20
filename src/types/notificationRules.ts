export interface NotificationRule {
  id: string;
  name: string;
  triggerTag: string;
  operator: 'LTE' | 'GTE' | 'EQ';
  targetValue: string;
  stopScope?: 'DYNAMIC' | 'FIXED';
  fixedStopIndex?: number;
  notifTitle: string;
  notifMessage: string;
  sendToSender: boolean;
  sendToRecipient: boolean;
  viaPush: boolean;
  viaWhatsApp: boolean;
  viaSMS: boolean;
  isActive: boolean;
  createdAt?: string;
}
