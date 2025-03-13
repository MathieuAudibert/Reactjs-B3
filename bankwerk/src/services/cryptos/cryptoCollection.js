const { auth, db } = require('../../config/firebaseAdmin.js');
const { topCryptos, cryptoInfosParSymbol } = require('./basics.js');

const cryptoCollection = db.collection('Crypto');

async function updateCryptoCollection() {
    const cryptos = await topCryptos();

    for (const cry of cryptos.data) {
        const specific_data = await cryptoInfosParSymbol(cry.symbol);
        const quoteEUR = specific_data.data[cry.symbol].quote.EUR;

        const data = {
            rang: cry.rank,
            nom: cry.name,
            symbole: cry.symbol,
            pourcent_30j: quoteEUR.percent_change_30d,
            prix: quoteEUR.price,
            derniere_update: new Date()
        };

        const cryptoDocs = await cryptoCollection.where('symbole', '==', cry.symbol).get();

        if (!cryptoDocs.empty) {
            const cryptoDoc = cryptoDocs.docs[0];
            await db.runTransaction(async (t) => {
                const doc = await t.get(cryptoDoc.ref);
                if (doc.exists) {
                    t.update(cryptoDoc.ref, data);
                }
            });
        } else {
            await cryptoCollection.add(data);
        }
    }

    console.log('Collection mise à jour');
}

setInterval(updateCryptoCollection, 15 * 60 * 1000); // 15min pour chaque mise à jour

updateCryptoCollection();
