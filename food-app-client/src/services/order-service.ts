import apiClient from "@/api/api-client";
import type {Order, OrderHistoryItem} from "@/types";

type AddressPayload = {
    street: string;
    city: string;
    postalCode: string;
    details?: string;
};

type CreatePaymentIntentPayload = {
    address: AddressPayload;
    specialInstructions?: string;
    deliveryMethod: 'delivery' | 'pickup';
    tipPercentage: number;
};

export type CreateOrderPayload = CreatePaymentIntentPayload & {
    paymentIntentId?: string;
    paymentMethod: 'card' | 'cash';
};

type BackendOrder = Order & { _id: string };
type BackendOrderHistoryItem = OrderHistoryItem & { _id: string };

export async function createPaymentIntent(payload: CreatePaymentIntentPayload): Promise<{ clientSecret: string }> {
    const {data} = await apiClient.post('/orders/create-payment-intent', payload);
    return data;
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
    const {data} = await apiClient.post<BackendOrder>('/orders', payload);
    return {...data, id: data._id};
}

export async function fetchMyOrders(): Promise<OrderHistoryItem[]> {
    const {data} = await apiClient.get<BackendOrderHistoryItem[]>('/orders');
    return data.map(order => ({...order, id: order._id}));
}