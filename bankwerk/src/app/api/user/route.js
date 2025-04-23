import { db } from '../../../config/firebaseAdmin'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const uid = searchParams.get("uid")

  if (!uid) {
    return new Response(JSON.stringify({ error: "UID manquant" }), { status: 400 })
  }

  try {
    const userDoc = await db.collection('Users').doc(uid).get()
    const compteDoc = await db.collection('Compte').doc(uid).get()

    if (!userDoc.exists) {
      return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 404 })
    }

    const userData = userDoc.data()
    const compteData = compteDoc.exists ? compteDoc.data() : {}

    const dateCrea =
      userData.date_crea_cpt?.toDate?.().toISOString?.() || userData.date_crea_cpt || null

    return new Response(JSON.stringify({
      nom: userData.nom,
      prenom: userData.prenom,
      email: userData.email,
      rib: compteData.rib || null,
      date_crea: dateCrea
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    })
  } catch (error) {
    console.error("Erreur récupération profil :", error)
    return new Response(JSON.stringify({ error: "Erreur interne" }), { status: 500 })
  }
}
