import { Types } from 'mongoose';
import { OrderDocument, OrderItem } from '../models/order.model';
import { OrderRepository } from '../repositories/order.repository';
import { CreateOrderInput } from '../schemas/order.schema';
import { CartRepository } from '../repositories/cart.repository';
import { CartService } from './cart.service';
import { ProductDocument } from '../models/product.model';
import { DeliveryEventStatus, OrderStatus, PaymentStatus } from '../utils/enums';
import { RestaurantDocument, RestaurantModel } from '../models/restaurant.model';
import Stripe from 'stripe';
import { CartDocument } from '../models/cart.model';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

type OrderFilters = {
  userId: string;
  status?: any;
  restaurantId?: string;
};

export class OrderService {
  private readonly orderRepository: OrderRepository;
  private readonly cartRepository: CartRepository;
  private readonly cartService: CartService;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.cartRepository = new CartRepository();
    this.cartService = new CartService();
  }

  public async createPaymentIntent(
    userId: string,
    input: CreateOrderInput,
  ): Promise<{ clientSecret: string | null }> {
    const cart = await this.cartRepository.getByUserId(userId);
    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty.');
    }

    const restaurant = await RestaurantModel.findById(cart.restaurantId);
    if (!restaurant) {
      throw new Error('Restaurant not found.');
    }

    const { amounts } = this.calculateOrderAmounts(cart, restaurant, input);
    const totalInCents = Math.round(amounts.total * 100);

    if (totalInCents <= 0) {
      throw new Error('Total must be a positive amount.');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalInCents,
      currency: 'ron',
      metadata: { userId, cartId: cart._id.toString() },
    });

    return { clientSecret: paymentIntent.client_secret };
  }

  public async create(
    userId: string,
    input: CreateOrderInput & { paymentIntentId: string },
  ): Promise<OrderDocument> {
    const cart = await this.cartRepository.getByUserId(userId);

    if (!cart || cart.items.length === 0 || !cart.restaurantId) {
      throw Object.assign(new Error('Your cart is empty. Cannot create an order.'), {
        status: 400,
      });
    }

    const restaurant = await RestaurantModel.findById(cart.restaurantId);
    if (!restaurant) {
      throw Object.assign(new Error('Restaurant not found.'), { status: 404 });
    }

    const { orderItems, amounts } = this.calculateOrderAmounts(cart, restaurant, input);

    let paymentStatus: PaymentStatus;
    let orderStatus: OrderStatus;

    if (input.paymentMethod === 'card') {
      if (!input.paymentIntentId) {
        throw Object.assign(new Error('Payment Intent ID is required for card payments.'), {
          status: 400,
        });
      }
      paymentStatus = PaymentStatus.Paid;
      orderStatus = OrderStatus.Paid;
    } else {
      paymentStatus = PaymentStatus.RequiresPayment;
      orderStatus = OrderStatus.PaymentPending;
    }

    const newOrderData: Partial<OrderDocument> = {
      userId: new Types.ObjectId(userId),
      restaurantId: cart.restaurantId,
      items: orderItems,
      amounts: {
        subtotal: amounts.subtotal,
        discount: amounts.productDiscount,
        deliveryFee: amounts.deliveryFee,
        tax: amounts.tax,
        total: amounts.total,
      },
      payment: {
        provider: input.paymentMethod === 'card' ? 'stripe' : 'cash',
        intentId: input.paymentIntentId,
        status: paymentStatus,
      },
      status: orderStatus,
      delivery: {
        address: input.address,
        events: [
          {
            status: DeliveryEventStatus.OrderPlaced,
            at: new Date(),
            note: input.specialInstructions,
          },
        ],
      },
    };

    const createdOrder = await this.orderRepository.create(newOrderData);
    await this.cartService.clearCart(userId);
    return createdOrder;
  }

  public async findAll(filters: OrderFilters): Promise<OrderDocument[]> {
    if (!filters || !filters.userId) {
      console.error('userId is undefined in findAll - orders.service');
      return [];
    }
    return this.orderRepository.findAll(filters);
  }

  public async findById(userId: string, orderId: string): Promise<OrderDocument | null> {
    const order = await this.orderRepository.findById(orderId);
    if (!order || order.userId.toString() !== userId) {
      return null;
    }
    return order;
  }

  public async delete(userId: string, orderId: string): Promise<OrderDocument | null> {
    const order = await this.findById(userId, orderId);

    if (!order) {
      throw Object.assign(new Error('Order not found or you do not have permission'), {
        status: 404,
      });
    }

    const deletableStatuses: string[] = [OrderStatus.Created, PaymentStatus.RequiresPayment];
    if (!deletableStatuses.includes(order.status)) {
      throw Object.assign(new Error(`Cannot delete an order with status: ${order.status}`), {
        status: 400,
      });
    }

    return this.orderRepository.delete(orderId);
  }

  private calculateOrderAmounts(
    cart: CartDocument,
    restaurant: RestaurantDocument,
    input: CreateOrderInput,
  ) {
    let subtotal = 0;
    let productDiscount = 0;
    const orderItems: OrderItem[] = cart.items.map((cartItem) => {
      const product = cartItem.product as unknown as ProductDocument;
      if (!product.isAvailable) {
        throw new Error(`Product "${product.name}" is unavailable.`);
      }

      const price = product.discountPrice ?? product.price;
      subtotal += price * cartItem.quantity;

      if (product.discountPrice) {
        productDiscount += (product.price - product.discountPrice) * cartItem.quantity;
      }

      return {
        productId: product._id,
        name: product.name,
        category: product.category,
        price: price,
        qty: cartItem.quantity,
      };
    });

    const isDelivery = input.deliveryMethod === 'delivery';
    const deliveryFee = isDelivery ? (restaurant.delivery?.fee ?? 15) : 0;
    const minOrder = restaurant.delivery?.minOrder ?? 0;
    const smallOrderFee = isDelivery && subtotal < minOrder ? 50 : 0;
    const tipAmount = isDelivery ? subtotal * (input.tipPercentage / 100) : 0;
    const tax = subtotal * 0.09;
    const finalDeliveryFee = deliveryFee + smallOrderFee;
    const total = subtotal + finalDeliveryFee + tipAmount + tax;

    return {
      orderItems,
      amounts: {
        subtotal,
        productDiscount,
        deliveryFee: finalDeliveryFee,
        tax,
        total,
      },
    };
  }
}
