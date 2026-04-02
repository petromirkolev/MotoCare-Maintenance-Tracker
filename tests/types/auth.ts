export type ValidUserInput = {
  email?: string;
  password?: string;
};

export type InvalidUserInput = {
  email?: string;
  password?: string;
  shortPassword?: string;
  longPassword?: string;
};

export type LoginResponse = {
  message: string;
  user: {
    id: string;
  };
};
