const { db, verifyToken } = require("../../../config/firebaseAdmin")

export async function POST(req) {
  try {
    const token = req.headers.get("Authorization")?.split("Bearer ")[1]

    if (!token) {
      return new Response(JSON.stringify({ error: "Error Token" }), { status: 401 })
    }

    const decodedToken = await verifyToken(req)

    if (!decodedToken) {
      return new Response(JSON.stringify({ error: "Invalid Token" }), { status: 403 })
    }

    const { uid, nom, prenom, email } = await req.body
    const createdDate = new Date()

    const userRef = db.collection("Users").doc(uid)
    const userDoc = await userRef.get()
    
    if (userDoc.exists) {
      return new Response(JSON.stringify({ error: "Utilisateur déjà enregistré." }), { status: 400 })
    }

    await userRef.set({
      nom,
      prenom,
      email,
      solde: 0,
      compte_id: uid,
      date_crea: createdDate,
    })

    return new Response(JSON.stringify({ message: "Inscription réussie !" }), { status: 201 })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }
}
