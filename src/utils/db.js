const db = {
  items: [{ id: '1', text: 'Item 1' }, { id: '2', text: 'Item 2' }, { id: '3', text: 'Item 3' }],

  getItems: async filter => {
    return filter ? db.items.filter(filter) : [...db.items];
  },

  getItem: async id => {
    return (await db.getItems(item => item.id === id))[0];
  }
};

export default db;
