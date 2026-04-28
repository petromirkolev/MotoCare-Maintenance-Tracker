import { Router } from 'express';
import { messages } from '../constants/messages';
import { CreateBikeBody } from '../types/index';
import {
  isIntegerInRange,
  isNonNegativeInteger,
  normalizeString,
} from '../utils/index';
import {
  createBike,
  deleteBike,
  findBikeById,
  listBikesByUserId,
  updateBike,
} from '../services/index';

export const bikesRouter = Router();

bikesRouter.get('/', async (req, res) => {
  const user_id = String(req.query.user_id ?? '').trim();

  if (!user_id) {
    res.status(400).json({ error: messages.PARAM_USER_ID });
    return;
  }

  try {
    const bikes = await listBikesByUserId(user_id);
    res.json({ bikes });
  } catch (error) {
    console.error(messages.BIKE_LIST_FAIL, error);
    res.status(500).json({ error: messages.SYS_ERR_INTERNAL });
  }
});

bikesRouter.post('/', async (req, res) => {
  const body = (req.body ?? {}) as CreateBikeBody;

  const user_id = normalizeString(body.user_id);
  const make = normalizeString(body.make);
  const model = normalizeString(body.model);
  const year = body.year;
  const odo = body.odo;

  const user_bikes = await listBikesByUserId(user_id);

  const bikeAlreadyExists = user_bikes.some((bike) => {
    return (
      bike.make === make &&
      bike.model === model &&
      bike.year === year &&
      bike.odo === odo
    );
  });

  if (bikeAlreadyExists) {
    res.status(400).json({ error: messages.BIKE_EXISTS });
    return;
  }

  if (!user_id || !make || !model || year === undefined || odo === undefined) {
    res.status(400).json({ error: messages.PARAM_ADD_BIKE });
    return;
  }

  if (!isIntegerInRange(year, 1900, 2100)) {
    res.status(400).json({ error: messages.BIKE_YEAR_RANGE });
    return;
  }

  if (!isNonNegativeInteger(odo)) {
    res.status(400).json({ error: messages.PARAM_ODO_NON_NEG });
    return;
  }

  try {
    const id = await createBike({
      user_id,
      make,
      model,
      year,
      odo,
    });

    res.status(201).json({ message: messages.BIKE_CREATE_OK, bike: { id } });
  } catch (error) {
    console.error(messages.BIKE_CREATE_FAIL, error);
    res.status(500).json({ error: messages.SYS_ERR_INTERNAL });
  }
});

bikesRouter.put('/:id', async (req, res) => {
  const bike_id = req.params.id;
  const body = (req.body ?? {}) as CreateBikeBody;
  const user_id = normalizeString(body.user_id);
  const make = normalizeString(body.make);
  const model = normalizeString(body.model);
  const year = body.year;
  const odo = body.odo;

  if (
    !bike_id ||
    !user_id ||
    !make ||
    !model ||
    year === undefined ||
    odo === undefined
  ) {
    res.status(400).json({ error: messages.PARAM_UPDATE_BIKE });
    return;
  }

  if (year !== undefined && (year < 1900 || year > 2100)) {
    {
      res.status(400).json({ error: messages.BIKE_YEAR_INVALID });
      return;
    }
  }

  const existingBike = await findBikeById(bike_id);

  if (!existingBike) {
    res.status(404).json({ error: messages.BIKE_NOT_FOUND });
    return;
  }

  if (odo < existingBike.odo) {
    res.status(400).json({ error: messages.BIKE_ODO_DECR });
    return;
  }

  try {
    await updateBike({
      id: bike_id,
      user_id,
      make: make.trim(),
      model: model.trim(),
      year: Number(year),
      odo: Number(odo),
    });

    res.json({ message: messages.BIKE_UPDATE_OK });
  } catch (error) {
    console.error(messages.BIKE_UPDATE_FAIL, error);
    res.status(500).json({ error: messages.SYS_ERR_INTERNAL });
  }
});

bikesRouter.delete('/:id', async (req, res) => {
  const bike_id = req.params.id;
  const user_id = String(req.query.user_id ?? '').trim();

  if (!bike_id || !user_id) {
    res.status(400).json({ error: messages.PARAM_DELETE_BIKE });
    return;
  }

  try {
    await deleteBike({
      id: bike_id,
      user_id,
    });

    res.json({ message: messages.BIKE_DELETE_OK });
  } catch (error) {
    console.error(messages.BIKE_DELETE_FAIL, error);
    res.status(500).json({ error: messages.SYS_ERR_INTERNAL });
  }
});
