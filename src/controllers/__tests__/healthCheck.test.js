import { mockRequestResponse } from '../../../test/utils';
import reportHealth from '../healthCheck';

test('returns 200 and status OK', () => {
  const { req, res } = mockRequestResponse();

  reportHealth(req, res);
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status.mock.calls[0][0]).toBe(200);
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(res.json.mock.calls[0][0]).toEqual({ status: 'OK' });
  expect(res.end).toHaveBeenCalledTimes(1);
});
