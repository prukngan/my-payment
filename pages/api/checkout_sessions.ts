import { NextApiRequest as Req, NextApiResponse as Res} from 'next';
import { v4 as uuidv4 } from 'uuid'
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2022-11-15',
});

// export default async function handler(name: string, price: number, quantity: number): Promise<any> {
export default async function handler(req: Req, res: Res): Promise<void> {
    const { product, information } = req.body;

    if (req.method === 'POST') {
    try {
        // Create Checkout Sessions from body params.
        const orderId = uuidv4();
        const session = await stripe.checkout.sessions.create({
        line_items: [
            {
            price_data: {
                currency: 'thb',
                product_data: {
                name: 'test'//product.name,
                },
                unit_amount: 300 * 100 //product.price * 100,
            },
            quantity: 1 //product.quantity,
            },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
        });

        res.redirect(303, session.url as string);

        // console.log("session", session);

        // // use for send to data base
        // const data = {
        //     name: information.name,
        //     session_id: session.id,
        //     status: session.status,
        //     order_id: orderId,
        // };

        res.json({
            message: "Checkout success.",
            id: session.id,
        });
    
    } catch (err) {
        res.status(err.statusCode || 500).json(err.message);
    }
    } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    }
}