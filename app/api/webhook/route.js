// app/api/webhook/route.js

import Stripe from 'stripe';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const runtime = 'experimental-edge'; // or 'nodejs'

export const api = {
    bodyParser: false,
};

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            // Fulfill the purchase...
            handleCheckoutSessionCompleted(session);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

function handleCheckoutSessionCompleted(session) {
    // TODO: fulfill order
    console.log('Payment was successful.');
}
