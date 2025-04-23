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
  const [rib, setRib] = useState(null);

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
        console.log("tab", data.transaction_log)

        setSolde(data.solde);
        setCrypto(data.crypto || []);
        setRib(data.rib);
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

  const renderItems = (items, showMore, setShowMore, isAchatVente = false) => {
    const limitedItems = showMore ? items : items.slice(0, 4);
    return (
      <>
        {limitedItems.map((log, index) => (
          <div key={index} className="timeline-item">
            <p>{convertTimestamp(log.date_transa)?.toLocaleString()}</p>
            {isAchatVente ? (
              <>
                <h1>{log.details.symbole_crypto}</h1>
                <p><b>Montant/Unités: </b>{log.montant} <b style={{ color: "green" }}>€</b> - {log.details.nombre_crypto} <b style={{ color: "green" }}>{log.details.symbole_crypto}</b></p>
                <p><b>Prix unités: </b>{log.details.prix_unite_crypto} <b style={{ color: "green" }}>€</b></p>
              </>
            ) : (
              <>
                <h1 style={{ color: log.rib_cible === rib ? "green" : "red" }}>{log.montant}€</h1>
                <p><b>De: </b>{log.rib_deb === rib ? "Vous" : log.rib_deb}</p>
                <p><b>Pour: </b>{log.rib_cible === rib ? "Vous" : log.rib_deb}</p>
                {log.type && <p><b>Type: </b>{log.type}</p>}
              </>
            )}
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
        <p><strong>Solde :</strong> {solde} <b style={{ color: "green" }}>€</b></p>
        <div className="crypto-list">
          {crypto.length > 0 ? (
            crypto.map((item, index) => (
              <span key={index}><strong>{item.nom} :</strong> {item.quantite} <b style={{ color: "green" }}>{item.symbole}</b></span>
            ))
          ) : (
            <p>Rien</p>
          )}
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="dashboard-block">
          <h2 style={{ color: "red" }}>📥 Achats (Cryptos)</h2>
          {achats.length > 0 ? (
            renderItems(achats, showMoreAchats, setShowMoreAchats, true)
          ) : (
            <p>Rien</p>
          )}
        </div>

        <div className="dashboard-block">
          <h2 style={{ color: "green" }}>📤 Ventes (Cryptos)</h2>
          {ventes.length > 0 ? (
            renderItems(ventes, showMoreVentes, setShowMoreVentes, true)
          ) : (
            <p>Rien</p>
          )}
        </div>

        <div className="dashboard-block">
          <h2>🧾 Autres</h2>
          {autres.length > 0 ? (
            renderItems(autres, showMoreAutres, setShowMoreAutres, false)
          ) : (
            <p>Rien</p>
          )}
        </div>
      </div>
    </div>
  );
}