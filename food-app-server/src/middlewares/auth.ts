import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserDocument, UserModel } from '../models/user.model';
import { OrderModel } from '../models/order.model';
import { UserRole } from '../utils/enums';

export interface AuthRequest extends Request {
  user?: UserDocument;
}

export const isAuthenticated = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await UserModel.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const isOrderOwner = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const order = await OrderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You are not the owner of this order' });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const protect = (roles: UserRole[] = []) => {
  return [
    isAuthenticated,
    (req: AuthRequest, res: Response, next: NextFunction) => {
      if (roles.length === 0) {
        return next();
      }

      const userRole = req.user!.role;

      if (roles.includes(userRole)) {
        next();
      } else {
        res.status(403).json({ message: 'Forbidden: You do not have the required role.' });
      }
    },
  ];
};
