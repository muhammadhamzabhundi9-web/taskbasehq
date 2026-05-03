import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

let initialized = false;
let db;

function init() {
  if (initialized) return true;
  try {
    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        })
      });
    }
    db = getFirestore();
    initialized = true;
    return true;
  } catch(e) {
    console.error('Init error:', e.message);
    return false;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Token');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!init()) return res.status(500).json({ error: 'DB init failed' });

  try {
    // GET ?id=TB-XXXXXX - get ticket by ID
    if (req.method === 'GET') {
      const { id, email, admin } = req.query;

      // Admin: list all tickets
      if (admin === process.env.ADMIN_TOKEN || admin === 'taskbase-admin-2026') {
        const snap = await db.collection('tickets').orderBy('createdAt', 'desc').limit(50).get();
        const tickets = [];
        snap.forEach(d => tickets.push({...d.data()}));
        return res.status(200).json({ tickets });
      }

      // Get single ticket
      if (id) {
        const snap = await db.collection('tickets').doc(id).get();
        if (snap.exists) {
          return res.status(200).json({ ticket: snap.data() });
        }
        return res.status(200).json({ ticket: null });
      }

      // Get tickets by email
      if (email) {
        const snap = await db.collection('tickets').where('email', '==', email).orderBy('createdAt', 'desc').get();
        const tickets = [];
        snap.forEach(d => tickets.push(d.data()));
        return res.status(200).json({ tickets });
      }

      return res.status(400).json({ error: 'id or email required' });
    }

    // POST - create new ticket OR admin update
    if (req.method === 'POST') {
      const body = req.body || {};

      // Admin: update ticket status/reply
      if (body.action === 'update' && (body.adminToken === process.env.ADMIN_TOKEN || body.adminToken === 'taskbase-admin-2026')) {
        const { id, status, adminReply } = body;
        const update = { updatedAt: new Date().toISOString() };
        if (status) update.status = status;
        if (adminReply) update.adminReply = adminReply;
        if (status === 'resolved') update.resolvedAt = new Date().toISOString();

        await db.collection('tickets').doc(id).update(update);

        // Send email to customer if reply
        if (adminReply || status === 'resolved') {
          const ticketSnap = await db.collection('tickets').doc(id).get();
          if (ticketSnap.exists) {
            const t = ticketSnap.data();
            const subject = status === 'resolved' ? `✅ Your ticket ${id} has been resolved` : `📬 Update on your ticket ${id}`;
            const message = `Hi ${t.name},\n\n${status === 'resolved' ? 'Your support ticket has been resolved!' : 'We have an update on your support ticket.'}\n\nTicket ID: ${id}\nSubject: ${t.subject}\n\n${adminReply ? '--- OUR RESPONSE ---\n' + adminReply + '\n\n' : ''}If you have follow-up questions, reply to this email or visit:\nhttps://taskbasehq.com/#support\n\nThank you!\n\nTaskBase HQ Support\nsupport@taskbasehq.com`;

            await fetch('https://api.emailjs.com/api/v1.0/email/send', {
              method: 'POST',
              headers: {'Content-Type':'application/json'},
              body: JSON.stringify({
                service_id: 'service_8zans7l',
                template_id: 'template_a95p4nn',
                user_id: 'c5f49E_C8hbfbmXUE',
                template_params: {
                  to_email: t.email,
                  to_name: t.name,
                  from_name: 'TaskBase HQ Support',
                  reply_to: 'support@taskbasehq.com',
                  subject,
                  message
                }
              })
            }).catch(e => console.log('Email error:', e.message));
          }
        }

        return res.status(200).json({ success: true });
      }

      // Create new ticket
      if (body.action === 'create') {
        const { id, category, priority, name, email, subject, message } = body;

        await db.collection('tickets').doc(id).set({
          id, category, priority, name, email, subject, message,
          status: 'submitted',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          adminReply: null,
          resolvedAt: null
        });

        return res.status(200).json({ success: true, id });
      }

      return res.status(400).json({ error: 'Invalid action' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch(e) {
    console.error('Ticket API error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
