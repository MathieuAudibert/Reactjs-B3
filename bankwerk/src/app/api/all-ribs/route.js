import { db } from '../../../config/firebaseAdmin'

export async function GET() {
    try {
        const snapshot = await db.collection('Compte').get()
        const ribs = snapshot.docs.map(doc => {
            const data = doc.data()
            return {
                rib: data.rib,
                solde: data.solde,
            }
        })

        return new Response(JSON.stringify({ ribs }), {
            headers: { 'Content-Type': 'application/json' },
        })

    } catch (error) {
        console.error('Erreur lors de la récupération des RIBs:', error)
        return new Response(JSON.stringify({ error: 'Erreur lors de la récupération' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
}