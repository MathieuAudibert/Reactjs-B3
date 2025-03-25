import { db } from '../../../config/firebaseAdmin';

export async function POST(req) {
    try {
        const { rib_cible, rib_deb, montant, type } = await req.json();
        
        if (!rib_cible || !rib_deb || !montant || !type) {
            return new Response(JSON.stringify({ error: 'Tous les champs sont obligatoires' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (montant <= 0) {
            return new Response(JSON.stringify({ error: 'Le montant doit être positif' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const compteSourceSnapshot = await db.collection('Compte')
            .where('rib', '==', rib_deb)
            .limit(1)
            .get();

        const compteDestSnapshot = await db.collection('Compte')
            .where('rib', '==', rib_cible)
            .limit(1)
            .get();

        if (compteSourceSnapshot.empty || compteDestSnapshot.empty) {
            return new Response(JSON.stringify({ error: 'Un des comptes est introuvable' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const compteSourceDoc = compteSourceSnapshot.docs[0];
        const compteDestDoc = compteDestSnapshot.docs[0];

        const compteSourceData = compteSourceDoc.data();
        const compteDestData = compteDestDoc.data();

        if (compteSourceData.solde < montant) {
            return new Response(JSON.stringify({ error: 'Solde insuffisant' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        await db.collection('Transactions').doc().set({
            rib_cible: rib_cible,
            rib_deb: rib_deb,
            id_compte: compteSourceDoc.id,
            date_transa: new Date(),
            montant: montant,
            type: type,
            details: {
                id_crypto: '',
                nombre_crypto: '',
                prix_unite_crypto: '',
            },
        });

        await db.collection('Compte').doc(compteSourceDoc.id).update({
            solde: compteSourceData.solde - montant,
        });

        await db.collection('Compte').doc(compteDestDoc.id).update({
            solde: compteDestData.solde + montant,
        });

        return new Response(JSON.stringify({ 
            message: 'Transaction effectuée avec succès',
            nouveauSoldeSource: compteSourceData.solde - montant,
            nouveauSoldeDest: compteDestData.solde + montant
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Erreur lors de la transaction:', error);
        return new Response(JSON.stringify({ error: 'Erreur lors de la transaction' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}