import { NextFunction, Request, Response, Application, Errback } from "express";

export function errorHandling(app: Application) {
  app.use((req, res, next) => {
    // this middleware runs whenever requested page is not available
    res.status(404).json({ message: "This route does not exist" });
  });

  app.use((err: Errback, req: Request, res: Response, next: NextFunction) => {
    // whenever you call next(err), this middleware will handle the error
    // always logs the error

    // only render if the error ocurred before sending the response
    if (!res.headersSent) {
      res.status(500).json({
        message: "Internal server error. Check the server console",
      });
    }
  });
};
