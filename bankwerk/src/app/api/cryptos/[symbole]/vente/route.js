import { db } from '../../../../config/firebaseAdmin';

export async function POST(request) {
    try {
        const { symbole, montant, quantite, rib, uid } = await request.json();

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
        
        let cryptosPossedees = compteData.cryptos || [];
        const cryptoIndex = cryptosPossedees.findIndex(c => c.symbole === symbole);
        
        if (cryptoIndex === -1) {
            return new Response(JSON.stringify({ error: 'Ce compte ne possède pas cette cryptomonnaie' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        const quantitePossedee = parseFloat(cryptosPossedees[cryptoIndex].quantite);
        
        if (quantitePossedee < quantiteNum) {
            return new Response(JSON.stringify({ error: 'Quantité insuffisante' }), {
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

        const nouvelleQuantite = quantitePossedee - quantiteNum;
        
        if (nouvelleQuantite <= 0.00000001) {
            cryptosPossedees.splice(cryptoIndex, 1);
        } else {
            cryptosPossedees[cryptoIndex].quantite = parseFloat(nouvelleQuantite.toFixed(8));
        }
        
        batch.update(compteDoc.ref, {
            solde: parseFloat((compteData.solde + montantNum).toFixed(2)),
            cryptos: cryptosPossedees
        });

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
            message: `Vente de ${quantiteNum} ${symbole} effectuée avec succès`
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Erreur lors de la vente:', error);
        return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}