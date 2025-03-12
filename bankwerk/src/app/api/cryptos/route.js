import { db } from '../../config/firebaseClient';

export async function GET() {
  const crypto = await db.collection('Crypto').get();
  const cryptos = crypto.docs.map(doc => doc.data());

  return new Response(JSON.stringify(cryptos), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}