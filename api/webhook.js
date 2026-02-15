// Vercel Serverless Function for Meta Webhooks
const { verify } = require('crypto');

// Load configuration from environment variables
const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || 'meta_webhook_secret_2026';

export default function handler(req, res) {
  console.log('Webhook received:', req.method, req.url);

  // Handle webhook verification (GET request)
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✓ Webhook verified!');
      return res.status(200).send(challenge);
    } else {
      console.log('✗ Webhook verification failed');
      return res.status(403).json({ error: 'Verification failed' });
    }
  }

  // Handle webhook events (POST request)
  if (req.method === 'POST') {
    const body = req.body;

    // Optional: Verify webhook signature for security
    if (process.env.WEBHOOK_SECRET) {
      const signature = req.headers['x-hub-signature'];
      if (!signature) {
        console.warn('⚠️ No signature provided');
      } else {
        const hash = 'sha1=' + verify(process.env.WEBHOOK_SECRET, JSON.stringify(body));
        if (hash !== signature) {
          console.log('✗ Signature verification failed');
          return res.status(403).json({ error: 'Invalid signature' });
        }
      }
    }

    // Log the webhook event
    console.log('\n📨 Webhook Event Received:');
    console.log('Object:', body.object);
    console.log('Entry Count:', body.entry?.length || 0);

    try {
      if (body.object === 'instagram') {
        // Handle Instagram events
        handleInstagramEvents(body);
      } else if (body.object === 'page') {
        // Handle Facebook Messenger events
        handleFacebookEvents(body);
      } else {
        console.log('⚠️ Unknown object type:', body.object);
      }

      res.status(200).send('EVENT_RECEIVED');
    } catch (error) {
      console.error('❌ Error processing webhook:', error);
      res.status(500).json({ error: 'Internal server error' });
    }

    return;
  }

  // Handle unsupported methods
  res.status(405).json({ error: 'Method not allowed' });
}

/**
 * Handle Instagram webhook events
 */
function handleInstagramEvents(body) {
  const entries = body.entry || [];

  entries.forEach(entry => {
    const changes = entry.changes || [];

    changes.forEach(change => {
      if (change.field === 'messages') {
        console.log('\n📸 New Instagram Message:');
        console.log('From:', change.value.from_id);
        console.log('To:', change.value.to_id);
        console.log('Message:', change.value.text || '(Media message)');

        // You can add custom logic here:
        // - Send auto-replies
        // - Save to database
        // - Call external APIs
        // - Send notifications

      } else if (change.field === 'comments') {
        console.log('\n💭 New Instagram Comment:');
        console.log('From:', change.value.from_id);
        console.log('Post ID:', change.value.media_id);
        console.log('Comment:', change.value.text);

        // You can add custom logic here for comments

      } else if (change.field === 'mentions') {
        console.log('\n📢 New Instagram Mention:');
        console.log('Data:', JSON.stringify(change.value));
      }
    });
  });
}

/**
 * Handle Facebook Messenger webhook events
 */
function handleFacebookEvents(body) {
  const entries = body.entry || [];

  entries.forEach(entry => {
    const messagingEvents = entry.messaging || [];

    messagingEvents.forEach(event => {
      if (event.message) {
        const senderId = event.sender.id;
        const recipientId = event.recipient.id;
        const message = event.message;

        console.log('\n💬 New Facebook Message:');
        console.log('From:', senderId);
        console.log('To:', recipientId);

        if (message.text) {
          console.log('Message:', message.text);
        } else if (message.attachments) {
          console.log('Attachments:', message.attachments.length);
        }

        // You can add custom logic here:
        // - Send auto-replies
        // - Process user input
        // - Save to database

      } else if (event.postback) {
        console.log('\n🔘 Postback received:');
        console.log('Payload:', event.postback.payload);
      }
    });
  });
}
