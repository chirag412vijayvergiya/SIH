const factory = require('./handleFactory');
const Inventory = require('../models/InventoryModel');
const catchAsync = require('../utils/catchAsync');

exports.createInventory = catchAsync(async (req, res, next) => {
  const { currentStock, minimumStock } = req.body;

  // Calculate quantity status dynamically
  let quantityStatus = 'in stock'; // Default status
  if (currentStock === 0) {
    quantityStatus = 'out of stock';
  } else if (currentStock <= minimumStock) {
    quantityStatus = 'low stock';
  }

  const doc = await Inventory.create({ ...req.body });

  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
      quantityStatus, // Return the dynamically calculated status
    },
  });
});
