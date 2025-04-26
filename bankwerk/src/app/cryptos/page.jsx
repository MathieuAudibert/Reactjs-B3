"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CryptoPage() {
    const [cryptos, setCryptos] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [timer, setTimer] = useState(60)
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const router = useRouter()

    const fetchCryptos = async () => {
        try {
            const response = await fetch('/api/cryptos', {
                method: 'GET',
            })

            if (!response.ok) {
                throw new Error('Failed to fetch cryptos')
            }

            const data = await response.json()
            setCryptos(data)
            setIsLoading(false)
            setTimer(60)
            setIsButtonDisabled(true)
        } catch (error) {
            console.error('Error fetching cryptos:', error)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCryptos()

        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        setIsAuthenticated(!!token)

        if (token) {
            const interval = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer > 0) {
                        return prevTimer - 1
                    } else {
                        clearInterval(interval)
                        setIsButtonDisabled(false)
                        return 0
                    }
                })
            }, 1000)

            return () => clearInterval(interval)
        }
    }, [])

    const handleUpdateClick = () => {
        if (isAuthenticated) {
            setIsLoading(true)
            fetchCryptos()
        } else {
            router.push('/login')
        }
    }

    const handleDetailClick = (cryptoSymbole) => {
        if (isAuthenticated) {
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
            <h1>Les cryptomonnaies</h1>
            {isAuthenticated && (
                <button onClick={handleUpdateClick} disabled={isButtonDisabled} className='btn-blueDark'>
                    {isButtonDisabled ? `Mettre à jour dans ${timer}s` : 'Mettre à jour la collection'}
                </button>
            )}
            <div className="card-container">
                {cryptos.length > 0 ? (
                    cryptos.map((crypto, index) => (
                        <div className="card" key={index}>
                            <h3>{crypto.rang}</h3>
                            <img src={crypto.image} height="30" alt="" />
                            <h2>{crypto.nom} ({crypto.symbole})</h2>
                            <p>Prix: {crypto.prix.toFixed(2)}</p>
                            <p>Pourcentage 30j: {crypto.pourcent_30j.toFixed(2)}%</p>
                            <p>Dernière mise à jour: {new Date(crypto.derniere_update._seconds * 1000).toLocaleString()}</p>
                            <button
                                onClick={() => handleDetailClick(crypto.symbole)}
                                className="btn-blue"
                            >
                                Détail
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
