const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      email, 
      sale_timestamp,
      recurrence,
      cancelled,
      ended
    } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'No email provided' });
    }

    // Find user by email
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();

    if (snapshot.empty) {
      console.log('No user found with email:', email);
      return res.status(200).json({ message: 'User not found, will be updated on login' });
    }

    const userDoc = snapshot.docs[0];

    // If cancelled or ended — downgrade to free
    if (cancelled || ended) {
      await userDoc.ref.update({
        plan: 'free',
        credits: 50,
        updatedAt: new Date().toISOString(),
      });
      return res.status(200).json({ message: 'Plan downgraded to free' });
    }

    // New sale or renewal — upgrade to pro
    await userDoc.ref.update({
      plan: 'pro',
      gumroadEmail: email,
      subscriptionType: recurrence || 'monthly',
      updatedAt: new Date().toISOString(),
    });

    console.log('User upgraded to pro:', email);
    return res.status(200).json({ message: 'User upgraded to pro' });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
