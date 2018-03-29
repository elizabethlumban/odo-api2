import { mockRequestResponse } from '../../../test/utils';
import db from '../../utils/db';
import * as itemController from '../items';

test('getItems returns all items in the database', async () => {
  const { req, res } = mockRequestResponse();

  await itemController.getItems(req, res);

  expect(res.json).toHaveBeenCalledTimes(1);
  const firstCall = res.json.mock.calls[0];
  const firstArg = firstCall[0];
  const { items } = firstArg;
  expect(items.length).toBeGreaterThan(0);
  const actualItems = await db.getItems();
  expect(items).toEqual(actualItems);
});

test('getItem returns the specific item', async () => {
  const { res, req } = mockRequestResponse();
  req.params = { id: '1' };

  await itemController.getItem(req, res);

  expect(res.json).toHaveBeenCalledTimes(1);
  const firstCall = res.json.mock.calls[0];
  const firstArg = firstCall[0];
  const { item } = firstArg;

  const itemFromDb = await db.getItem(item.id);
  expect(item).toEqual(itemFromDb);
});

test('getItem returns 404 if the item with the given id is not found', async () => {
  const { res, req } = mockRequestResponse();
  req.params = { id: 'notfound' };

  await itemController.getItem(req, res);

  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status.mock.calls[0][0]).toBe(404);
  expect(res.send).toHaveBeenCalledTimes(1);
  expect(res.send.mock.calls[0][0]).toBe('Not found');
});

test('it throws a required parameter error if id is missing', async () => {
  const { res, req } = mockRequestResponse();
  try {
    await itemController.getItem(req, res);
  } catch (err) {
    expect(err).toEqual(Error('Required parameter "id" is missing.'));
  }
});
