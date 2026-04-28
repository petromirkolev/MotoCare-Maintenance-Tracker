import { Router } from 'express';
import { messages } from '../constants/messages';
import { AuthBody } from '../types/index';
import {
  sendAuthError,
  sendLoginSuccess,
  sendRegisterSuccess,
  getValidatedAuthBody,
  normalizeEmail,
  isValidEmail,
} from '../utils/index';
import {
  createUser,
  findUserByEmail,
  verifyUserPassword,
} from '../services/index';

export const authRouter = Router();

authRouter.post('/register', async (req, res) => {
  const validatedBody = getValidatedAuthBody((req.body ?? {}) as AuthBody);

  if (!validatedBody) {
    sendAuthError(res, 400, messages.AUTH_FIELDS_REQ);
    return;
  }

  const email = normalizeEmail(validatedBody.email);
  const password = validatedBody.password;

  if (!isValidEmail(email)) {
    sendAuthError(res, 400, messages.AUTH_EMAIL_INVALID);
    return;
  }

  if (password.length < 8) {
    sendAuthError(res, 400, messages.AUTH_PASS_SHORT);
    return;
  }

  if (password.length > 32) {
    sendAuthError(res, 400, messages.AUTH_PASS_LONG);
    return;
  }

  try {
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      sendAuthError(res, 409, messages.AUTH_USER_EXISTS);
      return;
    }

    await createUser(email, password);
    sendRegisterSuccess(res, messages.AUTH_REG_OK);
  } catch (error) {
    console.error(messages.AUTH_REG_FAIL, error);
    sendAuthError(res, 500, messages.SYS_ERR_INTERNAL);
  }
});

authRouter.post('/login', async (req, res) => {
  const validatedBody = getValidatedAuthBody((req.body ?? {}) as AuthBody);

  if (!validatedBody) {
    sendAuthError(res, 400, messages.AUTH_FIELDS_REQ);
    return;
  }

  const email = normalizeEmail(validatedBody.email);
  const password = validatedBody.password;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      sendAuthError(res, 401, messages.AUTH_CRED_INVALID);
      return;
    }

    const isPasswordValid = await verifyUserPassword(
      password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      sendAuthError(res, 401, messages.AUTH_CRED_INVALID);
      return;
    }

    sendLoginSuccess(res, messages.AUTH_LOGIN_OK, {
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    console.error(messages.AUTH_LOGIN_FAIL, error);
    sendAuthError(res, 500, messages.SYS_ERR_INTERNAL);
  }
});
