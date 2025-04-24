'use client'
import React, { useState, useEffect } from "react"
import ServiceCard from "@/components/Home/ServiceCard.jsx"
import TopHeader from "@/components/Home/TopHeader.jsx"
import AboutUs from "@/components/Home/AboutUs.jsx"

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsConnected(!!token)
  }, [])

  const services = [
    { icon: <Bank size={32} />, title: "Comptes courants", description: "Gérez votre argent au quotidien grâce à une interface claire et intuitive." },
    { icon: <Swap size={32} />, title: "Transferts d'argent", description: "Effectuez vos virements en quelques clics, où que vous soyez, en toute sécurité." },
    { icon: <CurrencyBtc size={32} />, title: "Cryptomonnaies", description: "Accédez aux marchés crypto et investissez facilement depuis votre compte." },
    { icon: <Laptop size={32} />, title: "Services en ligne", description: "Profitez d’outils numériques performants pour simplifier la gestion de vos finances." }
  ]

  const aboutUs = [
    {
      icon: <Bank size={32} />,
      title: "Une banque 100% digitale, made in France",
      text: "Fondée en 2025, BankWerk est une banque en ligne française née de la volonté de repenser la gestion bancaire pour tous..."
    },
    {
      icon: <Swap size={32} />,
      title: "Des transferts simples et sécurisés",
      text: "Grâce à notre technologie de pointe, chaque transaction est traitée avec une rapidité exemplaire..."
    },
    {
      icon: <CurrencyBtc size={32} />,
      title: "Des services financiers tournés vers l'avenir",
      text: "Ouverts sur le monde de demain, nous intégrons les cryptomonnaies dans notre offre..."
    },
    {
      icon: <Laptop size={32} />,
      title: "L'innovation au cœur de notre ADN",
      text: "Chez BankWerk, chaque fonctionnalité est pensée pour vous faciliter la vie..."
    }
]
  return (
    <main>
      <TopHeader isConnected={isConnected} />

      <div className="home">
        <h1>Nos services</h1>
        <div className="container-services">
          {services.map((s, i) => (
            <ServiceCard key={i} {...s} />
          ))}
        </div>
      </div>

      <div className="home">
        <h1>Qui sommes-nous ?</h1>
        {aboutUs.map((a, i) => (
          <AboutUs key={i} {...a} />
        ))}
      </div>
    </main>
  )
}
