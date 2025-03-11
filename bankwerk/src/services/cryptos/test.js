const { topCryptos, symbolParNom, cryptoInfosParSymbol, cryptoInfosParNom } = require('./basics.js');

async function test(description, callback) {
    console.log(`test: ${description}`);
    try {
        await callback();
        console.log('✅ test OK');
    } catch (error) {
        console.error('❌ test KO:', error.message);
    }
    console.log('-------------------------------------------------------------------------------------------------------------------------------------');
}

(async () => {
    await test('topCryptos', async () => {
        const result = await topCryptos();
        if (!result.data || result.error) {
            throw new Error('Erreur');
        }
        console.log('Top 10 Cryptos:', result.data);
    });

    
    await test('symbolParNom', async () => {
        const result = await symbolParNom('Bitcoin');
        if (!result.symbol || result.error) {
            throw new Error('Erreur');
        }
        console.log('Symbole pour Bitcoin:', result.symbol);
    });

    await test('cryptoInfosParSymbol', async () => {
        const result = await cryptoInfosParSymbol('BTC');
        if (!result.data || result.error) {
            throw new Error('Erreur');
        }
        console.log('Infos pour BTC:', result.data);
    });

    await test('cryptoInfosParNom', async () => {
        const result = await cryptoInfosParNom('Ethereum');
        if (!result.data || result.error) {
            throw new Error('Erreur');
        }
        console.log('Infos pour Ethereum:', result.data);
    });
})();