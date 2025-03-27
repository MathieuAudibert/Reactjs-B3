import { db } from '../../../config/firebaseAdmin'

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url)
        const uid = searchParams.get('uid')
        
        if (!uid) {
            return new Response(JSON.stringify({ error: 'UID manquant' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        }

        const soldeDoc = await db.collection('Compte').doc(uid).get()

        if (!soldeDoc.exists) {
            return new Response(JSON.stringify({ error: 'Compte inexistant' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
            })  
        }
        
        const solde = soldeDoc.data().solde
        const rib = soldeDoc.data().rib
        return new Response(JSON.stringify({ solde, rib }), {
            headers: {
                'Content-Type': 'application/json',
            },
        })

    } catch (error) {
        console.error('Erreur dans la recup du solde:', error)
        return new Response(JSON.stringify({ error: 'Erreur recup du solde' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
}