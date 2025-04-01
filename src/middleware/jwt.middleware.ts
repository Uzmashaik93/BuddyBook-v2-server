import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from "../types";  // Import payload type

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload; // Add the user property to the Request interface
  }
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get the token from the Authorization header

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    // Decode the JWT using the type
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET || 'your-secret-key') as JwtPayload;
    req.user = decoded; // Add the decoded user to the request object
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
    return;
  }
};
