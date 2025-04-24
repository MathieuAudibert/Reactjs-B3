export default function TransactionForm({ transactionType, crypto, userRib, montant, setAmount, quantite, setQuantity, handleSubmit, handleCancel, isButtonDisabled, error, success }) {
    return (
      
      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-group">
          <label htmlFor="rib" className="form-label">Votre RIB:</label>
          <input id="rib" type="text" value={userRib} readOnly className="form-input read-only-input" />
        </div>
  
        <div className="form-group">
          <label htmlFor="montant" className="form-label">Montant en €:</label>
          <input
            id="montant"
            type="number"
            value={montant}
            onChange={(e) => {
              setAmount(e.target.value)
              if (e.target.value && crypto?.prix) {
                setQuantity((e.target.value / crypto.prix).toFixed(8))
              }
            }}
            className="form-input"
            step="0.01"
            min="0"
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="quantite" className="form-label">Quantité de {crypto.symbole}:</label>
          <input
            id="quantite"
            type="number"
            value={quantite}
            onChange={(e) => {
              setQuantity(e.target.value)
              if (e.target.value && crypto?.prix) {
                setAmount((e.target.value * crypto.prix).toFixed(2))
              }
            }}
            className="form-input"
            step="0.00000001"
            min="0"
          />
        </div>
  
        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={transactionType === 'vente' && isButtonDisabled}>
            {transactionType === 'achat' ? 'Acheter' : 'Vendre'} {crypto.symbole}
          </button>
          <button type="button" className="btn-blue" onClick={handleCancel}>
            Annuler
          </button>
        </div>
  
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </form>
    )
  }