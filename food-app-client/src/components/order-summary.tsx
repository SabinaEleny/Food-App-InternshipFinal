import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Label} from "@/components/ui/label.tsx";
import {CheckCircle2, Loader2} from "lucide-react";
import {Elements} from "@stripe/react-stripe-js";
import {CheckoutForm} from "@/components/checkout-form.tsx";
import {loadStripe} from "@stripe/stripe-js";
import type {useOrderCalculations} from "@/hooks/use-order-calculations.ts";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

type OrderSummaryProps = {
    calculations: ReturnType<typeof useOrderCalculations>;
    isDelivery: boolean;
    tipPercentage: number;
    onTipChange: (percentage: number) => void;
    paymentMethod: 'card' | 'cash';
    clientSecret: string | null;
    isCreatingIntent: boolean;
    isPlacingOrder: boolean;
    onPreparePayment: () => void;
    onFinalizeOrder: () => void;
    onOrderSuccess: (paymentIntentId: string) => void;
    onPaymentError: () => void;
};

export function OrderSummary(props: OrderSummaryProps) {
    return (
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-8">
            <Card className="shadow-sm bg-popover border-0">
                <CardHeader><CardTitle className="text-lg">Order Summary</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {props.isDelivery && props.calculations.subtotal > 0 && props.calculations.subtotal < props.calculations.minOrder && (
                        <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-md">
                            Add <span
                            className="font-bold">{((props.calculations.minOrder - props.calculations.subtotal)).toFixed(2)} RON</span> worth
                            of products to avoid the small order fee.
                        </div>
                    )}

                    {props.calculations.productDiscount > 0 && (
                        <div className="flex items-center gap-3 rounded-lg bg-chart-1/20 p-3 text-chart-1">
                            <CheckCircle2 className="h-6 w-6"/>
                            <p className="font-semibold">You
                                saved {(props.calculations.productDiscount).toFixed(2)} RON</p>
                        </div>
                    )}

                    {props.isDelivery && (
                        <div>
                            <Label>Add a tip for the courier</Label>
                            <div className="flex justify-between gap-2 mt-2">
                                {[10, 15, 20].map(tips =>
                                    <Button key={tips} variant={props.tipPercentage === tips ? 'default' : 'secondary'}
                                            className="flex-1 rounded-full hover:cursor-pointer"
                                            onClick={() => props.onTipChange(tips)}>{tips}%</Button>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="space-y-2 text-muted-foreground">
                        <div className="flex justify-between"><span>Subtotal</span><span
                            className="font-medium text-foreground">{(props.calculations.subtotal).toFixed(2)} RON</span>
                        </div>

                        {props.isDelivery && (<div className="flex justify-between"><span>Delivery fee</span><span
                                className="font-medium text-foreground">{(props.calculations.deliveryFee).toFixed(2)} RON</span>
                            </div>
                        )}

                        {props.calculations.smallOrderFee > 0 && (
                            <div className="flex justify-between text-destructive"><span>Small order fee</span><span
                                className="font-medium">{(props.calculations.smallOrderFee).toFixed(2)} RON</span>
                            </div>
                        )}

                        <div className="flex justify-between"><span>TVA (9%)</span><span
                            className="font-medium text-foreground">{(props.calculations.tax).toFixed(2)} RON</span>
                        </div>

                        {props.calculations.tipAmount > 0 && (
                            <div className="flex justify-between"><span>Tips</span><span
                                className="font-medium text-foreground">{(props.calculations.tipAmount).toFixed(2)} RON</span>
                            </div>
                        )}
                    </div>
                    <Separator/>

                    <div className="flex justify-between text-lg font-bold text-foreground">
                        <span>TOTAL</span><span>{(props.calculations.total).toFixed(2)} RON</span></div>

                    {props.paymentMethod === 'card' && !props.clientSecret && (
                        <Button size="lg" className="w-full h-12" onClick={props.onPreparePayment}
                                disabled={props.isCreatingIntent}>
                            {props.isCreatingIntent
                                ? <Loader2 className="h-6 w-6 animate-spin"/>
                                : "Continue to checkout"
                            }
                        </Button>
                    )}

                    {props.paymentMethod === 'card' && props.clientSecret && (
                        <div className="pt-4">
                            <h3 className="text-md font-semibold mb-4 text-center">Enter card details</h3>
                            <Elements stripe={stripePromise} options={{clientSecret: props.clientSecret}}>
                                <CheckoutForm
                                    onSuccess={props.onOrderSuccess}
                                    onError={(message) => {
                                        console.error(message);
                                        props.onPaymentError();
                                    }}
                                />
                            </Elements>
                        </div>
                    )}

                    {props.paymentMethod === 'cash' && (
                        <Button
                            size="lg"
                            className="w-full h-12"
                            onClick={props.onFinalizeOrder}
                            disabled={props.isPlacingOrder}
                        >
                            {props.isPlacingOrder
                                ? <Loader2 className="h-6 w-6 animate-spin"/>
                                : "Place order (cash on delivery)"
                            }
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}