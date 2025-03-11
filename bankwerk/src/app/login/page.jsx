"use client"; 
import { useState } from 'react';
import "../styles/globals.css";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [mdp, setMdp] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/login/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, mdp })
    });
    const data = await res.json();
    console.log(data);
  };
  
  return (
    <div className="container">
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit} className="form">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Mot de passe" value={mdp} onChange={(e) => setMdp(e.target.value)} required />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}