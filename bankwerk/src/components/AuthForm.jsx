"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import "../styles/globals.css"

export default function AuthForm({ mode }) {
  const router = useRouter()
  const isLogin = mode === "login"
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    mdp: ""
  })
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const endpoint = isLogin ? "/api/login" : "/api/register"
    const body = isLogin
      ? { email: formData.email, mdp: formData.mdp }
      : formData

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Erreur inconnue")

      if (isLogin) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.uid))
        router.push("/")
        window.location.reload()
      } else {
        router.push("/login")
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-container">
      <div className="form-side">
        <h1>{isLogin ? "Connexion" : "Inscription"}</h1>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                name="nom"
                placeholder="Nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="prenom"
                placeholder="Prénom"
                value={formData.prenom}
                onChange={handleChange}
                required
              />
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="mdp"
            placeholder="Mot de passe"
            value={formData.mdp}
            onChange={handleChange}
            required
          />
          <button type="submit">{isLogin ? "Se connecter" : "S'inscrire"}</button>
          {error && <p className="error">{error}</p>}
          <p className="auth-link">
            {isLogin ? (
              <>Pas encore de compte ? <a href="/register">Inscrivez-vous ici</a></>
            ) : (
              <>Déjà un compte ? <a href="/login">Connectez-vous ici</a></>
            )}
          </p>
        </form>
      </div>
      <div className="image-side">
        <img src="../../public/bankwerk.png" alt="Auth Image"/>
      </div>
    </div>
  )
}
