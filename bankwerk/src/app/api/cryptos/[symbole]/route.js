import { db } from '../../../../config/firebaseAdmin'
import { collection, query, where, getDocs, limit } from 'firebase/firestore'

export async function GET(request, { params }) {
    try {
        const { id: symbole } = params
        
        if (!symbole) {
            return new Response(JSON.stringify({ error: 'Symbole manquant' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }
        
        const cryptosRef = collection(db, 'Cryptos')
        const q = query(
            cryptosRef,
            where('symbole', '==', symbole),
            limit(1)
        )
        
        const querySnapshot = await getDocs(q)
        
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
        console.error('Erreur API:', error)
        return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}