// const factory = require('./handleFactory');
const moment = require('moment');
const cron = require('node-cron');
const sendEmail = require('../utils/email');
const Inventory = require('../models/InventoryModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Hospital = require('../models/hospitalModel');
const Doctor = require('../models/doctorModel');

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

  // Log the request for debugging (optional)
  // console.log(req.user.role);

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

  // Categorize inventory based on stock levels
  const categorizedInventory = inventory.map((item) => {
    let stockStatus;

    if (item.currentStock === 0) {
      stockStatus = 'out of stock';
    } else if (item.currentStock < item.minimumStock) {
      stockStatus = 'low stock';
    } else {
      stockStatus = 'in stock';
    }

    return {
      ...item._doc, // Spread operator to include all original fields
      stockStatus, // Add the stock status field
    };
  });

  // Respond with the categorized inventory data
  res.status(200).json({
    status: 'success',
    results: categorizedInventory.length,
    data: {
      inventory: categorizedInventory,
    },
  });
});
const getHospitalOrClinicEmail = async (recipientId) => {
  try {
    let recipientDetails;

    const hospital = await Hospital.findById(recipientId);
    if (hospital) {
      recipientDetails = { email: hospital.email, name: hospital.name };
    } else {
      const clinic = await Doctor.findById(recipientId);
      if (clinic) {
        recipientDetails = { email: clinic.email, name: clinic.name };
      } else {
        throw new Error('No recipient found for the given ID');
      }
    }

    // console.log('Recipient Details:', recipientDetails);
    return recipientDetails;
  } catch (error) {
    console.error('Error fetching hospital or clinic email:', error);
    throw error; // Rethrow the error so it can be caught in the calling function
  }
};

const sendEmailAlert = async (alert) => {
  try {
    const {
      type,
      itemName,
      currentStock,
      minimumStock,
      recipient,
      batchNumber,
      expiryDate,
    } = alert;

    let message = '';

    if (type === 'Low Stock') {
      message = `Alert: The item "${itemName}" has low stock.\nCurrent stock: ${currentStock}\nMinimum stock: ${minimumStock}.`;
    } else if (type === 'Out of Stock') {
      message = `Alert: The item "${itemName}" is out of stock.`;
    } else if (type === 'Near Expiry') {
      message = `Alert: The batch "${batchNumber}" of item "${itemName}" is near expiry.\nExpiry date: ${expiryDate}.`;
    }

    // Fetch the hospital or clinic email from the database
    const recipientDetails = await getHospitalOrClinicEmail(recipient);

    if (!recipientDetails) {
      console.error('No recipient details found for alert:', alert);
      return;
    }

    // console.log('Recipient details:', recipientDetails);

    const emailOptions = {
      email: recipientDetails.email,
      subject: `Inventory Alert: ${type}`,
      message: message,
    };

    await sendEmail(emailOptions);
    // console.log(`Email sent to ${recipientDetails.email} for alert: ${type}`);
  } catch (error) {
    console.error('Error sending email alert:', error);
  }
};

const checkInventoryForAlerts = catchAsync(async (req, res, next) => {
  // Get all items in the inventory
  const inventory = await Inventory.find();
  const alerts = [];
  const categoryCount = {
    medicine: 0,
    equipment: 0,
    // Add other categories if needed
  };

  // Check each item in the inventory
  inventory.forEach((item) => {
    const recipient = item.hospitalId || item.clinicId;

    // Check for low stock
    if (item.currentStock < item.minimumStock) {
      alerts.push({
        type: 'Low Stock',
        itemName: item.itemName,
        currentStock: item.currentStock,
        minimumStock: item.minimumStock,
        recipient,
        category: item.category,
      });

      // Increment category count
      if (categoryCount[item.category] !== undefined) {
        categoryCount[item.category]++;
      }
    }

    // Check for out of stock
    if (item.currentStock === 0) {
      alerts.push({
        type: 'Out of Stock',
        itemName: item.itemName,
        recipient,
        category: item.category,
      });

      // Increment category count
      if (categoryCount[item.category] !== undefined) {
        categoryCount[item.category]++;
      }
    }

    // Check for near expiry (e.g., within 30 days)
    item.batches.forEach((batch) => {
      const expiryDate = moment(batch.expiryDate);
      const daysToExpiry = expiryDate.diff(moment(), 'days');
      if (daysToExpiry <= 30) {
        alerts.push({
          type: 'Near Expiry',
          itemName: item.itemName,
          batchNumber: batch.batchNumber,
          expiryDate: batch.expiryDate,
          recipient,
          category: item.category,
        });

        // Increment category count
        if (categoryCount[item.category] !== undefined) {
          categoryCount[item.category]++;
        }
      }
    });
  });

  // Send email alerts if any are found
  if (alerts.length > 0) {
    alerts.forEach((alert) => {
      sendEmailAlert(alert);
    });
  }

  // Return the response with category-wise item counts and alerts
  res.status(200).json({
    status: 'success',
    ...categoryCount, // This will show medicine, equipment counts
    alerts, // The actual alerts data
  });

  // next();  // You can uncomment this if you need to pass to the next middleware
});

// Schedule a job to check inventory daily at midnight
cron.schedule('0 0 * * *', () => {
  console.log('Running daily inventory check...');
  checkInventoryForAlerts();
});

exports.getInventoryAlerts = catchAsync(async (req, res, next) => {
  await checkInventoryForAlerts(req, res, next);
  // res
  //   .status(200)
  //   .json({ status: 'success', message: 'Inventory alerts processed.' });
});
