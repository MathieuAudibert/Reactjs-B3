import { db } from '../../../../../config/firebaseAdmin';

export async function POST(request, { params }) {
    try {
        const { symbole } = params;
        console.log('symbole:', symbole);
        const { montant, quantite, rib, uid } = await request.json();

        if (!symbole || !montant || !quantite || !rib || !uid) {
            return new Response(JSON.stringify({ error: 'Données manquantes' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const montantNum = parseFloat(montant);
        const quantiteNum = parseFloat(quantite);

        if (isNaN(montantNum) || isNaN(quantiteNum) || montantNum <= 0 || quantiteNum <= 0) {
            return new Response(JSON.stringify({ error: 'Montant ou quantité invalide' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const compteSnapshot = await db.collection('Compte')
            .where('rib', '==', rib)
            .limit(1)
            .get();

        if (compteSnapshot.empty) {
            return new Response(JSON.stringify({ error: 'Compte non trouvé' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const compteDoc = compteSnapshot.docs[0];
        const compteData = compteDoc.data();

        if (compteData.cryptos.quantite < quantite) {
            return new Response(JSON.stringify({ error: 'Pas assez de crypto' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const cryptosSnapshot = await db.collection('Crypto')
            .where('symbole', '==', symbole)
            .limit(1)
            .get();

        if (cryptosSnapshot.empty) {
            return new Response(JSON.stringify({ error: 'Crypto non trouvée' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const cryptoDoc = cryptosSnapshot.docs[0];
        const cryptoData = cryptoDoc.data();
        const prixUnite = parseFloat(cryptoData.prix);

        const prixCalcule = quantiteNum * prixUnite;
        if (Math.abs(prixCalcule - montantNum) > 0.01) {
            return new Response(JSON.stringify({
                error: 'Le prix a changé, veuillez actualiser la page'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const batch = db.batch();

        batch.update(compteDoc.ref, {
            solde: parseFloat((compteData.solde + montantNum).toFixed(2))
        });

        let cryptosPossedees = compteData.cryptos || [];
        const cryptoExistanteIndex = cryptosPossedees.findIndex(c => c.symbole === symbole);

        if (cryptoExistanteIndex >= 0) {
            cryptosPossedees[cryptoExistanteIndex].quantite =
                parseFloat((parseFloat(cryptosPossedees[cryptoExistanteIndex].quantite) - quantiteNum).toFixed(8));
        } else {
            cryptosPossedees.push({
                symbole,
                quantite: quantiteNum,
                nom: cryptoData.nom
            });
        }

        batch.update(compteDoc.ref, { cryptos: cryptosPossedees });

        const transactionRef = db.collection('Transactions').doc();
        batch.set(transactionRef, {
            rib_cible: rib,
            rib_deb: "BWK92-00000000",
            id_compte: compteDoc.id,
            date_transa: new Date(),
            montant: montantNum,
            type: 'vente de cryptos',
            details: {
                id_crypto: cryptoDoc.id,
                nombre_crypto: quantiteNum,
                prix_unite_crypto: prixUnite,
                symbole_crypto: symbole
            },
            statut: 'completed'
        });

        await batch.commit();

        return new Response(JSON.stringify({
            message: `Vente de ${quantiteNum} ${symbole} effectué avec succès`
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Erreur lors de l\'achat:', error);
        return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}