require('dotenv').config()

const axios = require('axios')
const api_key = process.env.CRYPTO_API_KEY
let res = null

const topCryptos = async () => {
    /** Recupere les 10 cryptos les plus populaires (en fonction de leur capitalisation)
     * 
     * Args : 
     * 
     * Returns : 
     * liste (dict)
     */
    try {
        res = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=10&CMC_PRO_API_KEY=${api_key}`)
        return res.data.data
    } catch (error) {
        console.error(error) 
    }
}

const cryptoInfos = async (symbol) => {
    
}