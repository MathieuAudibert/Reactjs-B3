import { db } from '../../../../config/firebaseAdmin'

export async function GET(request, { params }) {
    try {
        const resolvedParams = await params
        const symbole = resolvedParams.symbole
        
        if (!symbole) {
            return new Response(JSON.stringify({ error: 'Symbole manquant' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }

        const cryptosRef = db.collection('Cryptos')
        const querySnapshot = await cryptosRef
            .where('symbole', '==', symbole)
            .limit(1)
            .get()
        
        if (querySnapshot.empty) {
            return new Response(JSON.stringify({ error: 'Crypto non trouvée' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }
        
        const cryptoDoc = querySnapshot.docs[0]
        const cryptoData = cryptoDoc.data()
        const id = cryptoDoc.id
        
        return new Response(JSON.stringify({ id, ...cryptoData }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch (error) {
        console.error('Erreur API détaillée:', error.message, error.stack)
        return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}