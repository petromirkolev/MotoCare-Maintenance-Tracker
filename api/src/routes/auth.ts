import {
  createUser,
  findUserByEmail,
  verifyUserPassword,
} from '../services/auth-service';
import { Router } from 'express';
import { AuthBody } from '../types/auth-body';
import { getValidatedAuthBody } from '../utils/auth-validation';

const INVALID_CREDENTIALS_ERROR = 'Invalid credentials';

type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
};

const authRouter = Router();

/* Register endpoint */
authRouter.post('/register', async (req, res) => {
  const validatedBody = getValidatedAuthBody((req.body ?? {}) as AuthBody);

  if (!validatedBody) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const { email, password } = validatedBody;

  try {
    const existingUser = await getOne<UserRow>(
      'SELECT * FROM users WHERE email = ?',
      [email],
    );

    if (existingUser) {
      res.status(409).json({ error: 'User already exists' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await runQuery(
      `
        INSERT INTO users (id, email, password_hash, created_at)
        VALUES (?, ?, ?, ?)
      `,
      [uuidv4(), email, passwordHash, new Date().toISOString()],
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Register failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* Login endpoint */
authRouter.post('/login', async (req, res) => {
  const validatedBody = getValidatedAuthBody((req.body ?? {}) as AuthBody);

  if (!validatedBody) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const { email, password } = validatedBody;

  try {
    const user = await getOne<UserRow>('SELECT * FROM users WHERE email = ?', [
      email,
    ]);

    if (!user) {
      res.status(401).json({ error: INVALID_CREDENTIALS_ERROR });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      res.status(401).json({ error: INVALID_CREDENTIALS_ERROR });
      return;
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default authRouter;
