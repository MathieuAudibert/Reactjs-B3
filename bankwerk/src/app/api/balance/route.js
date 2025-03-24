import { db } from '../../../config/firebaseAdmin'

export async function GET(req) {
    try {
        const accountId = req.session.get('accountId');
        if (!accountId) {
            return new Response(JSON.stringify({ error: 'Non connecté' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } 
        
        const accountDoc = await db.collection('Compte').doc(accountId).get();
        const solde = accountDoc.data().solde; 

        return new Response(JSON.stringify({ solde }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
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