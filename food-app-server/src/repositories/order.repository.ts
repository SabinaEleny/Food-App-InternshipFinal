import { Order, OrderDocument, OrderModel } from '../models/order.model';
import { OrderStatus } from '../utils/enums';
import { FilterQuery, Types } from 'mongoose';

type OrderQueryFilters = {
  userId?: string | Types.ObjectId;
  restaurantId?: string | Types.ObjectId;
  status?: OrderStatus;
};

export class OrderRepository {
  public async findAll(filters: OrderQueryFilters = {}): Promise<OrderDocument[]> {
    const query: FilterQuery<OrderDocument> = {};
    if (filters.userId) query.userId = filters.userId;
    if (filters.restaurantId) query.restaurantId = filters.restaurantId;
    if (filters.status) query.status = filters.status;

    return OrderModel.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .populate('restaurantId', 'name')
      .populate('items.productId', 'name price')
      .populate('delivery.courierId', 'firstName lastName');
  }

  public async findById(id: string | Types.ObjectId): Promise<OrderDocument | null> {
    return OrderModel.findById(id)
      .populate('userId', 'name email')
      .populate('restaurantId', 'name')
      .populate('items.productId', 'name price')
      .populate('delivery.courierId', 'firstName lastName');
  }

  public async create(orderData: Partial<Order>): Promise<OrderDocument> {
    const newOrder = await OrderModel.create(orderData);
    return newOrder.populate([
      { path: 'userId', select: 'name email' },
      { path: 'restaurantId', select: 'name' },
      { path: 'items.productId', select: 'name price' },
      { path: 'delivery.courierId', select: 'firstName lastName' },
    ]);
  }

  public async update(
    id: string | Types.ObjectId,
    orderData: Partial<Order>,
  ): Promise<OrderDocument | null> {
    return OrderModel.findByIdAndUpdate(id, orderData, { new: true })
      .populate('userId', 'name email')
      .populate('restaurantId', 'name')
      .populate('items.productId', 'name price')
      .populate('delivery.courierId', 'firstName lastName');
  }

  public async findLatestOrderByUserId(userId: Types.ObjectId): Promise<OrderDocument | null> {
    return OrderModel.findOne({ userId: userId }).sort({ createdAt: -1 }).lean();
  }

  public async delete(id: string | Types.ObjectId): Promise<OrderDocument | null> {
    return OrderModel.findByIdAndDelete(id);
  }
}
