import { Router } from 'express';
import { createBike, listBikesByUserId } from '../services/bikes-service';
import { CreateBikeBody } from '../types/bike';

const bikesRouter = Router();

bikesRouter.get('/', async (req, res) => {
  const userId = String(req.query.userId ?? '').trim();

  if (!userId) {
    res.status(400).json({ error: 'userId query param is required' });
    return;
  }

  try {
    const bikes = await listBikesByUserId(userId);
    res.json({ bikes });
  } catch (error) {
    console.error('List bikes failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

bikesRouter.post('/', async (req, res) => {
  const body = (req.body ?? {}) as CreateBikeBody;
  const { userId, make, model, year, odo } = body;

  if (!userId || !make || !model || year === undefined || odo === undefined) {
    res
      .status(400)
      .json({ error: 'userId, make, model, year, and odo are required' });
    return;
  }

  try {
    await createBike({
      userId,
      make: make.trim(),
      model: model.trim(),
      year: Number(year),
      odo: Number(odo),
    });

    res.status(201).json({ message: 'Bike created successfully' });
  } catch (error) {
    console.error('Create bike failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default bikesRouter;
