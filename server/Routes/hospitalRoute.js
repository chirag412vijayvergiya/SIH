const express = require('express');
const hospitalController = require('../Controllers/hospitalController');

const router = express.Router();

router.route('/').post(hospitalController.createHospital);
router.route('/nearby').get(hospitalController.findNearbyHospitals);

module.exports = router;
