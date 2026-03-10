import express from 'express';
import healthRouter from './routes/health';
import authRouter from './routes/auth';

const app = express();

app.use(express.json());
app.get('/', (_req, res) => {
  res.json({ message: 'Moto Care API is running' });
});
app.use('/health', healthRouter);
app.use('/auth', authRouter);

export default app;
