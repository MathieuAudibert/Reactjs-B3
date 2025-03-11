require('dotenv').config()

const axios = require('axios')
const api_key = process.env.CRYPTO_API_KEY
let res

async function topCryptos() {
    /** Recupere les 10 cryptos les plus populaires (en fonction de leur capitalisation)
     * 
     * Args : 
     * 
     * Returns : 
     * data (dict) : liste des cryptos
     */
    try {
        res = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=10&CMC_PRO_API_KEY=${api_key}&sort=cmc_rank`)
        return { data: res.data.data, error: null }
    } catch (error) {
        console.error(error) 
        return { data: null, error: error.message }
    }
}

async function cryptoInfosParSymbol(symbol) {
    /** Renvoie les informations d'une crypto en fonction de son symbole
     * 
     * Args :
     * symbol (str) : abréviation du nom de la crypto utilisé pour les transactions
     * 
     * Returns : 
     * infos (dict) : infos de la crypto
     */
    try {  
        res = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}&CMC_PRO_API_KEY=${api_key}`)
        return { data: res.data.data, error: null }
    } catch (error) {
        console.error(error)
        return { data: null, error: error.message }
    }
}
