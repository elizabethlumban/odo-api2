import express from 'express';

import { Express, Response } from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ItemsController } from './controllers/ItemsController';
import { HealthController } from './controllers/HealthController';

async function startServer() {
  const app = express();

  const port = process.env.PORT || 8080;

  //forceHttpsMiddleware(app);

  // Common middleware
  app.use(cors());
  app.use(compression());
  app.use(helmet());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.text({ type: 'plain/text' }));

  // Set Up the controllers and routes
  await setUpControllers(app);

  // success redirect
  app.use('/', async (_: any, res: Response<any>) => {
    res.status(200).end();
  });

  app.listen(port, () => console.log(`Server is on port ${port}`));
}

async function setUpControllers(app: Express) {
  const healthController = new HealthController();
  healthController.route(app);
  const itemsController = new ItemsController();
  itemsController.route(app);
}

export default startServer;
