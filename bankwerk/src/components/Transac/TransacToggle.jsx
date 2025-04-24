export default function TransactionToggle({ transactionType, setTransactionType, isButtonDisabled }) {
    return (
      <div className="transaction-toggle">
        <button
          className={`btn-blue toggle-btn ${transactionType === 'achat' ? 'active' : ''}`}
          onClick={() => setTransactionType('achat')}
        >
          Acheter
        </button>
        <button
          className={`btn-red toggle-btn ${transactionType === 'vente' ? 'active' : ''}`}
          onClick={() => setTransactionType('vente')}
          disabled={isButtonDisabled}
        >
          Vendre
        </button>
      </div>
    )
  }