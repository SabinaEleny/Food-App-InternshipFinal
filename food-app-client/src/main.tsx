import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/lib/queryClient.ts";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
    throw new Error("VITE_STRIPE_PUBLISHABLE_KEY is not set in .env file");
}

const stripePromise = loadStripe(stripePublishableKey);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <Elements stripe={stripePromise}>
                <App/>
            </Elements>
        </QueryClientProvider>
    </React.StrictMode>,
);