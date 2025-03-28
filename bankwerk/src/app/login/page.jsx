"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation" 
import "../../styles/globals.css"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [mdp, setMdp] = useState("")
  const [user, setUser] = useState(null)
  const [error, setError] = useState("")
  const router = useRouter()
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, mdp }),
    })

    const data = await res.json()

    if (res.ok) {
      localStorage.setItem("token", data.token, { expiresIn: '1h' })
      localStorage.setItem("user", JSON.stringify(data.uid))
      setUser(data.uid)
      router.push("/dashboard")
      window.location.reload()
    } else {
      setError(data.error || "Identifiants incorrects.")
    }
  }


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
  )
}