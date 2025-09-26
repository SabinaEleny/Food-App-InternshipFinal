export enum UserRole {
  Customer = 'customer',
  Admin = 'admin',
}

export enum VehicleType {
  Motorcycle = 'motorcycle',
  Car = 'car',
  Bicycle = 'bicycle',
}

export enum OrderStatus {
  Created = 'created',
  PaymentPending = 'payment_pending',
  Paid = 'paid',
  PaymentFailed = 'payment_failed',
  Accepted = 'accepted',
  Preparing = 'preparing',
  ReadyForPickup = 'ready_for_pickup',
  OutOfDelivery = 'out_for_delivery',
  Delivered = 'delivered',
  Canceled = 'canceled',
  Refunded = 'refunded',
}

export enum PaymentStatus {
  RequiresPayment = 'requires_payment',
  Paid = 'paid',
  Refunded = 'refunded',
  Failed = 'failed',
}

export enum DeliveryEventStatus {
  OrderPlaced = 'order_placed',
  RestaurantAccepted = 'restaurant_accepted',
  DriverAssigned = 'driver_assigned',
  OrderPickedUp = 'order_picked_up',
  OrderDelivered = 'order_delivered',
}
