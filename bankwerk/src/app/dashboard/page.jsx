"use client"

import React, { useState, useEffect } from "react"
import CryptoOwned from "@/components/Crypto/CryptoOwns"
import RenderItems from "@/components/RenderItems"
import "../../styles/globals.css"

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
  const [cryptoActuel, setCryptoActuel] = useState(null)

  useEffect(() => {
    const fetchSolde = async () => {
      try {
        const userString = localStorage.getItem("user")
        const uid = userString ? JSON.parse(userString) : null

        if (!uid) {
          setIsLoggedIn(false)
          setLoading(false)
          return
        }

        const [balanceRes, cryptosRes] = await Promise.all([
          fetch(`/api/balance?uid=${uid}`),
          fetch("/api/cryptos", { method: "GET" }),
        ])

        if (!balanceRes.ok || !cryptosRes.ok) throw new Error("Erreur API")

        const data = await balanceRes.json()
        const cryptos = await cryptosRes.json()

        setCryptoActuel(cryptos)
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

  const normalizeType = (type) => type?.toLowerCase().trim()

  const achats = transactionLogs.filter(t => normalizeType(t.type).includes("achat"))
  const ventes = transactionLogs.filter(t => normalizeType(t.type).includes("vente"))
  const autres = transactionLogs.filter(t => {
    const type = normalizeType(t.type)
    return !type.includes("achat") && !type.includes("vente")
  })

  if (loading) return <div>Chargement...</div>

  if (!isLoggedIn) {
    return (
      <div className="container">
        <h1>Tableau de Bord</h1>
        <p>Vous devez être connecté pour voir votre solde.</p>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <h1 className="title-dashboard">Tableau de Bord</h1>

      <div className={`dashboard-top ${solde > 0 ? "positive-balance" : "negative-balance"}`}>
        <p><strong style={{ fontSize: "xx-large" }}>{solde}</strong> €</p>
      </div>

      <div className="dashboard-mid">
        <div className="crypto-list">
          <h2>Vos Cryptomonnaies</h2>

          {(() => {
            let totalCryptoValue = 0

            const cryptoElements = crypto.map((item, index) => {
              const current = cryptoActuel.find(c => c.symbole === item.symbole)

              const achatsPourCrypto = achats.filter(
                (t) => t.details?.symbole_crypto === item.symbole
              )

              const totalMontant = achatsPourCrypto.reduce((sum, t) => sum + (t.montant || 0), 0)
              const totalQuantite = achatsPourCrypto.reduce(
                (sum, t) => sum + (t.details?.nombre_crypto || 0), 0
              )

              const prixAchatMoyen = totalQuantite > 0 ? totalMontant / totalQuantite : 0
              const prixActuel = current?.prix || 0
              const difference = prixActuel - prixAchatMoyen
              const pourcentage = prixAchatMoyen
                ? ((difference / prixAchatMoyen) * 100).toFixed(2)
                : "0.00"

              const totalCryptoEuros = totalQuantite * prixActuel
              totalCryptoValue += totalCryptoEuros

              return (
                <CryptoOwned
                  key={index}
                  index={index}
                  item={item}
                  prixActuel={prixActuel}
                  difference={difference}
                  pourcentage={pourcentage}
                />
              )
            })

            return (
              <React.Fragment>
                <p><strong>Solde Total :</strong> {totalCryptoValue.toFixed(2)} €</p>
                {cryptoElements}
              </React.Fragment>
            )
          })()}
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="dashboard-block green-block">
          <h2>📥 Achats (Cryptos)</h2>
          {achats.length > 0
            ? <RenderItems items={achats} showMore={showMoreAchats} setShowMore={setShowMoreAchats} isAchatVente />
            : <p>Rien</p>}
        </div>

        <div className="dashboard-block red-block">
          <h2>📤 Ventes (Cryptos)</h2>
          {ventes.length > 0
            ? <RenderItems items={ventes} showMore={showMoreVentes} setShowMore={setShowMoreVentes} isAchatVente />
            : <p>Rien</p>}
        </div>

        <div className="dashboard-block blue-block">
          <h2>🧾 Autres</h2>
          {autres.length > 0
            ? <RenderItems items={autres} rib={rib} showMore={showMoreAutres} setShowMore={setShowMoreAutres} isAchatVente={false} />
            : <p>Rien</p>}
        </div>
      </div>
    </div>
  )
}
