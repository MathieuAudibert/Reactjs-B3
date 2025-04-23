"use client"
import React, { useState, useEffect } from "react"
import { CaretDown, CaretUp } from '@phosphor-icons/react'
import "../../styles/globals.css"

const convertTimestamp = (timestamp) => {
  if (timestamp && timestamp._seconds && timestamp._nanoseconds) {
    return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000)
  }
  return null
}

export default function Dashboard() {
  const [solde, setSolde] = useState(null)
  const [crypto, setCrypto] = useState([])
  const [transactionLogs, setTransactionLogs] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showMoreAchats, setShowMoreAchats] = useState(false)
  const [showMoreVentes, setShowMoreVentes] = useState(false)
  const [showMoreAutres, setShowMoreAutres] = useState(false)
  const [rib, setRib] = useState(null)

  useEffect(() => {
    const fetchSolde = async () => {
      try {
        const userString = localStorage.getItem('user')

        if (!userString) {
          setIsLoggedIn(false)
          setLoading(false)
          return
        }

        const user = JSON.parse(userString)
        const uid = user

        if (!uid) {
          setIsLoggedIn(false)
          setLoading(false)
          return
        }

        const response = await fetch(`/api/balance?uid=${uid}`)
        console.log(response)
        if (!response.ok) throw new Error("Erreur de récupération des données")

        const data = await response.json()

        setSolde(data.solde)
        setCrypto(data.crypto || [])
        setRib(data.rib)
        setTransactionLogs(data.transaction_log || [])
        setIsLoggedIn(true)
      } catch (error) {
        setIsLoggedIn(false)
      } finally {
        setLoading(false)
      }
    }

    fetchSolde()
  }, [])

  if (loading) return <div>Chargement...</div>

  if (!isLoggedIn) {
    return (
      <div className="container">
        <h1>Tableau de Bord</h1>
        <p>Vous devez être connecté pour voir votre solde.</p>
      </div>
    )
  }

  const normalizeType = (type) => type?.toLowerCase().trim()

  const achats = transactionLogs.filter(t => normalizeType(t.type).includes("achat"))
  const ventes = transactionLogs.filter(t => normalizeType(t.type).includes("vente"))
  const autres = transactionLogs.filter(t => {
    const type = normalizeType(t.type)
    return !type.includes("achat") && !type.includes("vente")
  })


  const renderItems = (items, showMore, setShowMore, isAchatVente) => {
    const limitedItems = showMore ? items : items.slice(0, 4)
    return (
      <React.Fragment>
        {limitedItems.map((log, index) => (
          <div key={index}>
            <p>{convertTimestamp(log.date_transa)?.toLocaleString()}</p>
            {isAchatVente ? (
              <React.Fragment>
                <h1>{log.details.symbole_crypto}</h1>
                <p><b>Montant/Unités: </b>{log.montant} <b>€</b> - {log.details.nombre_crypto} <b>{log.details.symbole_crypto}</b></p>
                <p><b>Prix unités: </b>{log.details.prix_unite_crypto} <b>€</b></p>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <h1 style={{ color: log.rib_cible === rib ? "green" : "red" }}>{log.montant}€</h1>
                <p><b>De: </b>{log.rib_deb === rib ? "Vous" : log.rib_deb}</p>
                <p><b>Pour: </b>{log.rib_cible === rib ? "Vous" : log.rib_deb}</p>
                {log.type && <p><b>Type: </b>{log.type}</p>}
              </React.Fragment>
            )}
          </div>
        ))}
        {items.length > 10 && (
          <button onClick={() => setShowMore(!showMore)} className="show-more-button">
            {showMore ? <CaretUp size={24} /> : <CaretDown size={24} />}
          </button>
        )}
      </React.Fragment>
    )
  }

  
  return (
    <div className="dashboard-container">
        <h1 className='title-dashboard'>Tableau de Bord</h1>
      <div className={`dashboard-top ${solde > 0 ? 'positive-balance' : 'negative-balance'}`}>
      <p><strong style={{fontSize: "xx-large"}}>{solde}</strong> €</p>
      </div>

      <div className="dashboard-mid">
      <div className="crypto-list">
        <h2>Vos Cryptomonnaies</h2>
        <div className="card-crypto">
            {
          crypto.length > 0 ? (
            crypto.map((item, index) => (
              <span key={index}> <strong>{index + 1}.</strong> {item.nom} : {item.quantite} <b>{item.symbole}</b> 
              </span>
            ))
          ) 
          
          : (
            <p>Rien</p>
          )}
          </div>
        </div>
        </div>

      <div className="dashboard-bottom">
        <div className="dashboard-block">
          <h2>📥 Achats (Cryptos)</h2>
          {achats.length > 0 ? (
            renderItems(achats, showMoreAchats, setShowMoreAchats, true)
          ) : (
            <p>Rien</p>
          )}
        </div>

        <div className="dashboard-block">
          <h2>📤 Ventes (Cryptos)</h2>
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
  )
}