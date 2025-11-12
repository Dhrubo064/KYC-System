import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user?.isAdmin) {
    res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    return;
  }
  
  next();
};