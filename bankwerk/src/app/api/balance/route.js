import { db } from '../../../config/firebaseAdmin'
import { NextRequest } from 'next/server'

export async function GET(req) {
    try {
        const uid = req.nextUrl.searchParams.get('uid');
        
        if (!uid) {
            return new Response(JSON.stringify({ error: 'UID manquant' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
        
        const accountSnapshot = await db.collection('Compte')
            .where('uid', '==', uid)
            .get();
        
        if (accountSnapshot.empty) {
            return new Response(JSON.stringify({ error: 'Compte non trouvé' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
        
        const accountDoc = accountSnapshot.docs[0];
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