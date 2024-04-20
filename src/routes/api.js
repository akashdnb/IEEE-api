const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventsController');

router.get('/events', eventController.getEvents);
router.get('/events/:id', eventController.getEventById);
router.get('/dummy', (req, res) => {
  setInterval(() => {
    fetch('https://eager-twill-ray.cyclic.app/api/events')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => console.log('Not sleeping'))
      .catch((error) => console.error('Error:', error));
  }, 3600000);
});

module.exports = router;
