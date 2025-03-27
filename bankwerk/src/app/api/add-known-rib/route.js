import { db, FieldValue } from '../../../config/firebaseAdmin'

export async function POST(req) {
    try {
        const { uid, newRib } = await req.json()
        
        if (!uid || !newRib) {
            return new Response(JSON.stringify({ error: 'Données manquantes' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        const ribCheck = await db.collection('Compte')
            .where('rib', '==', newRib)
            .limit(1)
            .get()

        if (ribCheck.empty) {
            return new Response(JSON.stringify({ error: 'RIB invalide' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        const compteRef = db.collection('Compte').doc(uid)
        
        await compteRef.set({
            rib_connus: FieldValue.arrayUnion(newRib)
        }, { merge: true })

        return new Response(JSON.stringify({ 
            success: true,
            rib: newRib
        }), {
            headers: { 'Content-Type': 'application/json' },
        })

    } catch (error) {
        console.error('Erreur:', error)
        return new Response(JSON.stringify({ error: 'Erreur lors de l\'ajout' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
}