const { auth, db } = require('../../config/firebase.js')
const { topCryptos, cryptoInfosParSymbol, cryptoInfosParNom } = require('./basics.js')

export async function GET(req) {
    const cryptos = db.collection('Crypto').get();

    
}