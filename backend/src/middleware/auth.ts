
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  // Get token from header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    
    // Add user info to request
    req.user = decoded as { id: string; email: string; role: string };
    
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  // Make sure user is authenticated
  if (!req.user) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }
  
  // Check if user is admin
  if (req.user.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  
  next();
};

export const requireExpert = (req: Request, res: Response, next: NextFunction): void => {
  // Make sure user is authenticated
  if (!req.user) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }
  
  // Check if user is expert or admin
  if (req.user.role !== 'expert' && req.user.role !== 'admin') {
    res.status(403).json({ error: 'Expert access required' });
    return;
  }
  
  next();
};
