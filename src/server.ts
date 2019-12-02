import express from "express";

import { Express, Request, Response } from "express";
import { isDev } from "./environment/envUtil";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import { ItemsController } from "./controllers/ItemsController";
import { HealthController } from "./controllers/HealthController";

async function startServer() {
  const app = express();

  const port = process.env.PORT || 3001;

  forceHttpsMiddleware(app);

  // Common middleware
  app.use(cors());
  app.use(compression());
  app.use(helmet());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.text({ type: "plain/text" }));

  // Set Up the controllers and routes
  await setUpControllers(app);

  // success redirect
  app.use("/", async (_: any, res: Response) => {
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

function forceHttpsMiddleware(app: Express) {
  // Require HTTPS
  // Add a handler to inspect the req.secure flag (see
  // http://expressjs.com/api#req.secure). This allows us
  // to know whether the request was via http or https.
  app.enable("trust proxy");
  app.use((req: Request, res: Response, next: any) => {
    if (req.secure || isDev()) {
      next();
    } else {
      // request was via http, so redirect to https
      res.redirect("https://" + req.headers.host + req.url);
    }
  });
}

export default startServer;
