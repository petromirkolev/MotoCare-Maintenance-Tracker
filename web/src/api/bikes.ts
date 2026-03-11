import { getCurrentUser } from '../state/auth-state';

export type BikeDto = {
  id: string;
  user_id: string;
  make: string;
  model: string;
  year: number;
  odo: number;
  created_at: string;
};

export type ListBikesResponse = {
  bikes: BikeDto[];
};

export type CreateBikeResponse = {
  message: string;
};

export type ErrorResponse = {
  error: string;
};

const API_BASE_URL = 'http://localhost:3001';

export async function fetchBikes(): Promise<BikeDto[]> {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    throw new Error('No logged-in user');
  }

  const response = await fetch(
    `${API_BASE_URL}/bikes?userId=${encodeURIComponent(currentUser.id)}`,
  );

  const data = (await response.json()) as ListBikesResponse | ErrorResponse;

  if (!response.ok) {
    throw new Error('error' in data ? data.error : 'Failed to fetch bikes');
  }

  return (data as ListBikesResponse).bikes;
}

export async function createBikeApi(input: {
  make: string;
  model: string;
  year: number;
  odo: number;
}): Promise<CreateBikeResponse> {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    throw new Error('No logged-in user');
  }

  const response = await fetch(`${API_BASE_URL}/bikes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: currentUser.id,
      make: input.make,
      model: input.model,
      year: input.year,
      odo: input.odo,
    }),
  });

  const data = (await response.json()) as CreateBikeResponse | ErrorResponse;

  if (!response.ok) {
    throw new Error('error' in data ? data.error : 'Failed to create bike');
  }

  return data as CreateBikeResponse;
}
