import db from '../utils/db';
import requiredParam from '../lib/requiredParam';

async function getItems(req, res) {
  const items = await db.getItems();
  return res.json({ items });
}

async function getItem({ params: { id = requiredParam('id') } }, res) {
  const item = await db.getItem(id);
  if (item) {
    return res.json({ item });
  } else {
    return res.status(404).send('Not found');
  }
}

export { getItems, getItem };
