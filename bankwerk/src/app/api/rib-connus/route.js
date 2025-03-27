import { db } from '../../../config/firebaseAdmin';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const uid = searchParams.get('uid');
        
        if (!uid) {
            return new Response(JSON.stringify({ error: 'UID manquant' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const userDoc = await db.collection('Users').doc(uid).get();
        if (!userDoc.exists) {
            return new Response(JSON.stringify({ error: 'Utilisateur non trouvé' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const userData = userDoc.data();
        const ribs = userData.rib_connus || [];

        return new Response(JSON.stringify({ ribs }), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Erreur:', error);
        return new Response(JSON.stringify({ error: 'Erreur de récupération' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}