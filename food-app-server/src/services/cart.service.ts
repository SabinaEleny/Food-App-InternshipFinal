import { CartRepository } from '../repositories/cart.repository';
import { CartDocument } from '../models/cart.model';
import { UpsertCartItemInput } from '../schemas/cart.schema';
import { Types } from 'mongoose';
import { ProductRepository } from '../repositories/product.repository';

export class CartService {
  private readonly cartRepository: CartRepository;
  private readonly productRepository: ProductRepository;

  constructor() {
    this.cartRepository = new CartRepository();
    this.productRepository = new ProductRepository();
  }

  public async getCart(userId: string | Types.ObjectId): Promise<CartDocument> {
    const cart = await this.cartRepository.findOrCreateByUserId(userId);
    return cart.populate(['items.product', 'restaurantId']);
  }

  public async upsertItem(
    userId: string | Types.ObjectId,
    itemData: UpsertCartItemInput,
  ): Promise<CartDocument> {
    const product = await this.productRepository.findById(itemData.productId);
    if (!product || !product.isAvailable) {
      throw Object.assign(new Error('Product not found or is unavailable'), { status: 404 });
    }

    const cart = await this.cartRepository.findOrCreateByUserId(userId);

    if (cart.restaurantId && cart.restaurantId.toString() !== product.restaurantId.toString()) {
      throw Object.assign(
        new Error(
          'You can only order from one restaurant at a time. Please clear your cart to start a new order.',
        ),
        { status: 400 },
      );
    }

    if (!cart.restaurantId) {
      cart.restaurantId = product.restaurantId;
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product._id.toString() === itemData.productId,
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += itemData.quantity;
    } else {
      cart.items.push({
        product: new Types.ObjectId(itemData.productId),
        quantity: itemData.quantity,
      });
    }

    await cart.save();
    return this.getCart(userId);
  }

  public async updateItemQuantity(
    userId: string | Types.ObjectId,
    itemData: UpsertCartItemInput,
  ): Promise<CartDocument> {
    const cart = await this.cartRepository.findOrCreateByUserId(userId);

    const itemIndex = cart.items.findIndex(
      (item) => item.product._id.toString() === itemData.productId,
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = itemData.quantity;
    } else {
      throw Object.assign(new Error('Product not found in cart.'), { status: 404 });
    }

    await cart.save();
    return this.getCart(userId);
  }

  public async removeItem(
    userId: string | Types.ObjectId,
    productId: string,
  ): Promise<CartDocument> {
    const cart = await this.getCart(userId);
    cart.items = cart.items.filter((item) => item.product._id.toString() !== productId);

    if (cart.items.length === 0) {
      cart.restaurantId = undefined;
    }

    await cart.save();
    return this.getCart(userId);
  }

  public async clearCart(userId: string | Types.ObjectId): Promise<CartDocument> {
    const cart = await this.getCart(userId);
    cart.items = [];
    cart.restaurantId = undefined;

    await cart.save();
    return cart;
  }
}
