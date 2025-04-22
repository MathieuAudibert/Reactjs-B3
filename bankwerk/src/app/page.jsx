'use client'

import Link from "next/link"

import React, { useState, useEffect} from "react"
import { Bank, Swap, CurrencyBtc, Laptop} from "@phosphor-icons/react"


export default function Home() {

  const [isConnected, setIsConnected] = useState(false)

  const services = [
    { icon: <Bank size={32} />, title: "Compte Courants", description: "Une gestion simple et efficace de vos comptes bancaire" },
    { icon: <Swap size={32} />, title: "Transfert d'Argent", description: "Envoyez de l'argent rapidement et en toute sécurité." },
    { icon: <CurrencyBtc size={32} />, title: "CryptoMonnaies", description: "Investissez dans les cryptomonnaies avec confiance." },
    { icon: <Laptop size={32} />, title: "Services en Ligne", description: "Un service de transfert d'argent rapide et sécurisé." }
  ]

  useEffect(()=> {
    const token = localStorage.getItem("token")
    if (token) {
      setIsConnected(true)
    } else {
      setIsConnected(false)
    }

  })
  return (
    <React.Fragment>
      <main>
        <div className="home">
          <h1>Des solutions Bancaires modernes</h1>
          <p>Gérez vos finances en toute simplicité</p>
          
          {
            isConnected ? <Link href="/dashboard" className="btn-blue">Accéder à mon compte</Link> 
            : <Link href="/register" className="btn-blue">Ouvrir un compte BankWerk</Link>
          }
          
        </div>

        <div className="home">
          <h1>Nos Services</h1>
          <div className="container-services">
            {services.map((service, index) => (
              <div className="service" key={index}>
                <h2>{service.icon}</h2>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="home">
          <h1>Nos Services</h1>
          <div className="container-services">
            {services.map((service, index) => (
              <div className="service" key={index}>
                <h2>{service.icon}</h2>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
        
      </main>
    </React.Fragment>
  )
}
