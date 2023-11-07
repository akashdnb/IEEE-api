const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventsController');


router.get('/events', eventController.getEvents);
router.get('/events/:id', eventController.getEventById);

module.exports = router;