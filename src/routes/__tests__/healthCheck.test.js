import axios from 'axios';
import { logger } from 'garage-utils';
import startServer from '../../server';

logger.configure({ type: 'spec' });
jest.unmock('axios');

let baseURL, api, server;

beforeAll(async () => {
  server = await startServer({ port: 8889 });
  baseURL = `http://localhost:${server.address().port}`;
  api = axios.create({ baseURL });
});

afterAll(() => server.close());

test('API returns health check status OK', async () => {
  const res = await api.get('/');
  expect(res.status).toBe(200);
  expect(res.data).toEqual({ status: 'OK' });
});
