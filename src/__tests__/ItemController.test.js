const ItemController = require('../ItemController');
require('jest');

const controller = new ItemController();

describe('getItems', () => {
    test('Returns the items', () => {
        const res = { json: jest.fn() };

        controller.getItems({}, res);
        expect(res.json.mock.calls).toEqual([
            [[{ id: '1', text: 'Item 1' }, { id: '2', text: 'Item 2' }]]
        ]);
    });
});

describe('addItem', () => {
    test('Returns the added item', () => {
        const req = { body: { text: 'test' } };
        const res = { json: jest.fn() };

        controller.addItem(req, res);
        expect(res.json.mock.calls).toEqual([[{ id: '3', text: 'test' }]]);
    });
});
