import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ message: 'Webhook ready' });
  }

  try {
    const { email, cancelled, ended, recurrence } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'No email provided' });
    }

    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();

    if (snapshot.empty) {
      return res.status(200).json({ message: 'User not found' });
    }

    const userDoc = snapshot.docs[0];

    if (cancelled || ended) {
      await userDoc.ref.update({
        plan: 'free',
        credits: 50,
        updatedAt: new Date().toISOString(),
      });
      return res.status(200).json({ message: 'Downgraded to free' });
    }

    await userDoc.ref.update({
      plan: 'pro',
      subscriptionType: recurrence || 'monthly',
      updatedAt: new Date().toISOString(),
    });

    return res.status(200).json({ message: 'Upgraded to pro' });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: error.message });
  }
}
