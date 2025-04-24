import { db } from '../../../config/firebaseAdmin'
import { updateCryptoCollection } from '../../../services/cryptos/cryptoCollection'
export async function GET() {
    try {
        updateCryptoCollection()
        const cryptoSnapshot = await db.collection('Crypto').orderBy('rang', 'asc').get()
        const cryptos = cryptoSnapshot.docs.map(doc => doc.data())

        return new Response(JSON.stringify(cryptos), {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    } catch (error) {
        console.error('Error fetching cryptos:', error)
        return new Response(JSON.stringify({ error: 'Failed to fetch cryptos' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
}