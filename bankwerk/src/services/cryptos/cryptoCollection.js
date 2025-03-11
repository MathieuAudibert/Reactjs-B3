const { auth, db } = require('../../config/firebase.js')
const { topCryptos, cryptoInfosParSymbol } = require('./basics.js')

cryptoCollection = db.collection('Crypto')

async function updateCryptoCollection() {
    const cryptos = await topCryptos()

    for (const cry of cryptos.data) {
        const specific_data = await cryptoInfosParSymbol(cry.symbol)
        const quoteEUR = specific_data.data[cry.symbol].quote.EUR

        const data = {
            rang: cry.rank,
            nom: cry.name,
            symbole: cry.symbol,
            pourcent_30j: quoteEUR.percent_change_30d,
            prix: quoteEUR.price,
            derniere_update: new Date()
        }

        const cryptoDocs = await cryptoCollection.where('symbol', '==', cry.symbol).get()

        if (!cryptoDocs.empty) {
            const cryptoDoc = cryptoDocs.docs[0]
            await cryptoDoc.ref.update(data)
        } else {
            await cryptoCollection.add(data)
        }
    }

    console.log('Collection mise à jour')
}

setInterval(updateCryptoCollection, 15 * 60 * 1000) // 15min pr chaque update

updateCryptoCollection()