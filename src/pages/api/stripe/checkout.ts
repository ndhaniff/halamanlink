import type { APIRoute } from "astro";
import {
  createCheckoutSession,
  isStripeConfigured,
} from "../../../lib/stripe";
import { getSubscriptionByUserId } from "../../../lib/db-queries";

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST: APIRoute = async ({ locals }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, 401);
  if (!isStripeConfigured()) return json({ error: "Billing is not configured" }, 503);

  const subscription = await getSubscriptionByUserId(locals.user.id);
  const appUrl = import.meta.env.APP_URL || "http://localhost:4321";

  const session = await createCheckoutSession({
    userId: locals.user.id,
    email: locals.user.email,
    customerId: subscription?.stripeCustomerId || undefined,
    successUrl: `${appUrl}/dashboard/billing?success=1`,
    cancelUrl: `${appUrl}/dashboard/billing?canceled=1`,
  });

  return json({ url: session.url });
};
