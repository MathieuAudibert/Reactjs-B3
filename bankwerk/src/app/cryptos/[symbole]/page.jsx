"use client"
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import TransactionToggle from '@/components/Transac/TransacToggle'
import TransactionForm from '@/components/Transac/TransacForms'
import CryptoInfoPanel from '@/components/Crypto/CryptoPanel'

export default function CryptoTransactionPage() {
    const router = useRouter()
    const { symbole } = useParams()
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
      
          <CryptoInfoPanel
            crypto={crypto}
            symbole={symbole}
            posses={posses}
            solde={solde}
          />
      
          <TransactionToggle
            transactionType={transactionType}
            setTransactionType={setTransactionType}
            isButtonDisabled={isButtonDisabled}
          />
      
          <TransactionForm
            transactionType={transactionType}
            crypto={crypto}
            userRib={userRib}
            montant={montant}
            setAmount={setAmount}
            quantite={quantite}
            setQuantity={setQuantity}
            handleSubmit={handleSubmit}
            handleCancel={() => router.back()}
            isButtonDisabled={isButtonDisabled}
            error={error}
            success={success}
          />
        </div>
      )
      
}
