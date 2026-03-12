import { Router } from 'express';
import { CreateBikeBody } from '../types/bike';
import {
  createBike,
  deleteBike,
  findBikeById,
  listBikesByUserId,
  updateBike,
} from '../services/bikes-service';

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
      .json({ error: 'user id, make, model, year, and odo are required' });
    return;
  }

  if (year !== undefined && (year < 1900 || year > 2100))
    throw new Error('Invalid year');

  if (odo < 0) throw new Error('Invalid odo');

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

bikesRouter.put('/:id', async (req, res) => {
  const bikeId = req.params.id;
  const body = (req.body ?? {}) as CreateBikeBody;
  const { userId, make, model, year, odo } = body;

  if (
    !bikeId ||
    !userId ||
    !make ||
    !model ||
    year === undefined ||
    odo === undefined
  ) {
    res
      .status(400)
      .json({ error: 'id, user id, make, model, year, and odo are required' });
    return;
  }

  if (year !== undefined && (year < 1900 || year > 2100)) {
    throw new Error('Invalid year');
  }

  const existingBike = await findBikeById(bikeId);
  if (!existingBike) throw new Error('No bike found');

  if (odo !== undefined && odo < existingBike.odo) {
    throw new Error('Odometer cannot decrease');
  }

  try {
    await updateBike({
      id: bikeId,
      userId,
      make: make.trim(),
      model: model.trim(),
      year: Number(year),
      odo: Number(odo),
    });

    res.json({ message: 'Bike updated successfully' });
  } catch (error) {
    console.error('Update bike failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

bikesRouter.delete('/:id', async (req, res) => {
  const bikeId = req.params.id;
  const userId = String(req.query.userId ?? '').trim();

  if (!bikeId || !userId) {
    res.status(400).json({ error: 'id and user id are required' });
    return;
  }

  try {
    await deleteBike({
      id: bikeId,
      userId,
    });

    res.json({ message: 'Bike deleted successfully' });
  } catch (error) {
    console.error('Delete bike failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default bikesRouter;
