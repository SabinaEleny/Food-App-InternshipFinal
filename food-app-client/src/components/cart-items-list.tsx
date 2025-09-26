import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import CartItem from "@/components/cart-item.tsx";
import type {CartItem as CartItemType} from "@/types/index.ts";

type CartItemsListProps = {
    items: CartItemType[];
};

export function CartItemsList(props: CartItemsListProps) {
    return (
        <Card className="bg-popover shadow-sm border-0">
            <CardHeader><CardTitle className="text-lg">Items in your cart</CardTitle></CardHeader>
            <CardContent className="divide-y divide-border -mt-4">
                {props.items.map((item) => <CartItem key={item.product.id} item={item}/>)}
            </CardContent>
        </Card>
    );
}