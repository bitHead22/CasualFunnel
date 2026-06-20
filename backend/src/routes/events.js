const express = require('express');
const router = express.Router();

const { createEvent } = require('../controllers/ingestionController');
const { getSessions, getSessionById, getHeatmap, getPages } = require('../controllers/analyticsController');

router.post('/events', createEvent);
router.get('/sessions', getSessions);
router.get('/sessions/:id', getSessionById);
router.get('/heatmap', getHeatmap);
router.get('/pages', getPages);

module.exports = router;
