const admin = require("firebase-admin");
const firebaseAccount = require("./config.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseAccount),
  });
}

const auth = admin.auth();
const db = admin.firestore();

async function verifyToken(req) {
  try {
      const authHeader = req.headers.get("Authorization")
      
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return null
      }

      const token = authHeader.split(" ")[1]
      const decodedToken = await auth.verifyIdToken(token)
      return decodedToken
  } catch (error) {
      console.error("Erreur lors de la vérification du token:", error)
      return null
  }
}
module.exports = { auth, db, verifyToken };
