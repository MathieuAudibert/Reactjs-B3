"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CryptoTransactionPage({ params }) {
    const router = useRouter()
    const { symbole } = params || {}
    const [crypto, setCrypto] = useState(null)
    const [transactionType, setTransactionType] = useState('achat')
    const [montant, setAmount] = useState('')
    const [quantite, setQuantity] = useState('')
    const [userRib, setUserRib] = useState('')
    const [loading, setLoading] = useState(true)
    const [ribLoading, setRibLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [solde, setSolde] = useState(0)
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)
    const [cryptoData, setCryptoData] = useState(null)
    console.log("symbole: ", symbole)

    useEffect(() => {
        const fetchUserRib = async () => {
            try {
                const userString = localStorage.getItem('user')
                const uid = JSON.parse(userString)

                if (!uid) throw new Error('Utilisateur non connecté')

                const response = await fetch(`/api/balance?uid=${uid}`)
                if (!response.ok) throw new Error('Erreur lors de la récupération des données utilisateur')

                const data = await response.json()
                setUserRib(data.rib)
                setSolde(data.solde)
                for (let crypto of data.crypto) {
                    if (crypto.symbole == symbole) {
                        setCryptoData(crypto.quantite)
                    }
                }

                console.log("user", data)
            } catch (err) {
                console.error('Fetch RIB error:', err)
                setError(err.message || 'Erreur de récupération du RIB')
            } finally {
                setRibLoading(false)
            }
        }

        fetchUserRib()
    }, [])
    const posses = cryptoData ? parseFloat(cryptoData).toFixed(2) : 0

    useEffect(() => {
        const fetchCrypto = async () => {
            if (!symbole) {
                setError('Symbole de crypto manquant')
                setLoading(false)
                return
            }

            try {
                const res = await fetch(`/api/cryptos/${symbole}`)
                if (!res.ok) {
                    throw new Error('Erreur de récupération')
                }
                const data = await res.json()

                if (!data.symbole || !data.prix) {
                    throw new Error('Données de crypto invalides')
                }

                setCrypto(data)
            } catch (err) {
                console.error('Fetch error:', err)
                setError(err.message || 'Erreur de connexion')
            } finally {
                setLoading(false)
            }
        }

        fetchCrypto()
    }, [symbole])

    useEffect(() => {
        if (posses === null || posses === 0) {
            setIsButtonDisabled(true)
        } else {
            setIsButtonDisabled(false)
        }
    }, [cryptoData])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (!crypto || !crypto.symbole) {
            setError('Données de crypto manquantes')
            return
        }

        if (!userRib) {
            setError('RIB utilisateur non disponible')
            return
        }

        try {
            const endpoint = transactionType === 'achat'
                ? `/api/cryptos/${crypto.symbole}/achat`
                : `/api/cryptos/${crypto.symbole}/vente`

            const userString = localStorage.getItem('user')
            const uid = JSON.parse(userString)

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    symbole: crypto.symbole,
                    montant,
                    quantite,
                    rib: userRib,
                    uid
                })
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.error || 'Erreur de transaction')

            setSuccess(data.message)
            setTimeout(() => router.push('/dashboard'), 2000)
        } catch (err) {
            setError(err.message)
        }
    }

    if (loading || ribLoading) return <div className="loading">Chargement...</div>
    if (!crypto) return <div className="error">Cryptomonnaie non trouvée</div>

    return (
        <div className="container">
            <h1 className="title">
                {transactionType === 'achat' ? 'Acheter' : 'Vendre'} {crypto.nom} ({crypto.symbole})
            </h1>

            <div className="crypto-info">
                <div className="info-row">
                    <span className="label">En possession: </span>
                    <span className="value">{posses} {symbole}</span>
                </div>
                <div className="info-row">
                    <span className="label">Solde: </span>
                    <span className="value">{solde} €</span>
                </div>
                <div className="info-row">
                    <span className="label">Prix actuel:</span>
                    <span className="value">{parseFloat(crypto.prix).toFixed(2)} €</span>
                </div>
                <div className="info-row">
                    <span className="label">Variation 30j:</span>
                    <span className={`value ${crypto.pourcent_30j >= 0 ? 'positive' : 'negative'}`}>
                        {parseFloat(crypto.pourcent_30j).toFixed(2)}%
                    </span>
                </div>
                <div className="info-row">
                    <span className="label">Dernière mise à jour:</span>
                    <span className="value">
                        {new Date(crypto.derniere_update._seconds * 1000).toLocaleString()}
                    </span>
                </div>
            </div>

            <div className="transaction-toggle">
                <button
                    className={`toggle-btn ${transactionType === 'achat' ? 'active' : ''}`}
                    onClick={() => setTransactionType('achat')}
                >
                    Acheter
                </button>
                <button
                    className={`toggle-btn ${transactionType === 'vente' ? 'active' : ''}`}
                    onClick={() => setTransactionType('vente')}
                    disabled={isButtonDisabled}
                >
                    Vendre
                </button>
            </div>

            <form onSubmit={handleSubmit} className="transaction-form">
                <div className="form-group">
                    <label htmlFor="rib" className="form-label">Votre RIB:</label>
                    <input
                        id="rib"
                        type="text"
                        value={userRib}
                        className="form-input read-only-input"
                        readOnly
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="montant" className="form-label">Montant en €:</label>
                    <input
                        id="montant"
                        type="number"
                        value={montant}
                        onChange={(e) => {
                            setAmount(e.target.value)
                            if (e.target.value && crypto.prix) {
                                setQuantity((e.target.value / crypto.prix).toFixed(8))
                            }
                        }}
                        placeholder="Montant à investir"
                        className="form-input"
                        step="0.01"
                        min="0"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="quantite" className="form-label">Quantité de {crypto.symbole}:</label>
                    <input
                        id="quantite"
                        type="number"
                        value={quantite}
                        onChange={(e) => {
                            setQuantity(e.target.value)
                            if (e.target.value && crypto.prix) {
                                setAmount((e.target.value * crypto.prix).toFixed(2))
                            }
                        }}
                        placeholder={`Quantité de ${crypto.symbole}`}
                        className="form-input"
                        step="0.00000001"
                        min="0"
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-btn" disabled={transactionType === 'vente' && isButtonDisabled}>
                        {transactionType === 'achat' ? 'Acheter' : 'Vendre'} {crypto.symbole}
                    </button>
                    <button
                        type="button"
                        className="btn-blue"
                        onClick={() => router.back()}
                    >
                        Annuler
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
            </form>
        </div>
    )
}
