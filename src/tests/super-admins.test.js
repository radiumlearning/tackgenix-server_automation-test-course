/* eslint-disable no-underscore-dangle */
import request from 'supertest';
import app from '../app';
import SuperAdmins from '../models/Super-admins';
import SuperAdminsSeed from '../seeds/super-admins';

beforeAll(async () => {
  await SuperAdmins.collection.insertMany(SuperAdminsSeed);
});

const badReqId = '63540469873594f152b2ad3csda';
const notFoundId = '63540469873594f152b2ad3b';
let reqId = '';

const mockedSuperAdmin = {
  name: 'Pedro',
  lastName: 'Blueman',
  email: 'kredholls001@mediafire.com',
  password: 'DSFDSF4sd',
  dni: 301129082,
  phone: 5493415558701,
};

const mockedSuperAdminWidExistingEmail = {
  name: 'Kelbee',
  lastName: 'Redholls',
  email: 'kredholls001@mediafire.com',
  password: 'GJk0kylyhY',
  dni: 301239185,
  phone: 5493415558701,
};

const mockedSuperAdminWidExistingDni = {
  name: 'Kelbee',
  lastName: 'Redholls',
  email: 'kredhollass50@mediafir.com',
  password: 'GJk0kylyhY',
  dni: 301129082,
  phone: 549341533701,
};

const mockedSuperAdminWrong = {
  name: 'Ale',
  lastName: 'algo',
  email: 'telegraph.com',
  password: 'nXGTc1i6VEH',
  dni: 39109775,
  phone: 549116002873,
};

describe('GET /Superadmins', () => {
  test('Should return status code 200', async () => {
    const response = await request(app).get('/super-admins').send();
    reqId = response.body.data[0]._id;
    expect(response.status).toBe(200);
  });

  test('Should return error false', async () => {
    const response = await request(app).get('/super-admins').send();

    expect(response.body.error).toBeFalsy();
  });

  test('Should return more than one superAdmin', async () => {
    const response = await request(app).get('/super-admins').send();

    expect(response.body.data.length).toBeGreaterThan(0);
  });
});

describe('GET /superadmins empty data', () => {
  test('Should return status code 404 if superadmin is not found', async () => {
    await SuperAdmins.deleteMany();
    const response = await request(app).get('/super-admins').send();

    expect(response.status).toBe(404);
    expect(response.data).toBeUndefined();
    expect(response.error).toBeTruthy();
  });

  afterAll(async () => {
    await SuperAdmins.collection.insertMany(SuperAdminsSeed);
  });
});

describe('POST /superadmins', () => {
  test('Should create a superadmin', async () => {
    const response = await request(app).post('/super-admins').send(mockedSuperAdmin);

    expect(response.status).toBe(201);
    expect(response.body.error).toBeFalsy();
  });

  test('Should not create a superadmin', async () => {
    const response = await request(app).post('/super-admins').send();

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('There was an error: "name" is required');
    expect(response.body.error).toBeTruthy();
  });

  test('Should return error using wrong data', async () => {
    const response = await request(app).post('/super-admins').send(mockedSuperAdminWrong);

    expect(response.status).toBe(400);
    expect(response.body.data).toBeUndefined();
    expect(response.body.message).toBe('There was an error: "email" must be a valid email');
    expect(response.body.error).toBeTruthy();
  });

  test('should return error with empty data', async () => {
    const response = await request(app).post('/super-admins').send();

    expect(response.status).toBe(400);
    expect(response.body.data).toBeUndefined();
    expect(response.body.message).toBe('There was an error: "name" is required');
    expect(response.body.error).toBeTruthy();
  });

  test('Should return status 400 when send an Super Admin with existing email', async () => {
    const response = await request(app).post('/super-admins').send(mockedSuperAdminWidExistingEmail);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('There is already a super admin with that email');
    expect(response.body.data).toBeUndefined();
    expect(response.body.error).toBeTruthy();
  });

  test('Should return status 400 when send an Super Admin with existing DNI', async () => {
    const response = await request(app).post('/super-admins').send(mockedSuperAdminWidExistingDni);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('There is already a super admin with that DNI');
    expect(response.body.data).toBeUndefined();
    expect(response.body.error).toBeTruthy();
  });
});

describe('GETbyID /superadmins', () => {
  test('Should return status code 200', async () => {
    const response = await request(app).get(`/super-admins/${reqId}`).send();

    expect(response.status).toBe(200);
  });

  test('Should return error false', async () => {
    const response = await request(app).get(`/super-admins/${reqId}`).send();

    expect(response.body.error).toBeFalsy();
  });

  test('Should return one superadmin', async () => {
    const response = await request(app).get(`/super-admins/${reqId}`).send();

    expect(response.body.data._id).toContain(reqId);
  });

  test('Should return status code 404', async () => {
    const response = await request(app).get(`/super-admins/${notFoundId}`).send();

    expect(response.status).toBe(404);
  });

  test('Should return error true', async () => {
    const response = await request(app).get(`/super-admins/${notFoundId}`).send();

    expect(response.status).toBeTruthy();
  });

  test('Should return data undefined', async () => {
    const response = await request(app).get(`/super-admins/${notFoundId}`).send();

    expect(response.body.data).toBe(undefined);
  });

  test('Should return data undefined', async () => {
    const response = await request(app).get(`/super-admins/${notFoundId}`).send();

    expect(response.body.message).toBe('SuperAdmin with id 63540469873594f152b2ad3b not found');
  });
});

describe('PUT /super-admins', () => {
  test('should return status 200', async () => {
    const response = await request(app).put(`/super-admins/${reqId}`).send(mockedSuperAdmin);
    expect(response.status).toBe(200);
  });

  test('should return error fasle', async () => {
    const response = await request(app).put(`/super-admins/${reqId}`).send(mockedSuperAdmin);
    expect(response.body.error).toBeFalsy();
  });

  test('check for success message', async () => {
    const response = await request(app).put(`/super-admins/${reqId}`).send(mockedSuperAdmin);
    expect(response.body.message).toEqual(`Super Admin with id ${reqId} updated successfully`);
  });

  test('should return status 400', async () => {
    const response = await request(app).put(`/super-admins/${badReqId}`).send(mockedSuperAdmin);
    expect(response.status).toBe(400);
  });

  test('should return error true', async () => {
    const response = await request(app).put(`/super-admins/${badReqId}`).send(mockedSuperAdmin);
    expect(response.body.error).toBeTruthy();
  });

  test('should return data undefined', async () => {
    const response = await request(app).put(`/super-admins/${badReqId}`).send(mockedSuperAdmin);
    expect(response.body.data).toBe(undefined);
  });

  test('check for bad id not found message', async () => {
    const response = await request(app).put(`/super-admins/${badReqId}`).send(mockedSuperAdmin);
    expect(response.body.message).toEqual(`Super Admin with id ${badReqId} not found`);
  });

  test('should return status 404', async () => {
    const response = await request(app).put(`/super-admins/${notFoundId}`).send(mockedSuperAdmin);
    expect(response.status).toBe(404);
  });

  test('should return error true', async () => {
    const response = await request(app).put(`/super-admins/${notFoundId}`).send(mockedSuperAdmin);
    expect(response.body.error).toBeTruthy();
  });

  test('should return data undefined', async () => {
    const response = await request(app).put(`/super-admins/${notFoundId}`).send(mockedSuperAdmin);
    expect(response.body.data).toBe(undefined);
  });

  test('check for not found message', async () => {
    const response = await request(app).put(`/super-admins/${notFoundId}`).send(mockedSuperAdmin);
    expect(response.body.message).toEqual(`Super Admin with id ${notFoundId} not found`);
  });

  test('should return status 400', async () => {
    const response = await request(app).put(`/super-admins/${reqId}`).send(mockedSuperAdminWrong);
    expect(response.status).toBe(400);
  });

  test('should return error true', async () => {
    const response = await request(app).put(`/super-admins/${reqId}`).send(mockedSuperAdminWrong);
    expect(response.body.error).toBeTruthy();
  });

  test('should return data undefined', async () => {
    const response = await request(app).put(`/super-admins/${reqId}`).send(mockedSuperAdminWrong);
    expect(response.body.data).toBe(undefined);
  });

  test('check for error message', async () => {
    const response = await request(app).put(`/super-admins/${reqId}`).send(mockedSuperAdminWrong);
    expect(response.body.message).toBeDefined();
  });
});

describe('DELETE /super-admins', () => {
  test('should return status 204', async () => {
    const response = await request(app).delete(`/super-admins/${reqId}`).send();
    expect(response.status).toBe(204);
  });

  test('should return status 404', async () => {
    const response = await request(app).delete(`/super-admins/${notFoundId}`).send();
    expect(response.status).toBe(404);
  });

  test('should return error true', async () => {
    const response = await request(app).delete(`/super-admins/${notFoundId}`).send();
    expect(response.body.error).toBeTruthy();
  });

  test('should return data undefined', async () => {
    const response = await request(app).delete(`/super-admins/${notFoundId}`).send();
    expect(response.body.data).toBe(undefined);
  });

  test('check for not found message', async () => {
    const response = await request(app).delete(`/super-admins/${notFoundId}`).send();
    expect(response.body.message).toEqual(`SuperAdmins with id ${notFoundId} not found`);
  });

  test('should return status 400', async () => {
    const response = await request(app).delete(`/super-admins/${badReqId}`).send();
    expect(response.status).toBe(400);
  });

  test('should return error true', async () => {
    const response = await request(app).delete(`/super-admins/${badReqId}`).send();
    expect(response.body.error).toBeTruthy();
  });

  test('should return data undefined', async () => {
    const response = await request(app).delete(`/super-admins/${badReqId}`).send();
    expect(response.body.data).toBe(undefined);
  });

  test('check for error message', async () => {
    const response = await request(app).delete(`/super-admins/${badReqId}`).send();
    expect(response.body.message).toBeDefined();
  });
});
