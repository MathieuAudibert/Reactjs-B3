"use client";
import { useState } from "react";
import "../styles/globals.css";

export default function RegisterPage() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Inscription soumise");
  };

  return (
    <div className="container">
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit} className="form">
        <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
        <input type="text" placeholder="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Mot de passe" value={mdp} onChange={(e) => setMdp(e.target.value)} required />
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
}