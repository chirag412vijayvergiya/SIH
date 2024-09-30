// const factory = require('./handleFactory');
const Inventory = require('../models/InventoryModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// exports.createInventory = catchAsync(async (req, res, next) => {
//   const { currentStock, minimumStock } = req.body;

//   // Calculate quantity status dynamically
//   let quantityStatus = 'in stock'; // Default status
//   if (currentStock === 0) {
//     quantityStatus = 'out of stock';
//   } else if (currentStock <= minimumStock) {
//     quantityStatus = 'low stock';
//   }

//   const doc = await Inventory.create({ ...req.body });

//   res.status(201).json({
//     status: 'success',
//     data: {
//       data: doc,
//       quantityStatus, // Return the dynamically calculated status
//     },
//   });
// });
exports.createInventory = catchAsync(async (req, res, next) => {
  const {
    itemName,
    category,
    minimumStock,
    currentStock,
    supplierName,
    supplierEmail,
    hospitalId,
    clinicId,
    batch,
  } = req.body;

  // Create a new item
  const newItem = new Inventory({
    itemName,
    category,
    minimumStock,
    currentStock,
    supplierName,
    supplierEmail,
    hospitalId,
    clinicId,
    batches: [batch], // First batch added at the time of item creation
  });

  await newItem.save();

  res.status(201).json({ message: 'New item added successfully', newItem });
});

exports.addNewBatch = catchAsync(async (req, res, next) => {
  const { itemId, batch } = req.body;

  // Find the item by ID
  const item = await Inventory.findById(itemId);

  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  // Add the new batch to the existing item
  item.batches.push(batch);

  // Increment the current stock by the batch quantity
  item.currentStock += batch.quantity;

  // Save the updated item
  await item.save();

  res
    .status(200)
    .json({ message: 'Batch added successfully', updatedItem: item });
});

exports.getMyInventory = catchAsync(async (req, res, next) => {
  let inventory;

  // Log the request for debugging
  //   console.log(req.user.role);

  // Check if the user is a hospital or a doctor
  if (req.user.role === 'hospital') {
    // Find inventory associated with the hospital
    inventory = await Inventory.find({ hospitalId: req.user.id });
  } else if (req.user.role === 'doctor' || req.user.role === 'admin') {
    // Find inventory associated with the doctor (if applicable)
    inventory = await Inventory.find({ clinicId: req.user.id });
  } else {
    // If the user role is neither a hospital nor a doctor, return an error
    return next(
      new AppError('No hospital or doctor associated with this user.', 400),
    );
  }

  // If no inventory is found, return a 404 error
  if (!inventory || inventory.length === 0) {
    return next(
      new AppError(
        `No inventory found for this ${req.user.role === 'hospital' ? 'hospital' : 'doctor'}.`,
        404,
      ),
    );
  }

  // Respond with the inventory data
  res.status(200).json({
    status: 'success',
    results: inventory.length,
    data: {
      inventory,
    },
  });
});
