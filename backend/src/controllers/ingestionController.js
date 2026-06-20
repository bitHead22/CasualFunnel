const Event = require('../models/Event');

/**
 * POST /api/events
 * Receive and store a tracking event
 */
const createEvent = async (req, res) => {
  try {
    const { 
      session_id, event_type, page_url, timestamp, 
      x, y, viewport_width, viewport_height,
      target_tag, target_id, target_class, target_text
    } = req.body;

    if (!session_id || !event_type || !page_url || !timestamp) {
      return res.status(400).json({ error: 'Missing required fields: session_id, event_type, page_url, timestamp' });
    }

    if (!['page_view', 'click'].includes(event_type)) {
      return res.status(400).json({ error: 'event_type must be page_view or click' });
    }

    const event = new Event({
      session_id,
      event_type,
      page_url,
      timestamp: new Date(timestamp),
      x: event_type === 'click' ? x : null,
      y: event_type === 'click' ? y : null,
      viewport_width: event_type === 'click' ? viewport_width : null,
      viewport_height: event_type === 'click' ? viewport_height : null,
      target_tag: event_type === 'click' ? target_tag : null,
      target_id: event_type === 'click' ? target_id : null,
      target_class: event_type === 'click' ? target_class : null,
      target_text: event_type === 'click' ? target_text : null,
    });

    await event.save();
    return res.status(201).json({ success: true, id: event._id });
  } catch (err) {
    console.error('[createEvent]', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { createEvent };
