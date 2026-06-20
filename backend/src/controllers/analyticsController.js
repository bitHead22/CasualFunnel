const Event = require('../models/Event');

/**
 * GET /api/sessions
 * List all sessions with event counts, first/last seen
 */
const getSessions = async (req, res) => {
  try {
    const sessions = await Event.aggregate([
      {
        $group: {
          _id: '$session_id',
          event_count: { $sum: 1 },
          first_seen: { $min: '$timestamp' },
          last_seen: { $max: '$timestamp' },
          pages: { $addToSet: '$page_url' },
        },
      },
      { $sort: { last_seen: -1 } },
      {
        $project: {
          _id: 0,
          session_id: '$_id',
          event_count: 1,
          first_seen: 1,
          last_seen: 1,
          pages: 1,
          page_count: { $size: '$pages' },
        },
      },
    ]);

    return res.json(sessions);
  } catch (err) {
    console.error('[getSessions]', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/sessions/:id
 * Fetch all events for a specific session in chronological order
 */
const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const events = await Event.find({ session_id: id })
      .sort({ timestamp: 1 })
      .lean();

    if (!events.length) {
      return res.status(404).json({ error: 'Session not found' });
    }

    return res.json({ session_id: id, events });
  } catch (err) {
    console.error('[getSessionById]', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/heatmap?page_url=...
 * Fetch click x/y data for a specific page
 */
const getHeatmap = async (req, res) => {
  try {
    const { page_url } = req.query;

    if (!page_url) {
      return res.status(400).json({ error: 'page_url query param is required' });
    }

    const clicks = await Event.find(
      { page_url, event_type: 'click' },
      { 
        x: 1, y: 1, viewport_width: 1, viewport_height: 1, 
        target_tag: 1, target_id: 1, target_class: 1, target_text: 1,
        _id: 0 
      }
    ).lean();

    return res.json({ page_url, clicks });
  } catch (err) {
    console.error('[getHeatmap]', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/pages
 * Get list of unique tracked page URLs (for heatmap dropdown)
 */
const getPages = async (req, res) => {
  try {
    const pages = await Event.distinct('page_url');
    return res.json(pages);
  } catch (err) {
    console.error('[getPages]', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getSessions, getSessionById, getHeatmap, getPages };
