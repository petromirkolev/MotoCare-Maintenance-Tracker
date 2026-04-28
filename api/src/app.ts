import express from 'express';
import cors from 'cors';
import { messages } from './constants/messages';
import {
  authRouter,
  bikesRouter,
  maintenanceRouter,
  maintenanceLogsRouter,
} from './routes/index';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: messages.SYS_API_RUNNING });
});
app.use('/auth', authRouter);
app.use('/bikes', bikesRouter);
app.use('/maintenance', maintenanceRouter);
app.use('/maintenance-logs', maintenanceLogsRouter);

export default app;
