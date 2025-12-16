export interface CompetitionConfig {
  id: number;
  rank_weight: number;
  rating_weight: number;
  followers_weight: number;
  challenges_timeout: number;
  max_users_to_join: number;
  total_weights: number;
  created_at: string;
  updated_at: string;
}

export interface CompetitionLog {
  id: number;
  config_id: number;
  changed_by: string;
  rank: number;
  rating: number;
  followers_weight: number;
  challenges_timeout: number;
  max_users_to_join: number;
  created_at: string;
}

export interface UpdateConfigPayload {
  id: number;
  rank_weight: number;
  rating_weight: number;
  followers_weight: number;
  challenges_timeout: number;
  max_users_to_join: number;
}