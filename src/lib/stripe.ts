import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = import.meta.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripeClient) {
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

export function isStripeConfigured(): boolean {
  return Boolean(
    import.meta.env.STRIPE_SECRET_KEY &&
      import.meta.env.STRIPE_PRICE_PRO_MONTHLY,
  );
}

export async function createCheckoutSession(input: {
  userId: string;
  email: string;
  customerId?: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe is not configured");

  const priceId = import.meta.env.STRIPE_PRICE_PRO_MONTHLY;
  if (!priceId) throw new Error("Stripe price is not configured");

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: input.customerId || undefined,
    customer_email: input.customerId ? undefined : input.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    metadata: { userId: input.userId },
    subscription_data: {
      metadata: { userId: input.userId },
    },
  });

  return session;
}

export async function createBillingPortalSession(input: {
  customerId: string;
  returnUrl: string;
}) {
  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe is not configured");

  return stripe.billingPortal.sessions.create({
    customer: input.customerId,
    return_url: input.returnUrl,
  });
}

export function constructStripeEvent(
  payload: string,
  signature: string,
): Stripe.Event {
  const stripe = getStripe();
  const secret = import.meta.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) throw new Error("Stripe webhook is not configured");
  return stripe.webhooks.constructEvent(payload, signature, secret);
}
