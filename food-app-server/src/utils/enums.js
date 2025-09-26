"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryEventStatus = exports.PaymentStatus = exports.OrderStatus = exports.VehicleType = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["Customer"] = "customer";
    UserRole["Admin"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
var VehicleType;
(function (VehicleType) {
    VehicleType["Motorcycle"] = "motorcycle";
    VehicleType["Car"] = "car";
    VehicleType["Bicycle"] = "bicycle";
})(VehicleType || (exports.VehicleType = VehicleType = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["Created"] = "created";
    OrderStatus["PaymentPending"] = "payment_pending";
    OrderStatus["Paid"] = "paid";
    OrderStatus["PaymentFailed"] = "payment_failed";
    OrderStatus["Accepted"] = "accepted";
    OrderStatus["Preparing"] = "preparing";
    OrderStatus["ReadyForPickup"] = "ready_for_pickup";
    OrderStatus["OutOfDelivery"] = "out_for_delivery";
    OrderStatus["Delivered"] = "delivered";
    OrderStatus["Canceled"] = "canceled";
    OrderStatus["Refunded"] = "refunded";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["RequiresPayment"] = "requires_payment";
    PaymentStatus["Paid"] = "paid";
    PaymentStatus["Refunded"] = "refunded";
    PaymentStatus["Failed"] = "failed";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var DeliveryEventStatus;
(function (DeliveryEventStatus) {
    DeliveryEventStatus["OrderPlaced"] = "order_placed";
    DeliveryEventStatus["RestaurantAccepted"] = "restaurant_accepted";
    DeliveryEventStatus["DriverAssigned"] = "driver_assigned";
    DeliveryEventStatus["OrderPickedUp"] = "order_picked_up";
    DeliveryEventStatus["OrderDelivered"] = "order_delivered";
})(DeliveryEventStatus || (exports.DeliveryEventStatus = DeliveryEventStatus = {}));
