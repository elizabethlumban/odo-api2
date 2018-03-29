import express from 'express';
import bodyParser from 'body-parser';
import 'express-async-errors';
import { logger } from 'garage-utils';
import configureRoutes from './routes';

async function startServer({ port }) {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  configureRoutes(app);

  return new Promise(resolve => {
    const server = app.listen(port, () => {
      logger.info(`Server listening on port ${server.address().port}`);
      resolve(server);
    });
  });
}

export default startServer;
