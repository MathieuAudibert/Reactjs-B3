"use client";
import { useState, useEffect } from 'react';
import "../../styles/globals.css";

export default function Transactions() {
  const [userRib, setUserRib] = useState('');
  const [knownRibs, setKnownRibs] = useState([]);
  const [formData, setFormData] = useState({
    rib_deb: '',
    rib_cible: '',
    montant: '',
    type: 'virement'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [ribInputMode, setRibInputMode] = useState('select'); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userString = localStorage.getItem('user');
        const user = JSON.parse(userString);
        const uid = user;
        
        if (!uid) throw new Error('Utilisateur non connecté');

        const response = await fetch(`/api/balance?uid=${uid}`);
        if (!response.ok) throw new Error('Erreur lors de la récupération des données');
        
        const data = await response.json();
        setUserRib(data.rib);
        setFormData(prev => ({ ...prev, rib_deb: data.rib }));

        const knownRibsResponse = await fetch(`/api/ribs-connus?uid=${uid}`);
        if (knownRibsResponse.ok) {
          const knownRibsData = await knownRibsResponse.json();
          setKnownRibs(knownRibsData.ribs || []);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchUserData();
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
      const ribCheckResponse = await fetch(`/api/check-rib?rib=${formData.rib_cible}`);
      if (!ribCheckResponse.ok) {
        throw new Error('RIB bénéficiaire invalide');
      }

      const ribCheckData = await ribCheckResponse.json();
      if (!ribCheckData.exists) {
        throw new Error('Le RIB bénéficiaire n\'existe pas');
      }

      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          montant: parseFloat(formData.montant),
          rib_deb: userRib 
        })
      });

      const data = await response.json();
      const userString = localStorage.getItem('user');
      const user = JSON.parse(userString);
      const uid = user;
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la transaction');
      }

      if (!knownRibs.some(rib => rib === formData.rib_cible)) {
        await fetch(`/api/add-known-rib`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: uid,
            newRib: formData.rib_cible
          })
        });
        setKnownRibs(prev => [...prev, formData.rib_cible]);
      }

      setSuccess('Transaction effectuée avec succès!');
      setFormData(prev => ({
        ...prev,
        rib_cible: '',
        montant: ''
      }));
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
          <label>Votre RIB:</label>
          <input
            type="text"
            value={userRib}
            readOnly
            className="read-only-input"
          />
        </div>

        <div className="form-group">
          <label>RIB Bénéficiaire:</label>
          
          <div className="rib-input-container">
            <div className="rib-input-options">
              <button
                type="button"
                className={`rib-mode-btn ${ribInputMode === 'select' ? 'active' : ''}`}
                onClick={() => setRibInputMode('select')}
              >
                Choisir un RIB connu
              </button>
              <button
                type="button"
                className={`rib-mode-btn ${ribInputMode === 'input' ? 'active' : ''}`}
                onClick={() => setRibInputMode('input')}
              >
                Saisir un nouveau RIB
              </button>
            </div>

            {ribInputMode === 'select' ? (
              <select
                name="rib_cible"
                value={formData.rib_cible}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez un RIB</option>
                {knownRibs.map(rib => (
                  <option key={rib} value={rib}>
                    {rib}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name="rib_cible"
                value={formData.rib_cible}
                onChange={handleChange}
                placeholder="Entrez le RIB bénéficiaire"
                required
              />
            )}
          </div>
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