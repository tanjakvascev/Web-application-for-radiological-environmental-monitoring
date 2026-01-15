import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// tip za payload koji ocekujemo u tokenu
export interface AuthPayload extends JwtPayload {
  sub: string;
  email: string;
}

// tajni ključ iz okruženja
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    (req as any).user = decoded; // ako imas custom Request tip, bolje ga prosiri
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
