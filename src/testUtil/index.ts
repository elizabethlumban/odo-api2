/* istanbul ignore file */
import 'jest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

jest.setTimeout(60 * 1000);

(mongoose.Promise as any) = global.Promise;

let mongod: MongoMemoryServer | null = null;

export async function startTestMongo() {
  mongod = new MongoMemoryServer({ binary: { version: '3.6.0' } });
  const mongoUri = await mongod.getConnectionString();
  const mongooseOpts = {
    // options for mongoose 4.11.3 and above
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000
  };

  const resultPromise = new Promise((resolve, reject) => {
    mongoose.connect(mongoUri, mongooseOpts);

    // "open" or connected"
    mongoose.connection.once('open', () => resolve());
    mongoose.connection.on('error', e => {
      console.log(`failed ${e}`);
      reject(e);
    });
  });

  await resultPromise;
}

export async function stopTestMongo() {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
  mongod = null;
}

export function mockRequestResponse() {
  const req: any = {
    query: {},
    params: {},
    body: {},
    headers: {},
    user: {}
  };
  req.header = (h: string) => req.headers[h];

  function resetMock(this: any) {
    this.end.mockClear();
    this.json.mockClear();
    this.send.mockClear();
    this.status.mockClear();
  }

  const res: any = {
    end: jest.fn(),
    json: jest.fn(),
    send: jest.fn(),
    status: jest.fn(),
    reset: resetMock
  };

  res.end.mockImplementation(() => res);
  res.json.mockImplementation(() => res);
  res.send.mockImplementation(() => res);
  res.status.mockImplementation(() => res);

  const next = jest.fn();

  return { req, res, next };
}
