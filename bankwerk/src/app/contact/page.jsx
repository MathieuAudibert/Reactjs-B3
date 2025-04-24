"use client"

import React, { useState } from "react"

export default function ContactForm() {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    sujet: "",
    message: ""
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Ici tu pourrais envoyer vers une API
    console.log("Données envoyées :", form)
    setSubmitted(true)
    setForm({ nom: "", email: "", sujet: "", message: "" })
  }

  return (
    <div className="contact-form">
      <h2>Contactez BankWerk</h2>
      <p>Vous avez une question ou un besoin ? Notre équipe est à votre écoute.</p>

      {submitted && <p className="success-message">Message envoyé avec succès ✅</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nom"
          placeholder="Votre nom"
          value={form.nom}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Votre adresse email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="sujet"
          placeholder="Objet de votre message"
          value={form.sujet}
          onChange={handleChange}
        />
        <textarea
          name="message"
          placeholder="Votre message"
          value={form.message}
          onChange={handleChange}
          rows="5"
          required
        ></textarea>

        <button type="submit" className="btn-blue">Envoyer</button>
      </form>
    </div>
  )
}
