import 'jest';
import { mockRequestResponse } from '../../testUtil';
import { HealthController } from '../HealthController';
const controller = new HealthController();

describe('HealthController', () => {
  test('Canary test', () => {
    expect(true).toBe(true);
  });

  test('Calls show health', async () => {
    const { req, res, next } = mockRequestResponse();
    req.params = { id: 'null' };
    await controller.showHealth(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ update: 'I am alive' });
  });
});
