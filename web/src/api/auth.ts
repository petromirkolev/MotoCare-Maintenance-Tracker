export type AuthSuccessUser = {
  id: string;
  email: string;
};

export type LoginResponse = {
  message: string;
  user: AuthSuccessUser;
};

export type RegisterResponse = {
  message: string;
};

export type ErrorResponse = {
  error: string;
};

const API_BASE_URL = 'http://localhost:3001';

export async function registerUser(
  email: string,
  password: string,
): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = (await response.json()) as RegisterResponse | ErrorResponse;

  if (!response.ok) {
    throw new Error('error' in data ? data.error : 'Register failed');
  }

  return data as RegisterResponse;
}
