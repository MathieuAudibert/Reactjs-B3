require('dotenv').config()

const axios = require('axios')
const api_key = process.env.CRYPTO_API_KEY
let res = null

const prixCrypto = async (symbol) => {
    try {
        res = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}&convert=EUR&CMC_PRO_API_KEY=${api_key}`)
        return res.data[0].price
    } catch (error) {
        console.error(error)
    }
}