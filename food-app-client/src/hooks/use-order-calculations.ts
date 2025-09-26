import {useMemo} from 'react';
import type {Cart, Restaurant} from "@/types";

type UseOrderCalculationsProps = {
    cart: Cart | undefined;
    restaurant: Restaurant | undefined;
    deliveryMethod: 'delivery' | 'pickup';
    tipPercentage: number;
}

export const useOrderCalculations = (props: UseOrderCalculationsProps) => {
    return useMemo(() => {
        if (!props.cart || !props.restaurant) {
            return {
                subtotal: 0,
                productDiscount: 0,
                tax: 0,
                deliveryFee: 0,
                minOrder: 0,
                smallOrderFee: 0,
                tipAmount: 0,
                total: 0
            };
        }

        const isDelivery = props.deliveryMethod === 'delivery';
        const cartItems = props.cart.items;
        const subtotal = cartItems.reduce((acc, item) => (item.product.discountPrice ?? item.product.price) * item.quantity + acc, 0);
        const productDiscount = cartItems.reduce((acc, item) => item.product.discountPrice ? acc + (item.product.price - item.product.discountPrice) * item.quantity : acc, 0);
        const tax = subtotal * 0.09;
        const deliveryFee = isDelivery ? (props.restaurant.delivery?.fee ?? 1500) : 0;
        const minOrder = props.restaurant.delivery?.minOrder ?? 0;
        const smallOrderFee = isDelivery && subtotal < minOrder ? 50 : 0;
        const tipAmount = isDelivery ? subtotal * (props.tipPercentage / 100) : 0;
        const total = subtotal + tax + deliveryFee + smallOrderFee + tipAmount;

        return {subtotal, productDiscount, tax, deliveryFee, minOrder, smallOrderFee, tipAmount, total};
    }, [props.cart, props.restaurant, props.deliveryMethod, props.tipPercentage]);
};