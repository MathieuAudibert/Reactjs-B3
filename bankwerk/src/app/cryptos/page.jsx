"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CryptoPage() {
    const [cryptos, setCryptos] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchCryptos = async () => {
            try {
                const response = await fetch('/api/cryptos', {
                    method: 'GET',
                })

                if (!response.ok) {
                    throw new Error('Failed to fetch cryptos')
                }

                const data = await response.json()
                console.log('Fetched cryptos:', data) 
                setCryptos(data)
                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching cryptos:', error)
                setIsLoading(false)
            }
        }

        fetchCryptos()
    }, [])

    const handleBuyClick = (cryptoSymbole) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        
        if (token) {
            router.push(`/cryptos/${cryptoSymbole}`)
        } else {
            router.push('/login')
        }
    }

    if (isLoading) {
        return <div className="container">Loading...</div>
    }

    return (
        <div className="container">
            <h1>Les cryptos</h1>
            <div className="card-container">
                {cryptos.length > 0 ? (
                    cryptos.map((crypto, index) => (
                        <div className="card" key={index}>
                            <h2>{crypto.nom} ({crypto.symbole})</h2>
                            <p>Rang: {crypto.rang}</p>
                            <p>Prix: {crypto.prix}</p>
                            <p>Pourcentage 30j: {crypto.pourcent_30j}%</p>
                            <p>Dernière mise à jour: {new Date(crypto.derniere_update._seconds * 1000).toLocaleString()}</p>
                            <button 
                                onClick={() => handleBuyClick(crypto.symbole)}
                                className="buy-button"
                            >
                                Acheter
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Aucune crypto trouvée.</p>
                )}
            </div>
        </div>
    )
}