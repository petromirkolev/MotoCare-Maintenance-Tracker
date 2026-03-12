import { Router } from 'express';
import { UpsertMaintenanceBody } from '../types/maintenance';
import {
  createMaintenance,
  findMaintenanceByBikeAndName,
  listMaintenanceByBikeId,
  updateMaintenance,
} from '../services/maintenance-service';

const maintenanceRouter = Router();

maintenanceRouter.get('/', async (req, res) => {
  const bikeId = String(req.query.bikeId ?? '').trim();

  if (!bikeId) {
    res.status(400).json({ error: 'bikeId query param is required' });
    return;
  }

  try {
    const maintenance = await listMaintenanceByBikeId(bikeId);
    res.json({ maintenance });
  } catch (error) {
    console.error('List maintenance failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

maintenanceRouter.post('/upsert', async (req, res) => {
  const body = (req.body ?? {}) as UpsertMaintenanceBody;
  const { bike_id, name, date, odo, interval_km, interval_days } = body;

  if (!bike_id || !name) {
    res.status(400).json({ error: 'bike id and name are required' });
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

      res.status(201).json({ message: 'Maintenance created successfully' });
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

    res.json({ message: 'Maintenance updated successfully' });
  } catch (error) {
    console.error('Upsert maintenance failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default maintenanceRouter;
