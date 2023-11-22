const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const multerConfig = require('../middlewares/multerConfigWithCloudinary');

const loginController = require('../controllers/loginController');
const eventsController = require('../controllers/eventsController');

router.get('/login', loginController.login);
router.post('/login', loginController.login);
router.post('/logout', loginController.logout);

router.get('/register', loginController.register);
router.post('/register', loginController.register);

router.post('/postEvent', auth, multerConfig, eventsController.postEvent);
router.delete('/deleteEvent/:id', auth, eventsController.deleteEvent);
router.patch('/updateEvent/:id', auth, eventsController.updateEvent);

router.get('/dashboard', auth, (req, res)=>{
    res.render('dashboard');
});

router.get('/create-event', auth, (req, res)=>{
    res.render('create-event');
});

router.get('/edit-event/:id', auth, (req, res)=>{
    res.render('edit-event', {id: req.params.id});
});

module.exports = router;
