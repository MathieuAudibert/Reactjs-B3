const { createUserWithEmailAndPassword } = require("firebase/auth")
const { auth } = require('../config/firebaseClient')


async function registerUser(nom, prenom, email, mdp) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, mdp)
    const user = userCredential.user
    const token = await user.getIdToken()
    return { user, token, nom, prenom }
    }


module.exports = {
    registerUser
}