import { Express, Response, Request } from 'express';

export class ItemsController {
  public route = (app: Express) => {
    app.get('/api/item', this.getItems);
  };

  public getItems = async (req: Request, res: Response, next: any) => {
    try {
      console.log('here at getItem..');
      return res.json([{ name: 'Item 1' }, { name: 'Item 2' }, { name: 'Item 3' }]);
    } catch (e) {
      next(e);
    }
  };
}
