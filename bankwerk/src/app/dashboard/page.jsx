"use client"
import { useState, useEffect } from "react"
import "../../styles/globals.css"

export default function Dashboard() {
  const [solde, setSolde] = useState(null)
  const [crypto, setCrypto] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

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

        const response = await fetch(`/api/balance?uid=${uid}`, {
          method: "GET",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch balance")
        }
  
        const data = await response.json()
        console.log("Fetched balance:", data)
        setSolde(data.solde)
        setCrypto(data.crypto || [])
        setIsLoggedIn(true)
      } catch (error) {
        console.error("Error fetching balance:", error)
        setIsLoggedIn(false)
      } finally {
        setLoading(false)
      }
    }
  
    fetchSolde() 
  }, [])
  
  if (loading) {
    return <div>Chargement...</div>
  }

  if (!isLoggedIn) {
    return (
      <div className="container">
        <h1>Tableau de Bord</h1>
        <p>Vous devez être connecté pour voir votre solde.</p>
      </div>
    )
  }
  
  return (
    <div className="container">
      <h1>Tableau de Bord</h1>
      <p>Votre solde : {solde} €</p>
      <h2>CryptoMonnaies</h2>
      <ul className="crypto-list">
        {crypto.length > 0 ? (
          crypto.map((item,index ) => (
            <li key={index} className="crypto-item">
              <h3>{item.nom} : {item.quantite}</h3>
            </li>
          ))
        )
        : (
          <p>Rien</p>
        )
      }
      </ul>
    </div>
  )
}