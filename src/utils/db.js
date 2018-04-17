const db = {
  lastId: 3,

  items: [{ id: '1', text: 'Item 1' }, { id: '2', text: 'Item 2' }, { id: '3', text: 'Item 3' }],

  getItems: async filter => {
    return filter ? db.items.filter(filter) : [...db.items];
  },

  getItem: async id => {
    return (await db.getItems(item => item.id === id))[0];
  },

  insertItem: async item => {
    const newItem = {
      ...item,
      id: `${++db.lastId}`
    };
    db.items.push(newItem);
    return newItem;
  }
};

export default db;
