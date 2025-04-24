"use client"
import React from "react"

export default function CryptoOwned({ index, item, prixActuel, difference, pourcentage }) {
  return (
    <div className="card-crypto">
      <div className="crypto-card-item">
        <span>
          <strong>{index + 1}.</strong> {item.nom} : {item.quantite}
        </span>
        {prixActuel !== null && (
          <React.Fragment>
            <p><b>Prix actuel :</b> {prixActuel.toFixed(2)} €</p>
            <p><b>Différence :</b> {difference.toFixed(2)} €</p>
            <p><b>Évolution :</b> {pourcentage} %</p>
          </React.Fragment>
        )}
      </div>
    </div>
  )
}
