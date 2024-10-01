const express = require('express');
const inventoryController = require('../Controllers/InventoryController');
const authController = require('../Controllers/authController');

const router = express.Router();

router.post('/', inventoryController.createInventory);
router.post('/add-batch', inventoryController.addNewBatch);

router.get(
  '/my-inventory-hospital',
  authController.protecthospital,
  inventoryController.getMyInventory,
);

router.get(
  '/my-inventory-doctor',
  authController.protectdoctor,
  inventoryController.getMyInventory,
);

router.get('/alerts', inventoryController.getInventoryAlerts);

module.exports = router;
