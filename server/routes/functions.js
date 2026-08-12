const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');

const AMAZON_ASSOCIATE_TAG = process.env.AMAZON_ASSOCIATE_TAG || 'dealscout-20';

// POST /api/functions/amazon-redirect
// Appends affiliate tag to any Amazon product URL
router.post('/amazon-redirect', requireAuth, (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid url' });
  }
  let redirectUrl;
  try {
    const parsed = new URL(url);
    parsed.searchParams.set('tag', AMAZON_ASSOCIATE_TAG);
    redirectUrl = parsed.toString();
  } catch {
    const sep = url.includes('?') ? '&' : '?';
    redirectUrl = url + sep + 'tag=' + AMAZON_ASSOCIATE_TAG;
  }
  res.json({ redirectUrl, tag: AMAZON_ASSOCIATE_TAG });
});

// POST /api/functions/fetch-deals
// Stub: In production wire up the Rainforest API (https://www.rainforestapi.com/)
// and set RAINFOREST_API_KEY in your .env file.
router.post('/fetch-deals', requireAdmin, async (req, res) => {
  const RAINFOREST_API_KEY = process.env.RAINFOREST_API_KEY;
  if (!RAINFOREST_API_KEY) {
    return res.status(501).json({
      error: 'RAINFOREST_API_KEY not configured',
      hint: 'Add RAINFOREST_API_KEY=<your_key> to server/.env and implement the fetch logic in server/routes/functions.js',
    });
  }
  // TODO: implement Rainforest API integration here
  res.json({ created: 0, skipped: [], message: 'Not yet implemented — see server/routes/functions.js' });
});

module.exports = router;
