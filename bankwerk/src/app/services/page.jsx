'use client'

import ServiceCard from "@/components/Home/ServiceCard"

const allServices = [
  {
    icon: <Bank size={42} />, 
    title: "Comptes courants",
    description: "Gérez votre argent au quotidien grâce à une interface claire, intuitive et conçue pour vous faire gagner du temps.",
    details: [
      "Ouverture de compte en ligne instantanée",
      "Suivi de vos opérations en temps réel",
      "Gestion simplifiée des prélèvements et virements"
    ]
  },
  {
    icon: <Swap size={42} />, 
    title: "Transferts d'argent",
    description: "Effectuez des virements ultra-rapides, en toute sécurité, vers n’importe quel compte bancaire en France ou à l’étranger.",
    details: [
      "Transactions instantanées disponibles 24/7",
      "Historique clair et exportable de tous vos transferts",
      "Ajout de bénéficiaires en un clic"
    ]
  },
  {
    icon: <CurrencyBtc size={42} />, 
    title: "Cryptomonnaies",
    description: "Achetez, vendez ou conservez vos cryptomonnaies directement depuis votre espace BankWerk.",
    details: [
      "Accès aux cryptos les plus populaires (BTC, ETH, etc.)",
      "Suivi de vos performances et alertes personnalisées",
      "Sécurité renforcée grâce à notre coffre numérique"
    ]
  },
  {
    icon: <Laptop size={42} />, 
    title: "Services en ligne",
    description: "Profitez d’outils puissants pour piloter vos finances, où que vous soyez.",
    details: [
      "Dashboard interactif avec visualisation des dépenses",
      "Alertes en temps réel sur les mouvements suspects",
      "Support client disponible via chat intégré"
    ]
  }
]
export default function NosServicesPage() {
  return (
    <div className="nos-services-page ">
      <h1 className="">Nos services</h1>
      <div className="services-container">
        {allServices.map((service, index) => (
          <ServiceCard
            key={index}
            icon={service.icon}
            title={service.title}
            description={service.description}
            details={service.details}
          />
        ))}
      </div>
    </div>
  )
} 