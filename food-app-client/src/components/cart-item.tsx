import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Minus, Plus, Trash2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import type {CartItem as CartItemType} from '@/types';
import {removeItemFromCart, updateItemQuantityInCart} from '@/services/cart-service';
import {toast} from "sonner";

type CartItemProps = {
    item: CartItemType;
};

export default function CartItem(props: CartItemProps) {
    const queryClient = useQueryClient();

    const {mutate: removeItem} = useMutation({
        mutationFn: removeItemFromCart,
        onSuccess: (updatedCart) => {
            queryClient.setQueryData(['cart'], updatedCart);
            toast.success("Item removed successfully from cart!");
        },
        onError: () => {
            toast.error("Could not remove item from cart!");
        }
    });

    const {mutate: updateQuantity} = useMutation({
        mutationFn: updateItemQuantityInCart,
        onSuccess: (updatedCart) => {
            queryClient.setQueryData(['cart'], updatedCart);
            toast.success("Item quantity updated successfully!");
        },
        onError: () => {
            toast.error("Could not update item quantity!");
        }
    });

    const handleRemove = () => {
        removeItem(props.item.product.id);
    };

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity < 1) {
            handleRemove();
        } else {
            updateQuantity({productId: props.item.product.id, quantity: newQuantity});
        }
    };

    const hasDiscount = typeof props.item.product.discountPrice === 'number' && props.item.product.discountPrice < props.item.product.price;
    const displayPrice = hasDiscount ? props.item.product.discountPrice! : props.item.product.price;
    const originalPrice = props.item.product.price;

    return (
        <div className="flex items-start gap-4 py-4">
            <img src={props.item.product.imageUrl} alt={props.item.product.name}
                 className="h-20 w-20 rounded-md object-cover border border-border"/>
            <div className="flex-1 grid gap-1.5">
                <h3 className="font-semibold text-foreground">{props.item.product.name}</h3>
                <p className="text-sm text-muted-foreground">{props.item.product.description || ''}</p>
                <div className="flex items-center gap-2 mt-1">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 hover:cursor-pointer"
                        onClick={() => handleQuantityChange(props.item.quantity - 1)}
                    >
                        <Minus className="h-4 w-4"/>
                    </Button>
                    <span className="font-bold text-center w-8">{props.item.quantity}</span>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 hover:cursor-pointer"
                        onClick={() => handleQuantityChange(props.item.quantity + 1)}
                    >
                        <Plus className="h-4 w-4"/>
                    </Button>
                </div>
            </div>
            <div className="text-right">
                <p className="font-bold text-lg text-primary">
                    {((displayPrice * props.item.quantity)).toFixed(2)} RON
                </p>
                {hasDiscount && (
                    <p className="text-sm text-muted-foreground line-through">
                        {((originalPrice * props.item.quantity)).toFixed(2)} RON
                    </p>
                )}
                <div className="flex items-center justify-end gap-1 mt-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:cursor-pointer" onClick={handleRemove}>
                        <Trash2 className="h-4 w-4 text-destructive"/>
                    </Button>
                </div>
            </div>
        </div>
    );
}