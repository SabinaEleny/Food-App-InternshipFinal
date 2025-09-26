import {PaymentElement, useElements, useStripe} from "@stripe/react-stripe-js";
import React, {useState} from "react";
import {Button} from "./ui/button";
import {Loader2} from "lucide-react";

type CheckoutFormProps = {
    onSuccess: (paymentIntentId: string) => void;
    onError: (message: string) => void;
};

export function CheckoutForm({onSuccess, onError}: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        const {error, paymentIntent} = await stripe.confirmPayment({
            elements,
            // prevent automatic redirection
            redirect: "if_required",
        });

        if (error) {
            onError(error.message || "An error occurred while processing the payment.");
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            onSuccess(paymentIntent.id);
        } else {
            onError("The payment could not be confirmed.");
        }

        setIsProcessing(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element"/>
            <Button disabled={isProcessing || !stripe} className="w-full h-12 mt-6" type="submit">
                {isProcessing
                    ? <Loader2 className="h-6 w-6 animate-spin"/>
                    : `Pay`
                }
            </Button>
        </form>
    );
}