const express = require('express');
const hospitalController = require('../Controllers/hospitalController');
const authController = require('../Controllers/authController');

const router = express.Router();

router.route('/').post(hospitalController.createHospital);
router.route('/nearby').get(hospitalController.findNearbyHospitals);

router.post('/signup', authController.signuphospital);
router.post('/login', authController.loginhospital);
// router.post('/signup', authController.signup);
// router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;
