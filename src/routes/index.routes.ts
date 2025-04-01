import { Request, Response, NextFunction, Router } from 'express';
const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json("All good in here");
});
export default router;
