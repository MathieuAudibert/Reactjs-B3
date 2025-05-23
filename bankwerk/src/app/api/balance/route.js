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
        const crypto = soldeDoc.data().cryptos || []

        const transactionsRef = db.collection('Transactions')

        
        const query1 = transactionsRef.where('id_compte', '==', uid)
        const snapshot1 = await query1.get()

        const transactionLog = []
        snapshot1.forEach(doc => transactionLog.push({ id: doc.id, ...doc.data() }))
        
        return new Response(JSON.stringify({ solde, rib, crypto, transaction_log: transactionLog }), {
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
