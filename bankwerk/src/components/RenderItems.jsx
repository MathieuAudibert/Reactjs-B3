"use client"
import { convertTimestamp } from "@/utils/utils"
import React from "react"
import { CaretDown, CaretUp } from "@phosphor-icons/react"

export default function RenderItems({ items, showMore, setShowMore, isAchatVente, rib }) {
    const limitedItems = showMore ? items : items.slice(0, 4)
    return (
        <React.Fragment>
          {limitedItems.map((log, index) => (
            <div key={index} className="transaction-log-item">
              {isAchatVente ? (
                <React.Fragment>
                  <div>
                    <h3 className="symbol-items">{log.details.symbole_crypto}</h3>
                  </div>
                  <p><b>Montant/Unités :</b> {log.montant} €</p>
                  <p><b>Prix unité :</b> {log.details.prix_unite_crypto.toFixed(2)} €</p>
                  <p>{convertTimestamp(log.date_transa)?.toLocaleString()}</p>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <h2 className="price-items">{log.montant} €</h2>
                  <p><b>De :</b> {log.rib_deb === rib ? "Vous" : log.rib_deb}</p>
                  <p><b>Pour :</b> {log.rib_cible === rib ? "Vous" : log.rib_cible}</p>
                  {log.type && <p><b>Type :</b> {log.type}</p>}
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
