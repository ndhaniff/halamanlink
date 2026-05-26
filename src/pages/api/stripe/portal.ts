import type { APIRoute } from "astro";
import {
  createBillingPortalSession,
  isStripeConfigured,
} from "../../../lib/stripe";
import { getSubscriptionByUserId } from "../../../lib/db-queries";

export const prerender = false;

export const POST: APIRoute = async ({ locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!isStripeConfigured()) {
    return new Response(JSON.stringify({ error: "Billing is not configured" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  const subscription = await getSubscriptionByUserId(locals.user.id);
  if (!subscription?.stripeCustomerId) {
    return new Response(JSON.stringify({ error: "No billing account found" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const appUrl = import.meta.env.APP_URL || "http://localhost:4321";
  const session = await createBillingPortalSession({
    customerId: subscription.stripeCustomerId,
    returnUrl: `${appUrl}/dashboard/billing`,
  });

  return new Response(JSON.stringify({ url: session.url }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
