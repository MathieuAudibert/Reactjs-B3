const { signInWithEmailAndPassword } = require('firebase/auth')
const { auth } = require('../../../config/firebaseClient')

export async function POST(req) {
    const { email, mdp } = await req.json()

    try {
        if (!email || !mdp) {
            return Response.json({ error: 'Veuillez remplir tous les champs.' }, { status: 400 })
        }

        if (mdp.length < 6) {
            return Response.json({ error: 'Le mot de passe doit contenir au moins 6 caractères.' }, { status: 400 })    
        }

        const userCredential = await signInWithEmailAndPassword(auth, email, mdp)
        const user = userCredential.user    

        const token = await user.getIdToken()

        return Response.json({ uid: user.uid, email: email, token })

    } catch (error) {
        console.log(error)
        return Response.json({ error: 'Une erreur est survenue.' }, { status: 500 })
    }
}