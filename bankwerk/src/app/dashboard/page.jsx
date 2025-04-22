"use client";
import { useState, useEffect } from "react";
import { CaretDown, CaretUp } from '@phosphor-icons/react';
import "../../styles/globals.css";

const convertTimestamp = (timestamp) => {
  if (timestamp && timestamp._seconds && timestamp._nanoseconds) {
    return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
  }
  return null;
};

export default function Dashboard() {
  const [solde, setSolde] = useState(null);
  const [crypto, setCrypto] = useState([]);
  const [transactionLogs, setTransactionLogs] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showMoreAchats, setShowMoreAchats] = useState(false);
  const [showMoreVentes, setShowMoreVentes] = useState(false);
  const [showMoreAutres, setShowMoreAutres] = useState(false);

  useEffect(() => {
    const fetchSolde = async () => {
      try {
        const userString = localStorage.getItem('user');

        if (!userString) {
          setIsLoggedIn(false);
          setLoading(false);
          return;
        }

        const user = JSON.parse(userString);
        const uid = user;

        if (!uid) {
          setIsLoggedIn(false);
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/balance?uid=${uid}`);
        if (!response.ok) throw new Error("Erreur de récupération des données");

        const data = await response.json();
        console.log("🧾 Transaction types:", data.transaction_log.map(t => t.type));

        setSolde(data.solde);
        setCrypto(data.crypto || []);
        setTransactionLogs(data.transaction_log || []);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("❌ Erreur dans fetchSolde:", error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    fetchSolde();
  }, []);

  if (loading) return <div>Chargement...</div>;

  if (!isLoggedIn) {
    return (
      <div className="container">
        <h1>Tableau de Bord</h1>
        <p>Vous devez être connecté pour voir votre solde.</p>
      </div>
    );
  }

  const normalizeType = (type) => type?.toLowerCase().trim();

  const achats = transactionLogs.filter(t => normalizeType(t.type).includes("achat"));
  const ventes = transactionLogs.filter(t => normalizeType(t.type).includes("vente"));
  const autres = transactionLogs.filter(t => {
    const type = normalizeType(t.type);
    return !type.includes("achat") && !type.includes("vente");
  });

  const renderItems = (items, showMore, setShowMore) => {
    const limitedItems = showMore ? items : items.slice(0, 10);
    return (
      <>
        {limitedItems.map((log, index) => (
          <div key={index} className="timeline-item">
            <p>{convertTimestamp(log.date_transa)?.toLocaleString()}</p>
            <p>{log.montant}€ - {log.rib_deb} ➢ {log.rib_cible}</p>
            {log.type && <p>{log.type}</p>}
          </div>
        ))}
        {items.length > 10 && (
          <button onClick={() => setShowMore(!showMore)} className="show-more-button">
            {showMore ? <CaretUp size={24} /> : <CaretDown size={24} />}
          </button>
        )}
      </>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-top">
        <h1>Tableau de Bord</h1>
        <p><strong>Solde :</strong> {solde} €</p>
        <div className="crypto-list">
          {crypto.length > 0 ? (
            crypto.map((item, index) => (
              <span key={index}>{item.nom} : {item.quantite}</span>
            ))
          ) : (
            <p>Rien</p>
          )}
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="dashboard-block">
          <h2>📥 Achats (Cryptos)</h2>
          {achats.length > 0 ? (
            renderItems(achats, showMoreAchats, setShowMoreAchats)
          ) : (
            <p>Rien</p>
          )}
        </div>

        <div className="dashboard-block">
          <h2>📤 Ventes (Cryptos)</h2>
          {ventes.length > 0 ? (
            renderItems(ventes, showMoreVentes, setShowMoreVentes)
          ) : (
            <p>Rien</p>
          )}
        </div>

        <div className="dashboard-block">
          <h2>🧾 Autres</h2>
          {autres.length > 0 ? (
            renderItems(autres, showMoreAutres, setShowMoreAutres)
          ) : (
            <p>Rien</p>
          )}
        </div>
      </div>
    </div>
  );
}
