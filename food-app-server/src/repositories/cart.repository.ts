import { Cart, CartDocument, CartModel } from '../models/cart.model';
import { Types } from 'mongoose';

export class CartRepository {
  public async getByUserId(userId: string | Types.ObjectId): Promise<CartDocument | null> {
    return CartModel.findOne({ userId }).populate('items.product');
  }

  public async findOrCreateByUserId(userId: string | Types.ObjectId): Promise<CartDocument> {
    const cart = await this.getByUserId(userId);
    if (cart) {
      return cart;
    }
    return CartModel.create({ userId, items: [] });
  }

  public async updateByUserId(
    userId: string | Types.ObjectId,
    cartData: Partial<Cart>,
  ): Promise<CartDocument | null> {
    return CartModel.findOneAndUpdate({ userId }, cartData, { new: true }).populate(
      'items.product',
    );
  }

  public async deleteByUserId(userId: string | Types.ObjectId): Promise<CartDocument | null> {
    return CartModel.findOneAndDelete({ userId });
  }
}
