"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import "../../styles/globals.css"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [mdp, setMdp] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mdp }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Identifiants incorrects.")

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.uid))

      router.push("/")
      window.location.reload()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-container">
      <div className="form-side">
        <h1>Connexion</h1>
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Se connecter</button>
          {error && <p className="error">{error}</p>}
          <p className="auth-link">
            Pas encore de compte ? <a href="/register">Inscrivez-vous ici</a>
          </p>
        </form>
      </div>
      <div className="image-side"></div>
    </div>
  )
  
}