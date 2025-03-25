// /app/transactions/page.jsx
"use client";
import { useState, useEffect } from 'react';
import "../../styles/globals.css";

export default function Transactions() {
  const [ribs, setRibs] = useState([]);
  const [formData, setFormData] = useState({
    rib_deb: '',
    rib_cible: '',
    montant: '',
    type: 'virement'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchRibs = async () => {
      try {
        const response = await fetch('/api/all-ribs');
        if (!response.ok) throw new Error('Erreur lors de la récupération des RIBs');
        const data = await response.json();
        setRibs(data.ribs);
      } catch (err) {
        console.error(err);
        setError('Impossible de charger les RIBs disponibles');
      }
    };
    
    fetchRibs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          montant: parseFloat(formData.montant)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la transaction');
      }

      setSuccess('Transaction effectuée avec succès!');
      setFormData({
        rib_deb: '',
        rib_cible: '',
        montant: '',
        type: 'virement'
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Effectuer un transfert</h1>
      
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-group">
          <label>RIB Débiteur:</label>
          <select 
            name="rib_deb" 
            value={formData.rib_deb} 
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez votre RIB</option>
            {ribs.map(rib => (
              <option key={rib.rib} value={rib.rib}>
                {rib.rib} (Solde: {rib.solde} €)
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>RIB Bénéficiaire:</label>
          <select 
            name="rib_cible" 
            value={formData.rib_cible} 
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez le RIB du bénéficiaire</option>
            {ribs.filter(rib => rib.rib !== formData.rib_deb).map(rib => (
              <option key={rib.rib} value={rib.rib}>
                {rib.rib}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Montant:</label>
          <input
            type="number"
            name="montant"
            value={formData.montant}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Type de transaction:</label>
          <select 
            name="type" 
            value={formData.type} 
            onChange={handleChange}
            required
          >
            <option value="virement">Virement</option>
            <option value="don">Don</option>
            <option value="remboursement">Remboursement</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Traitement...' : 'Effectuer le transfert'}
        </button>
      </form>
    </div>
  );
}