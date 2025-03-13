const axios = require('axios')
const api_key = require('./config.json').api_key
let res

async function topCryptos () {
    /** Recupere les 10 cryptos les plus populaires (en fonction de leur capitalisation)
     * 
     * Args : 
     * 
     * Returns : 
     * data (dict) : liste des cryptos
     */
    try {
        res = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?limit=10&CMC_PRO_API_KEY=${api_key}&sort=cmc_rank`)
        return { data: res.data.data, error: null }
    } catch (error) {
        console.error(error) 
        return { data: null, error: error.message }
    }
}

async function symbolParNom (nom) {
    /** Recupere le symbole d'une crypto en fonction de son nom
     * 
     * Args :
     * nom (str) : le string rentré par l'user 
     * 
     * Returns : 
     * symbol (str) : symbole relié a la crypto
     */
    try {
        res = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?CMC_PRO_API_KEY=${api_key}`)
        const crypto = res.data.data.find(c => c.name.toLowerCase() === nom.toLowerCase())
        
        if (!crypto) {
            return { symbol: null, error: 'Pas de crypto trouvé avec ce nom'}
        } else {
            return { symbol: crypto.symbol, error: null }
        }

    } catch (error) {
        console.error(error)
        return { data: null, error: error.message }
    }
}

async function cryptoInfosParSymbol (symbol) {
    /** Renvoie les informations d'une crypto en fonction de son symbole
     * 
     * Args :
     * symbol (str) : abréviation du nom de la crypto utilisé pour les transactions
     * 
     * Returns : 
     * infos (dict) : infos de la crypto
     */
    try {  
        res = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}&convert=EUR&CMC_PRO_API_KEY=${api_key}`)
        return { data: res.data.data, error: null }
    } catch (error) {
        console.error(error)
        return { data: null, error: error.message }
    }
}

async function cryptoInfosParNom (nom){
    /** Renvoie les informations d'une crypto en fonction de son nom
         * 
         * Args :
         * nom (str)
         * 
         * Returns : 
         * infos (dict) : infos de la crypto
         */
    try {
        const symbolResult = await symbolParNom(nom);
        if (symbolResult.error) {
            throw new Error(symbolResult.error);
        }
        const res = await cryptoInfosParSymbol(symbolResult.symbol);
        return { data: res.data, error: null };
    } catch (error) {
        console.error(error)
        return { data: null, error: error.message }
    }
}

module.exports = {
    topCryptos,
    symbolParNom,
    cryptoInfosParSymbol,
    cryptoInfosParNom
};
