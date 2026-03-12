import { Router } from 'express';
import {
  INTERNAL_SERVER_ERROR,
  INVALID_CREDENTIALS_ERROR,
  LOGIN_SUCCESS_MESSAGE,
  MISSING_AUTH_FIELDS_ERROR,
  REGISTER_SUCCESS_MESSAGE,
  USER_ALREADY_EXISTS_ERROR,
} from '../constants/auth';
import {
  createUser,
  findUserByEmail,
  verifyUserPassword,
} from '../services/auth-service';
import { AuthBody } from '../types/auth-body';
import { sendAuthError } from '../utils/auth-response';
import { sendLoginSuccess, sendRegisterSuccess } from '../utils/auth-success';
import { getValidatedAuthBody } from '../utils/auth-validation';

const authRouter = Router();

authRouter.post('/register', async (req, res) => {
  const validatedBody = getValidatedAuthBody((req.body ?? {}) as AuthBody);

  if (!validatedBody) {
    sendAuthError(res, 400, MISSING_AUTH_FIELDS_ERROR);
    return;
  }

  const { email, password } = validatedBody;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailCheck = emailRegex.test(email);

  if (!emailCheck) throw new Error('Invalid email format');

  if (password.length < 8)
    throw new Error('Password must be 8 characters at minimum');

  try {
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      sendAuthError(res, 409, USER_ALREADY_EXISTS_ERROR);
      return;
    }

    await createUser(email, password);
    sendRegisterSuccess(res, REGISTER_SUCCESS_MESSAGE);
  } catch (error) {
    console.error('Register failed:', error);
    sendAuthError(res, 500, INTERNAL_SERVER_ERROR);
  }
});

authRouter.post('/login', async (req, res) => {
  const validatedBody = getValidatedAuthBody((req.body ?? {}) as AuthBody);

  if (!validatedBody) {
    sendAuthError(res, 400, MISSING_AUTH_FIELDS_ERROR);
    return;
  }

  const { email, password } = validatedBody;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      sendAuthError(res, 401, INVALID_CREDENTIALS_ERROR);
      return;
    }

    const isPasswordValid = await verifyUserPassword(
      password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      sendAuthError(res, 401, INVALID_CREDENTIALS_ERROR);
      return;
    }

    sendLoginSuccess(res, LOGIN_SUCCESS_MESSAGE, {
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    console.error('Login failed:', error);
    sendAuthError(res, 500, INTERNAL_SERVER_ERROR);
  }
});

export default authRouter;
