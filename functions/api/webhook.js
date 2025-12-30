import Stripe from 'stripe';

export async function onRequestPost(context) {
  const { request, env } = context;
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  const signature = request.headers.get('stripe-signature');

  // We need the raw body for signature verification
  const body = await request.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // TODO: Reduce stock in D1
    // const { results } = await env.DB.prepare("UPDATE products SET stock = stock - 1 WHERE ...").run();
    console.log("Order completed:", session.id);
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "content-type": "application/json" }
  });
}
