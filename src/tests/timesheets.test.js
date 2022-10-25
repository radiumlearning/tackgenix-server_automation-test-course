import request from 'supertest';
import app from '../app';
import Timesheets from '../models/Timesheets';
import timesheetsSeeds from '../seeds/timesheets';

beforeAll(async () => {
  await Timesheets.collection.insertMany(timesheetsSeeds);
});

// eslint-disable-next-line no-underscore-dangle
const timesheetId = timesheetsSeeds[0]._id;
const wrongMockedTimesheet = {
  description: 'auctors',
  date: '14/09/2021',
  task: '6354059cd8bf9864098d13c9',
  hours: '23',
  employee: '63540397a5be57cf8ebf17d6',
  project: '635408ff26249caf8f9a98b3',
};
const mockedTimesheet = {
  description: 'auctors sed triseque in tempus sit amex sem fusco',
  date: '12/26/2020',
  task: '6354059cd8bf9864098d13c9',
  hours: 10,
  employee: '63540397a5be57cf8ebf17d6',
  project: '635408ff26249caf8f9a98b3',
};

describe('GET /timesheets', () => {
  test('should return all the timesheets', async () => {
    const response = await request(app).get('/timesheets').send();

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Timesheets found successfully');
    expect(response.body.error).toBeFalsy();
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  test('Should return status code 404 with admins not found', async () => {
    await Timesheets.deleteMany();
    const response = await request(app).get('/timesheets').send();

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('Timesheets not found');
    expect(response.body.data).toBeUndefined();
    expect(response.body.error).toBeTruthy();
    
    await Timesheets.collection.insertMany(timesheetsSeeds);
  });
});

describe('GET byId /timesheets/:id', () => {
  test('should return the timesheet', async () => {
    const response = await request(app).get(`/timesheets/${timesheetId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(`Timesheet with id ${timesheetId.toString()} found successfully`);
    expect(response.body.error).toBeFalsy();
    expect(response.body.data).toBeDefined();
    // eslint-disable-next-line no-underscore-dangle
    expect(response.body.data._id).toEqual(`${timesheetId}`);
  });
  test('should return error with invalid id', async () => {
    const invalidId = 'homero';
    const response = await request(app).get(`/timesheets/${invalidId}`).send();

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(`Cannot get timesheet by id of ${invalidId}`);
    expect(response.body.error).toBeTruthy();
    expect(response.body.data).toBeUndefined();
  });
  test('should return not found error with wrong id', async () => {
    const wrongId = '6355cf418ff38506cc6afc19';
    const response = await request(app).get(`/timesheets/${wrongId}`).send();

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(`Timesheet with id ${wrongId} not found`);
    expect(response.body.error).toBeTruthy();
    expect(response.body.data).toBeUndefined();
  });
});

describe('POST /timesheet', () => {
  test('should create timesheets without error', async () => {
    const response = await request(app).post('/timesheets').send(mockedTimesheet);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Timesheet created successfully.');
    expect(response.body.error).toBeFalsy();
  });
  test('Wrong data should not be sent', async () => {
    const response = await request(app).post('/timesheets').send(wrongMockedTimesheet);

    expect(response.status).toBe(400);
    expect(response.body.error).toBeTruthy();
    expect(response.body.data).toBeUndefined();
    expect(response.body.message).toBe('Cannot create timesheet: "description" length must be at least 20 characters long');
  });
  test('Empty data should not be sent', async () => {
    const response = await request(app).post('/timesheets').send();

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
    expect(response.body.error).toBeTruthy();
    expect(response.body.data).toBeUndefined();
  });
});
