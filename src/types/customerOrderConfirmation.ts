export interface CustomerOrderConfirmation {
  id: number;
  new_customer_percentage: number;
  completed_order_required: number;
  follower_weight: number;
  created_at: string;
  updated_at: string;
}

export interface UpdateConfirmationPayload {
  new_customer_percentage: number;
  completed_order_required: number;
  follower_weight: number;
}