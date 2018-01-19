class ItemController {

    constructor() {
        this.lastId = 3;
        this.all = [
            { id: "1", text: "Item 1" },
            { id: "2", text: "Item 2" }
        ];
    }

    getItems(req, res) {
        res.json(this.all);
    }

    addItem(req, res) {
        const text = req.body.text;
        const id = `${(this.lastId++)}`;
        const newItem = { id, text };

        this.all.push(newItem);
        res.json(newItem);
    }
};

module.exports = ItemController;