require('dotenv').config()

const axios = require('axios')
const api_key = process.env.CRYPTO_API_KEY
let res

const topCryptos = async () => {
    /** Recupere les 10 cryptos les plus populaires (en fonction de leur capitalisation)
     * 
     * Args : 
     * 
     * Returns : 
     * data (dict) : liste des cryptos
     */
    try {
        res = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=10&CMC_PRO_API_KEY=${api_key}&sort=cmc_rank`)
        return { data: res.data.data, error: null}
    } catch (error) {
        console.error(error) 
        return { data: null, error: error.message }
    }
}

const cryptoInfosParSymbol = async (symbol) => {
    /** Renvoie les informations d'une crypto en fonction de son symbole
     * 
     * Args :
     * symbol (str) : abréviation du nom de la crypto utilisé pour les transactions
     * 
     * Returns : 
     * infos (dict) : infos de la crypto
     */
    try {  
        res = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/airdrops?symbol=${symbol}&CMC_PRO_API_KEY=${api_key}`)
        return { data: res.data.data, error: null }
    } catch (error) {
        console.error(error)
        return { data: null, error: error.message }
    }
}

const cryptoInfosParNom = async (nom) => {
    /** Renvoie les informations d'une crypto en fonction de son nom
     * 
     * Args : 
     * nom (str)
     * 
     * Returns : 
     * infos (dict) : infos de la crypto
     */
}