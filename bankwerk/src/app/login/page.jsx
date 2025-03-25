"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import "../../styles/globals.css";

export default function LoginPage() {
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

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, mdp }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ email: data.email, uid: data.uid }));
      setUser({ email: data.email, uid: data.uid });
      
      router.push("/dashboard"); 
    } else {
      setError(data.error || "Identifiants incorrects.");
    }
  };


  return (
    <div className="container">
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit} className="form">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Mot de passe" value={mdp} onChange={(e) => setMdp(e.target.value)} required />
        <button type="submit">Se connecter</button>
      </form>
      {error && <p className="error">{error}</p>} { }

    </div>
  );
}