import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Log the request body to verify its structure
      console.log('Request Body:', req.body);

      const { body } = req;

      if (!body || !Array.isArray(body)) {
        console.error('Invalid request body:', body);
        return res.status(400).json({ error: 'Invalid request body' });
      }

      const lineItems = body.map((item) => {
        if (!item.title || !item.price || !item.quantity) {
          throw new Error('Missing required fields in cart items');
        }
        return {
          price_data: {
            currency: 'inr',
            product_data: {
              name: item.title,
            },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
            maximum: 10,
          },
        };
      });

      const params = {
        submit_type: 'pay',
        mode: 'payment',
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        invoice_creation: {
          enabled: true,
        },
        line_items: lineItems,
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/canceled',
      };

      const session = await stripe.checkout.sessions.create(params);

      return res.status(200).json({ session });
    } catch (err) {
      console.error('Error creating checkout session:', err);
      return res.status(err.statusCode || 500).json({ error: err.message });
    }
  } else {
    res.status(405).end('Method Not Allowed');
  }
}
