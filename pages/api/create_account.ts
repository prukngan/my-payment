import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2022-11-15',
});

export default async function createConnectedAccount(email: string) {
    try {
        const account = await stripe.accounts.create({
            type: 'express',
            country: 'US',
            email: email,
            capabilities: {
                transfers: { requested: true },
            },
        });

        // console.log('Connected Account ID:', account.id);
        return account.id;
    } catch (err) {
        console.error('Error creating account:', err);
        return null;
    }
}