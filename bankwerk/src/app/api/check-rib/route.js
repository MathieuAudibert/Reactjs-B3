import { db } from '../../../config/firebaseAdmin'

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url)
        const rib = searchParams.get('rib')
        
        if (!rib) {
            return new Response(JSON.stringify({ error: 'RIB manquant' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        const snapshot = await db.collection('Compte')
            .where('rib', '==', rib)
            .limit(1)
            .get()

        return new Response(JSON.stringify({ 
            exists: !snapshot.empty,
            rib: rib
        }), {
            headers: { 'Content-Type': 'application/json' },
        })

    } catch (error) {
        console.error('Erreur:', error)
        return new Response(JSON.stringify({ error: 'Erreur de vérification' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
}