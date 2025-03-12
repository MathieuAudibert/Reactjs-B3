import { db } from '../../../config/firebaseAdmin';

export async function GET() {
    try {
        const cryptoSnapshot = await db.collection('Crypto').get();
        const cryptos = cryptoSnapshot.docs.map(doc => doc.data());

        return new Response(JSON.stringify(cryptos), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error fetching cryptos:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch cryptos' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}