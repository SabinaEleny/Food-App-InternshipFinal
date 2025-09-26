import {useState} from 'react';
import {Loader2, ShoppingCart} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {useCart} from '@/hooks/use-cart.ts';
import {useAuth} from '@/hooks/use-auth.ts';
import {NavLink, useNavigate} from 'react-router-dom';
import {useRestaurant} from '@/hooks/use-restaurants.ts';
import {createOrder, type CreateOrderPayload, createPaymentIntent} from '@/services/order-service.ts';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useOrderCalculations} from '@/hooks/use-order-calculations';
import {DeliveryDetails} from '@/components/delivery-details.tsx';
import {PaymentOptions} from '@/components/payment-options.tsx';
import {CartItemsList} from '@/components/cart-items-list.tsx';
import {SpecialInstructions} from '@/components/special-instructions.tsx';
import {OrderSummary} from '@/components/order-summary.tsx';
import {toast} from 'sonner';
import type {Order} from '@/types';

function CheckoutPage() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const {user} = useAuth();
    const {data: cart, isLoading: isCartLoading} = useCart(!!user);
    const {data: restaurant, isLoading: isRestaurantLoading} = useRestaurant(cart?.restaurant?.id);
    const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [tipPercentage, setTipPercentage] = useState(15);
    const calculations = useOrderCalculations({cart, restaurant, deliveryMethod, tipPercentage});
    const [selectedAddress, setSelectedAddress] = useState({street: '', city: ''});
    const [errors, setErrors] = useState({street: '', city: ''});

    const {mutate: getPaymentIntent, isPending: isCreatingIntent} = useMutation({
        mutationFn: createPaymentIntent,
        onSuccess: (data) => {
            if (data.clientSecret) {
                setClientSecret(data.clientSecret);
            }
        },
        onError: (error) => {
            console.error(error.message);
        }
    });

    const {mutate: placeOrder, isPending: isPlacingOrder} = useMutation({
        mutationFn: createOrder,
        onSuccess: (newlyCreatedOrder: Order) => {
            sessionStorage.setItem('activeOrder', JSON.stringify(newlyCreatedOrder));

            queryClient.invalidateQueries({queryKey: ['cart']});
            toast.success("Order placed successfully!");

            navigate('/profile');
        },
        onError: (error) => {
            console.error(error);
            toast.error("Order can not be placed!")
        }
    });

    const validateForm = (): boolean => {
        const newErrors = {street: '', city: ''};
        let isValid = true;
        if (!selectedAddress.street.trim() || selectedAddress.street.length < 3) {
            newErrors.street = "Street and number are mandatory";
            isValid = false;
        }
        if (!selectedAddress.city.trim() || selectedAddress.city.length < 2) {
            newErrors.city = "City is requierd";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    const isDelivery = deliveryMethod === 'delivery';

    const handleFinalizeOrder = (paymentIntentId?: string) => {
        if (isDelivery && !validateForm()) return;

        const payload: CreateOrderPayload = {
            address: isDelivery
                ? {street: selectedAddress.street, city: selectedAddress.city, postalCode: '000000'}
                : {street: restaurant!.name, city: restaurant!.location?.address || 'Restaurant', postalCode: '000000'},
            specialInstructions: specialInstructions || undefined,
            deliveryMethod,
            tipPercentage: isDelivery ? tipPercentage : 0,
            paymentMethod,
            paymentIntentId,
        };
        placeOrder(payload);
    };

    const handlePreparePayment = () => {
        if (isDelivery && !validateForm()) return;

        const intentPayload = {
            address: isDelivery
                ? {street: selectedAddress.street, city: selectedAddress.city, postalCode: '000000'}
                : {street: restaurant!.name, city: restaurant!.location?.address || 'Restaurant', postalCode: '000000'},
            specialInstructions: specialInstructions || undefined,
            deliveryMethod,
            tipPercentage: isDelivery ? tipPercentage : 0,
        };
        getPaymentIntent(intentPayload);
    };

    if (isCartLoading || isRestaurantLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary"/>
                <p className="text-muted-foreground">Loading order details...</p>
            </div>
        );
    }

    if (!cart || !restaurant || cart.items.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen gap-6 text-center px-4">
                <ShoppingCart className="h-16 w-16 text-muted-foreground"/>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-foreground">Your cart is empty.</h1>
                    <p className="text-muted-foreground">It looks like you haven't added any products yet. Find
                        something delicious!</p>
                </div>
                <Button asChild><NavLink to="/">Let's go!</NavLink></Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 font-sans">
            <div className="mx-auto max-w-7xl">
                <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    <div className="lg:col-span-2 space-y-6">
                        <DeliveryDetails
                            deliveryMethod={deliveryMethod}
                            onDeliveryMethodChange={setDeliveryMethod}
                            selectedAddress={selectedAddress}
                            errors={errors}
                            onAddressSelect={setSelectedAddress}
                            restaurant={restaurant}
                        />
                        <PaymentOptions
                            paymentMethod={paymentMethod}
                            onPaymentMethodChange={setPaymentMethod}
                        />
                        <CartItemsList
                            items={cart.items}
                        />
                        <SpecialInstructions
                            value={specialInstructions}
                            onChange={setSpecialInstructions}
                        />
                    </div>

                    <OrderSummary
                        calculations={calculations}
                        isDelivery={isDelivery}
                        tipPercentage={tipPercentage}
                        onTipChange={setTipPercentage}
                        paymentMethod={paymentMethod}
                        clientSecret={clientSecret}
                        isCreatingIntent={isCreatingIntent}
                        isPlacingOrder={isPlacingOrder}
                        onPreparePayment={handlePreparePayment}
                        onFinalizeOrder={() => handleFinalizeOrder()}
                        onOrderSuccess={(paymentIntentId) => handleFinalizeOrder(paymentIntentId)}
                        onPaymentError={() => {
                            setClientSecret(null);
                            toast.error("Insufficient Funds!")
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;