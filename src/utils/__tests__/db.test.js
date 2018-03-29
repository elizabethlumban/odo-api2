import db from '../db';

const mockData = db.items;

test('can get an item', async () => {
  const [firstItem] = mockData;
  const item = await db.getItem(firstItem.id);
  expect(item).toEqual(firstItem);
});

test('can get multiple items', async () => {
  const { 0: firstItem, 2: thirdItem } = mockData;
  const items = await db.getItems(i => i.id === firstItem.id || i.id === thirdItem.id);
  expect(items).toEqual([firstItem, thirdItem]);
});
