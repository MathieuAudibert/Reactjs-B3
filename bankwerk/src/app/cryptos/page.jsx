"use client";
import React, { useEffect, useState } from 'react';

const Cryptos = () => {
    const [cryptos, setCryptos] = useState([]);

    useEffect(() => {
        const fetchCryptos = async () => {
            const response = await fetch('/api/cryptos');
            const data = await response.json();
            setCryptos(data);
        };

        fetchCryptos();
    }, []);

    return (
        <div className="container">
            <h1>Les cryptos</h1>
            <div className="card-container">
                {cryptos.map((crypto, index) => (
                    <div className="card" key={index}>
                        <h2>{crypto.nom} ({crypto.symbole})</h2>
                        <p>Rang: {crypto.rang}</p>
                        <p>Prix: {crypto.prix}</p>
                        <p>Pourcentage 30j: {crypto.pourcent_30j}%</p>
                        <p>Dernière mise à jour: {new Date(crypto.derniere_update._seconds * 1000).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Cryptos;