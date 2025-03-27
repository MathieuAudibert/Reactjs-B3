const admin = require("firebase-admin")
const firebaseAccount = require("./config.json")

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseAccount),
  })
}

const auth = admin.auth()
const db = admin.firestore()
const FieldValue = admin.firestore.FieldValue

async function verifyToken(req) {
  try {
    const authHeader = req.headers.get("authorization")

    const token = authHeader.split(" ")[1]
    const decodedToken = await auth.verifyIdToken(token)
    return decodedToken
  } catch (error) {
    console.error(error.message)
    return null 
  }
}


module.exports = { auth, db, verifyToken, FieldValue}

