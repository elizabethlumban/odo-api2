import express from 'express';
import configureHealthCheckRoutes from './healthCheck';
import configureItemRoutes from './items';

const configureRoutes = app => {
  // health check
  const healthCheckRouter = express.Router();
  configureHealthCheckRoutes(healthCheckRouter);
  app.use('/', healthCheckRouter);

  // item routes
  const itemRouter = express.Router();
  configureItemRoutes(itemRouter);
  app.use('/api/items', itemRouter);
};

export default configureRoutes;
