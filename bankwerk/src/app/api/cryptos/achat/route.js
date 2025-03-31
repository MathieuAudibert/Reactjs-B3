import { db } from '../../../config/firebaseAdmin'
import { doc, getDoc, setDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore'

export async function POST(request) {
    try {
        const { cryptoId, amount, quantity, rib } = await request.json()

        const cryptoDoc = await getDoc(doc(db, 'Cryptos', cryptoId))
        if (!cryptoDoc.exists()) {
            return new Response(JSON.stringify({ error: 'Crypto non trouvée' }), {
                status: 404
            })
        }

        const crypto = cryptoDoc.data()
        const quantiteFinale = amount ? amount / crypto.prix : parseFloat(quantity)
        const montantFinal = amount ? parseFloat(amount) : parseFloat(quantity) * crypto.prix

        const compteDoc = await getDoc(doc(db, 'Comptes', userDoc.data().compteId))
        if (compteDoc.data().solde < montantFinal) {
            return new Response(JSON.stringify({ error: 'Solde insuffisant' }), {
                status: 400
            })
        }

        const transactionRef = doc(db, 'Transactions', `${cryptoId}_${Date.now()}`)
        await setDoc(transactionRef, {
            rib_cible: 'BWK92-00000000',
            rib_deb: rib,
            id_compte: userDoc.data().compteId,
            date_transa: new Date(),
            montant: montantFinal,
            type: 'achat',
            details: {
                id_crypto: cryptoId,
                nombre_crypto: quantiteFinale,
                prix_unite_crypto: crypto.prix,
                nom_crypto: crypto.nom,
                symbole_crypto: crypto.symbole
            }
        })

        await Promise.all([
            updateDoc(doc(db, 'Comptes', 'BWK92-00000000'), {
                solde: increment(montantFinal)
            }),
            updateDoc(doc(db, 'Comptes', userDoc.data().compteId), {
                solde: increment(-montantFinal),
                cryptos: arrayUnion({
                    date_achat: new Date(),
                    quantite: quantiteFinale,
                    nom_crypto: crypto.nom,
                    montant: montantFinal,
                    id_crypto: cryptoId,
                    prix_achat: crypto.prix
                })
            })
        ])

        return new Response(JSON.stringify({ 
            message: 'Achat effectué avec succès' 
        }))
    } catch (error) {
        return new Response(JSON.stringify({ 
            error: error.message || 'Erreur lors de l\'achat' 
        }), {
            status: 500
        })
    }
}