export default function CryptoInfoPanel({ crypto, symbole, posses, solde }) {
    return (
      <div className="crypto-info">
        <div className="info-row"><span className="label">En possession:</span> <span className="value">{posses} {symbole}</span></div>
        <div className="info-row"><span className="label">Solde:</span> <span className="value">{solde} €</span></div>
        <div className="info-row"><span className="label">Prix actuel:</span> <span className="value">{parseFloat(crypto.prix).toFixed(2)} €</span></div>
        <div className="info-row"><span className="label">Dernière mise à jour:</span> <span className="value">{new Date(crypto.derniere_update._seconds * 1000).toLocaleString()}</span></div>
      </div>
    )
  }
  