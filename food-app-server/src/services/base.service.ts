import { Document } from 'mongoose';
import { UserDocument } from '../models/user.model';

export type BaseServiceType<T extends Document> = {
  getAll(user?: UserDocument, filters?: any): Promise<T[]>;
  getById(id: string, user?: UserDocument): Promise<T | null>;
  create(data: any, user?: UserDocument): Promise<T | { error: string }>;
  update(id: string, data: any, user?: UserDocument): Promise<T | null | { error: string }>;
  delete(id: string, user?: UserDocument): Promise<T | null | { error: string }>;
};
