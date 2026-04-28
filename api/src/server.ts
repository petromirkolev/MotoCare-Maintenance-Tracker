import 'dotenv/config';
import app from './app';
import { initDb } from './init-db';
import { messages } from './constants/messages';

const PORT = Number(process.env.PORT) || 3001;

async function startServer() {
  try {
    await initDb();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(messages.SYS_START_FAIL, error);
    process.exit(1);
  }
}

startServer();
