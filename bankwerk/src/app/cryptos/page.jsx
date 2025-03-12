"use client";
import { useState, useEffect } from 'react';

export default function CryptoPage() {
    const [cryptos, setCryptos] = useState([]);

    useEffect(() => {
        const fetchCryptos = async () => {
            try {
                const response = await fetch('/api/cryptos', {
                    method: 'GET',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch cryptos');
                }

                const data = await response.json();
                console.log('Fetched cryptos:', data); 
                setCryptos(data);
            } catch (error) {
                console.error('Error fetching cryptos:', error);
            }
        };

        fetchCryptos();
    }, []);

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
                        </div>
                    ))
                ) : (
                    <p>No cryptos found.</p>
                )}
            </div>
        </div>
    );
}