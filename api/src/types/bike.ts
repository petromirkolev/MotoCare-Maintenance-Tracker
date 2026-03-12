export type BikeRow = {
  id: string;
  user_id: string;
  make: string;
  model: string;
  year: number;
  odo: number;
  created_at: string;
};

export type CreateBikeBody = {
  user_id?: string;
  make?: string;
  model?: string;
  year?: number;
  odo?: number;
};
