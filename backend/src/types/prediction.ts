
export interface Prediction {
  id: string;
  user_id: string;
  asset_id: string;
  prediction: 'buy' | 'sell' | 'hold';
  content?: string;
  expected_direction: 'up' | 'down' | 'stable';
  created_at: string;
  updated_at: string;
}

export interface PredictionOutcome {
  id: string;
  prediction_id: string;
  result: 'correct' | 'incorrect' | 'pending';
  verified_at?: string;
  actual_change?: number;
  actual_direction?: 'up' | 'down' | 'stable';
  created_at: string;
  updated_at: string;
}

export interface PredictionVote {
  user_id: string;
  prediction_id: string;
  vote: 'up' | 'down';
  created_at: string;
  updated_at: string;
}

export interface PredictionWithDetails extends Prediction {
  outcome?: PredictionOutcome;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down' | null;
}
