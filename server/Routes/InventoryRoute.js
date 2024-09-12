const express = require('express');
const inventoryController = require('../Controllers/InventoryController');

const router = express.Router();

router.post('/', inventoryController.createInventory);

module.exports = router;
