import Stripe from 'stripe';

export async function onRequestPost(context) {
  const { request, env } = context;
  
  if (!env.STRIPE_SECRET_KEY) {
    return new Response(JSON.stringify({ error: "Missing Stripe API Key" }), { status: 500 });
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  
  try {
    const { cartItems } = await request.json();
    
    if (!cartItems || cartItems.length === 0) {
      return new Response(JSON.stringify({ error: "Empty cart" }), { status: 400 });
    }

    // Fetch all products to map IDs to Stripe price_ids
    const { results: products } = await env.DB.prepare("SELECT * FROM products").all();
    
    const line_items = [];
    
    for (const item of cartItems) {
      const product = products.find(p => p.id === item.id);
      if (product && product.price_id) {
        line_items.push({
          price: product.price_id,
          quantity: item.quantity
        });
      }
    }
    
    if (line_items.length === 0) {
       return new Response(JSON.stringify({ error: "No valid items found in cart" }), { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      success_url: `${new URL(request.url).origin}/?status=success`,
      cancel_url: `${new URL(request.url).origin}/?status=canceled`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { "content-type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
