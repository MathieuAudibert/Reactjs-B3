const { signInWithEmailAndPassword } = require('firebase/auth')
const { auth } = require('../../../config/firebaseClient')

export async function POST(req) {
    try {
        const { email, mdp } = await req.json()

        if (!email || !mdp) {
            return new Response(JSON.stringify({ error: 'Veuillez remplir tous les champs.' }), { status: 400 })
        }

        if (mdp.length < 6) {
            return new Response(JSON.stringify({ error: 'Le mot de passe doit contenir au moins 6 caractères.' }), { status: 400 })
        }

        const userCredential = await signInWithEmailAndPassword(auth, email, mdp)
        const user = userCredential.user
        const token = await user.getIdToken()

        return new Response(JSON.stringify({ uid: user.uid, email: user.email, token}), { status: 200 })

    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({ error: 'Une erreur est survenue.' }), { status: 500 })
    }
}
