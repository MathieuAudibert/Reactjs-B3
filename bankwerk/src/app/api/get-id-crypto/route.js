import { db } from '../../../config/firebaseAdmin'
import { doc, getDoc } from 'firebase/firestore'

export async function GET(request, { params }) {
    try {
        const { id } = params
        const docRef = doc(db, 'Cryptos', id)
        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {
            return new Response(JSON.stringify({ error: 'Crypto non trouvée' }), {
                status: 404
            })
        }

        const crypto = { id: docSnap.id, ...docSnap.data() }
        return new Response(JSON.stringify(crypto))
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
            status: 500
        })
    }
}