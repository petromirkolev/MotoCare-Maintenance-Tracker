import { test, expect } from '../fixtures/api-fixtures';
import { api } from '../utils/api-helpers';
import { messages } from '../../constants/messages';
import { expectApiError, expectApiSuccess } from '../utils/helpers';

test.describe('MMT API - Maintenance', () => {
  test('Maintenance log with valid date/odo returns 201', async ({
    request,
    userWithOneBike,
    maintenanceLogInput,
  }) => {
    const logResponse = await api.logMaintenance(
      request,
      userWithOneBike.bike_id,
      maintenanceLogInput,
    );

    expectApiSuccess(logResponse, 201, 'message', messages.MAINT_CREATE_OK);

    const jobResponse = await api.getMaintenance(
      request,
      userWithOneBike.bike_id,
    );
    expect(jobResponse.status()).toBe(200);

    const jobBody = await jobResponse.json();
    const maintenance = jobBody.maintenance.find(
      (item: any) => item.name === 'oil-change',
    );

    expect(jobBody.maintenance).toHaveLength(1);
    expect(maintenance.bike_id).toBe(userWithOneBike.bike_id);
    expect(maintenance.name).toBe(maintenanceLogInput.name);
    expect(maintenance.date).toBe(maintenanceLogInput.date);
    expect(maintenance.odo).toBe(maintenanceLogInput.odo);
  });

  test('Maintenance log with negative odo returns 400', async ({
    request,
    userWithOneBike,
    maintenanceLogInput,
  }) => {
    const logResponse = await api.logMaintenance(
      request,
      userWithOneBike.bike_id,
      {
        ...maintenanceLogInput,
        odo: -500,
      },
    );

    expectApiError(logResponse, 400, 'error', messages.BIKE_ODO_POS);
  });

  test('Maintenance log for bike A does not affect bike B', async ({
    request,
    userWithOneBike,
    validBikeInput,
    maintenanceLogInput,
  }) => {
    const bike_2_response = await api.createBike(
      request,
      userWithOneBike.user_id,
      { ...validBikeInput, make: 'Suzuki' },
    );
    const bike_2_body = await bike_2_response.json();
    const bike_2_id = bike_2_body.bike.id;
    const logResponse = await api.logMaintenance(
      request,
      userWithOneBike.bike_id,
      maintenanceLogInput,
    );

    expectApiSuccess(logResponse, 201, 'message', messages.MAINT_CREATE_OK);

    const bike_1_maintenance = await api.getMaintenance(
      request,
      userWithOneBike.bike_id,
    );
    expect(bike_1_maintenance.status()).toBe(200);

    const bike_1_maintenance_body = await bike_1_maintenance.json();
    const bike_1_maintenance_records = bike_1_maintenance_body.maintenance.find(
      (item: any) => item.name === 'oil-change',
    );

    expect(bike_1_maintenance_body.maintenance).toHaveLength(1);
    expect(bike_1_maintenance_records.bike_id).toBe(userWithOneBike.bike_id);
    expect(bike_1_maintenance_records.name).toBe(maintenanceLogInput.name);

    const bike_2_maintenance = await api.getMaintenance(request, bike_2_id);
    expect(bike_2_maintenance.status()).toBe(200);

    const bike_2_maintenance_body = await bike_2_maintenance.json();
    expect(bike_2_maintenance_body.maintenance).toHaveLength(0);
  });

  test('Logging one maintenance item does not affect another item', async ({
    request,
    userWithOneBike,
    maintenanceLogInput,
  }) => {
    const oilResponse = await api.logMaintenance(
      request,
      userWithOneBike.bike_id,
      { ...maintenanceLogInput },
    );

    expectApiSuccess(oilResponse, 201, 'message', messages.MAINT_CREATE_OK);

    const coolantResponse = await api.logMaintenance(
      request,
      userWithOneBike.bike_id,
      { ...maintenanceLogInput, name: 'coolant-change' },
    );

    expectApiSuccess(coolantResponse, 201, 'message', messages.MAINT_CREATE_OK);

    const maintenanceResponse = await api.getMaintenance(
      request,
      userWithOneBike.bike_id,
    );
    expect(maintenanceResponse.status()).toBe(200);

    const maintenanceBody = await maintenanceResponse.json();
    const coolantMaintenance = maintenanceBody.maintenance.find(
      (item: any) => item.name === 'coolant-change',
    );
    const oilMaintenance = maintenanceBody.maintenance.find(
      (item: any) => item.name === 'oil-change',
    );

    expect(maintenanceBody.maintenance).toHaveLength(2);

    expect(oilMaintenance.bike_id).toBe(userWithOneBike.bike_id);
    expect(oilMaintenance.name).toBe(maintenanceLogInput.name);
    expect(oilMaintenance.date).toBe(maintenanceLogInput.date);
    expect(oilMaintenance.odo).toBe(maintenanceLogInput.odo);

    expect(coolantMaintenance.bike_id).toBe(userWithOneBike.bike_id);
    expect(coolantMaintenance.name).toBe('coolant-change');
    expect(coolantMaintenance.date).toBe(maintenanceLogInput.date);
    expect(coolantMaintenance.odo).toBe(maintenanceLogInput.odo);
  });

  test('Maintenance schedule with valid days/km returns 201', async ({
    request,
    userWithOneBike,
    maintenanceScheduleInput,
  }) => {
    const logResponse = await api.scheduleMaintenance(
      request,
      userWithOneBike.bike_id,
      { ...maintenanceScheduleInput },
    );

    expectApiSuccess(logResponse, 201, 'message', messages.MAINT_SCHED_OK);

    const getResponse = await api.getMaintenance(
      request,
      userWithOneBike.bike_id,
    );
    expect(getResponse.status()).toBe(200);

    const getBody = await getResponse.json();

    expect(getBody.maintenance).toHaveLength(1);
    expect(getBody.maintenance[0].bike_id).toBe(userWithOneBike.bike_id);
    expect(getBody.maintenance[0].name).toBe(maintenanceScheduleInput.name);
    expect(getBody.maintenance[0].interval_km).toBe(
      maintenanceScheduleInput.interval_km,
    );
    expect(getBody.maintenance[0].interval_days).toBe(
      maintenanceScheduleInput.interval_days,
    );
  });

  test('Maintenance schedule with missing days returns 400', async ({
    request,
    userWithOneBike,
    maintenanceScheduleInput,
  }) => {
    const logResponse = await api.scheduleMaintenance(
      request,
      userWithOneBike.bike_id,
      { ...maintenanceScheduleInput, interval_days: undefined },
    );

    expectApiError(logResponse, 400, 'error', messages.MAINT_DAYS_REQ);
  });

  test('Maintenance schedule with missing kilometers returns 400', async ({
    request,
    userWithOneBike,
    maintenanceScheduleInput,
  }) => {
    const logResponse = await api.scheduleMaintenance(
      request,
      userWithOneBike.bike_id,
      {
        ...maintenanceScheduleInput,
        interval_km: undefined,
      },
    );

    expectApiError(logResponse, 400, 'error', messages.MAINT_KM_REQ);
  });

  test('Maintenance schedule for bike A does not affect bike B', async ({
    request,
    userWithOneBike,
    maintenanceScheduleInput,
    validBikeInput,
  }) => {
    const bike_2 = await api.createBike(request, userWithOneBike.user_id, {
      ...validBikeInput,
      make: 'Suzuki',
    });
    const bike_2_body = await bike_2.json();
    const bike_2_id = bike_2_body.bike.id;

    const schedule_oil_service_bike_1 = await api.scheduleMaintenance(
      request,
      userWithOneBike.bike_id,
      { ...maintenanceScheduleInput },
    );

    expectApiSuccess(
      schedule_oil_service_bike_1,
      201,
      'message',
      messages.MAINT_SCHED_OK,
    );

    const bike_1_maintenance = await api.getMaintenance(
      request,
      userWithOneBike.bike_id,
    );
    expect(bike_1_maintenance.status()).toBe(200);

    const bike_1_records = await bike_1_maintenance.json();
    expect(bike_1_records.maintenance).toHaveLength(1);

    expect(bike_1_records.maintenance[0].name).toBe(
      maintenanceScheduleInput.name,
    );

    const schedule_coolant_service_bike_2 = await api.scheduleMaintenance(
      request,
      bike_2_id,
      { ...maintenanceScheduleInput, name: 'coolant-change' },
    );

    expectApiSuccess(
      schedule_coolant_service_bike_2,
      201,
      'message',
      messages.MAINT_SCHED_OK,
    );

    const bike_2_maintenance = await api.getMaintenance(request, bike_2_id);
    expect(bike_2_maintenance.status()).toBe(200);

    const bike_2_records = await bike_2_maintenance.json();
    expect(bike_2_records.maintenance).toHaveLength(1);
    expect(bike_2_records.maintenance[0].name).toBe('coolant-change');
  });
});
