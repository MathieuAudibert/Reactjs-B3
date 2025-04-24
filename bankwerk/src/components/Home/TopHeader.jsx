import React from "react"
import Link from "next/link"

export default function TopHeader({ isConnected }) {
  return (
    <div className="home">
      <h1>Une nouvelle génération de services bancaires</h1>
      <p>BankWerk vous accompagne dans votre quotidien financier avec des outils simples, rapides et sécurisés.</p>
      {isConnected ? (
        <Link href="/dashboard" className="btn-blue">
          Accéder à mon espace
        </Link>
      ) : (
        <Link href="/register" className="btn-blue">
          Ouvrir un compte BankWerk
        </Link>
      )}
    </div>
  )
}