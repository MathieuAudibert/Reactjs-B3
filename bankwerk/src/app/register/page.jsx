"use client";
import { useState, useEffect } from "react";
import { handleChange } from "next/form";
import { useRouter } from "next/navigation"; 
import "../../styles/globals.css";

export default function RegisterPage() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, prenom, email, mdp }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ email: data.email, uid: data.uid }));
      setUser({ email: data.email, uid: data.uid });
      
      router.push("/dashboard"); 
      window.location.reload();
    } else {
      setError(data.error || "Une erreur est survenue.");
    }
  };



  return (
    <div className="container">
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit} className="form">
        <input type="text" placeholder="Nom" name="nom" onChange={handleChange} required />
        <input type="text" placeholder="Prénom" name="prenom" onChange={handleChange} required />
        <input type="email" placeholder="Email" name="email" onChange={handleChange} required />
        <input type="password" placeholder="Mot de passe" name="mdp" onChange={handleChange} required />
        <p>Mot de passe oublié ?</p>
        <button type="submit">S'inscrire</button>
        <p>Déjà un compte ? Connectez-vous ici.</p>
      </form>
    </div>
  )
}
