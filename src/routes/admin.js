const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const multerConfig = require('../middlewares/multerConfig');

const loginController = require('../controllers/loginController');
const eventsController = require('../controllers/eventsController');


router.get('/login', loginController.login);
router.post('/login', loginController.login);

router.get('/register', loginController.register);
router.post('/register', loginController.register);

router.post('/postEvent', auth, multerConfig, eventsController.postEvent);
router.delete('/deleteEvent/:id', auth, eventsController.deleteEvent);
router.patch('/updateEvent/:id', auth, eventsController.updateEvent);

module.exports = router;
