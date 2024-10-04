import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2022-11-15',
});

export default async function transfer(amount: number, curr: string, accoutID: string, transferGroup: string) {
    try {
        const transfer = await stripe.transfers.create({
            amount: amount,
            currency: curr,
            destination: accoutID, // -เอาจากเว็บ stripe ของแต่ละ account, -ถ้าพึ่งสร้างสามารถดึงจาก create_account.ts ได้
            transfer_group: transferGroup,
        });
        return transfer;

    } catch (err: any) {
        console.error('Transfer failed:', err);
        return { error: err.message };
    }
}
