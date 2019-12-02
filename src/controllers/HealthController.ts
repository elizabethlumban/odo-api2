import { Express, Response, Request } from "express";

export class HealthController {
  public route = (app: Express) => {
    app.get("/api/health", this.showHealth);
  };

  public showHealth = async (_req: Request, res: Response, next: any) => {
    try {
      return res.json({ update: "I am alive" });
    } catch (e) {
      next(e);
    }
  };
}
