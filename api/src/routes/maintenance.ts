import { Router } from 'express';
import { messages } from '../constants/messages';
import { UpsertMaintenanceBody } from '../types/index';
import {
  isNonNegativeInteger,
  isPositiveInteger,
  isValidIsoLikeDate,
  normalizeString,
} from '../utils/index';
import {
  createMaintenance,
  findMaintenanceByBikeAndName,
  listMaintenanceByBikeId,
  updateMaintenance,
} from '../services/index';

export const maintenanceRouter = Router();

maintenanceRouter.get('/', async (req, res) => {
  const bike_id = String(req.query.bike_id ?? '').trim();

  if (!bike_id) {
    res.status(400).json({ error: messages.PARAM_BIKE_ID });
    return;
  }

  try {
    const maintenance = await listMaintenanceByBikeId(bike_id);
    res.json({ maintenance });
  } catch (error) {
    console.error(messages.MAINT_LIST_FAIL, error);
    res.status(500).json({ error: messages.SYS_ERR_INTERNAL });
  }
});

maintenanceRouter.post('/log', async (req, res) => {
  const body = (req.body ?? {}) as UpsertMaintenanceBody;
  const bike_id = normalizeString(body.bike_id);
  const name = normalizeString(body.name);
  const { date, odo, interval_km, interval_days } = body;

  if (!bike_id || !name) {
    res.status(400).json({ error: messages.PARAM_BIKE_NAME });
    return;
  }

  if (date === undefined && odo === undefined) {
    res.status(400).json({
      error: messages.MAINT_LOG_FIELDS,
    });
    return;
  }

  if (date !== undefined && date !== null && !isValidIsoLikeDate(date)) {
    res.status(400).json({ error: messages.MAINT_DATE_INVALID });
    return;
  }

  if (odo !== undefined && odo !== null && !isNonNegativeInteger(odo)) {
    res.status(400).json({ error: messages.PARAM_ODO_NON_NEG });
    return;
  }

  try {
    const existing = await findMaintenanceByBikeAndName(bike_id, name);

    if (!existing) {
      await createMaintenance({
        bike_id,
        name: name.trim(),
        date: date ?? null,
        odo: odo ?? null,
        interval_km: interval_km ?? null,
        interval_days: interval_days ?? null,
      });

      res.status(201).json({ message: messages.MAINT_CREATE_OK });
      return;
    }

    await updateMaintenance({
      id: existing.id,
      bike_id,
      name: name.trim(),
      date: date ?? existing.date,
      odo: odo ?? existing.odo,
      interval_km: interval_km ?? existing.interval_km,
      interval_days: interval_days ?? existing.interval_days,
    });

    res.json({ message: messages.MAINT_UPDATE_OK });
  } catch (error) {
    console.error(messages.MAINT_UPDATE_FAIL, error);
    res.status(500).json({ error: messages.SYS_ERR_INTERNAL });
  }
});

maintenanceRouter.post('/schedule', async (req, res) => {
  const body = (req.body ?? {}) as UpsertMaintenanceBody;
  const bike_id = normalizeString(body.bike_id);
  const name = normalizeString(body.name);
  const { interval_km, interval_days } = body;

  if (!bike_id || !name) {
    res.status(400).json({ error: messages.PARAM_BIKE_NAME });
    return;
  }

  if (interval_km === undefined || interval_km === null) {
    res.status(400).json({ error: messages.PARAM_INT_KM });
    return;
  }

  if (interval_days === undefined || interval_days === null) {
    res.status(400).json({ error: messages.PARAM_INT_DAYS });
    return;
  }

  if (!isPositiveInteger(interval_km)) {
    res.status(400).json({ error: messages.PARAM_INT_KM_POS });
    return;
  }

  if (!isPositiveInteger(interval_days)) {
    res.status(400).json({ error: messages.PARAM_INT_DAYS_POS });
    return;
  }

  try {
    const existing = await findMaintenanceByBikeAndName(bike_id, name);

    if (!existing) {
      await createMaintenance({
        bike_id,
        name: name.trim(),
        date: null,
        odo: null,
        interval_km,
        interval_days,
      });

      res.status(201).json({ message: messages.MAINT_SCHED_OK });
      return;
    }

    await updateMaintenance({
      id: existing.id,
      bike_id,
      name: name.trim(),
      date: existing.date,
      odo: existing.odo,
      interval_km,
      interval_days,
    });

    res.json({ message: messages.MAINT_SCHED_OK });
  } catch (error) {
    console.error(messages.MAINT_UPDATE_FAIL, error);
    res.status(500).json({ error: messages.SYS_ERR_INTERNAL });
  }
});
