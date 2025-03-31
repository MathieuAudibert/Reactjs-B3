"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CryptoTransactionPage({ params }) {
    const router = useRouter()
    const { symbole } = params
    const [crypto, setCrypto] = useState(null)
    const [transactionType, setTransactionType] = useState('achat')
    const [montant, setAmount] = useState('')
    const [quantite, setQuantity] = useState('')
    const [rib, setRib] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        const fetchCrypto = async () => {
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
    
        if (symbole) { 
            fetchCrypto()
        } else {
            setError('Symbole de crypto manquant')
            setLoading(false)
        }
    }, [symbole])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (!crypto || !crypto.symbole) {
            setError('Données de crypto manquantes')
            return
        }

        try {
            const endpoint = transactionType === 'achat' 
                ? '/api/cryptos/achat' 
                : '/api/cryptos/vente'
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    symbole: crypto.symbole, 
                    montant,
                    quantite,
                    rib
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

    if (loading) return <div className="loading">Chargement...</div>
    if (!crypto) return <div className="error">Cryptomonnaie non trouvée</div>

    return (
        <div className="container">
            <h1 className="title">
                {transactionType === 'achat' ? 'Acheter' : 'Vendre'} {crypto.nom} ({crypto.symbole})
            </h1>
            
            <div className="crypto-info">
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
                >
                    Vendre
                </button>
            </div>

            <form onSubmit={handleSubmit} className="transaction-form">
                <div className="form-group">
                    <label htmlFor="rib" className="form-label">RIB:</label>
                    <input
                        id="rib"
                        type="text"
                        value={rib}
                        onChange={(e) => setRib(e.target.value)}
                        placeholder="Entrez votre RIB"
                        className="form-input"
                        required
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
                    <button type="submit" className="submit-btn">
                        {transactionType === 'achat' ? 'Acheter' : 'Vendre'} {crypto.symbole}
                    </button>
                    <button 
                        type="button" 
                        className="cancel-btn"
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
