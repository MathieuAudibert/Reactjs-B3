const { auth, db } = require('../../config/firebase.js');
const { topCryptos, cryptoInfosParSymbol, cryptoInfosParNom } = require('../../services/cryptos/basics.js');

export async function GET(req) {
    try {
        const crypto = await db.collection('Crypto').get();
        const cryptos = crypto.docs.map(doc => doc.data());
        return new Response(JSON.stringify(cryptos), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des cryptomonnaies:', error);
        return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
