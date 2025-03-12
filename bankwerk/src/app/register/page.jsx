"use client"
import { useState } from "react"
import { registerUser } from "@/utils/auth"
import "../../styles/globals.css"

export default function RegisterPage() {

  const [form, setForm] = useState({ nom: "", prenom: "", email: "", mdp: "" })
  const [message, setMessage] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")

    try {
      const { user, token } = await registerUser(
        form.nom,
        form.prenom,
        form.email,
        form.mdp
      )

      console.log("Utilisateur Firebase :", user)
      console.log("Token JWT :", token)

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          uid: user.uid,
          nom: form.nom,
          prenom: form.prenom,
          email: form.email,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage("Inscription réussie !")
      } else {
        setMessage(data.error || "Erreur lors de l'inscription.")
      }
    } catch (error) {
      console.error("Erreur d'inscription :", error)
      setMessage(error.message)
    }
  }

  return (
    <div className="container">
      <h1>Inscription</h1>
      {message && <p>{message}</p>}
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
