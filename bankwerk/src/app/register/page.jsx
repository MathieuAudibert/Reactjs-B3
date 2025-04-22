"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import "../../styles/globals.css"

export default function RegisterPage() {
  const [nom, setNom] = useState("")
  const [prenom, setPrenom] = useState("")
  const [email, setEmail] = useState("")
  const [mdp, setMdp] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, prenom, email, mdp }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || "Une erreur est survenue.")
      return
    }

    router.push("/login")
  }

  return (
    <div className="auth-container">
      <div className="form-side">
        <h1>Inscription</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={mdp}
            onChange={(e) => setMdp(e.target.value)}
            required
          />
          <button type="submit">S'inscrire</button>
          {error && <p className="error">{error}</p>}
          <p className="auth-link">
            Déjà un compte ? <a href="/login">Connectez-vous ici</a>
          </p>
        </form>
      </div>
      <div className="image-side"></div>
    </div>
  )
}
