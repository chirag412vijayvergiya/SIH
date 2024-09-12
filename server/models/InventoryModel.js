const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['medicine', 'equipment'],
      required: true,
    },
    minimumStock: {
      type: Number,
      required: true,
      min: [0, 'Minimum stock cannot be negative'],
    },
    currentStock: {
      type: Number,
      required: true,
      min: [0, 'Current stock cannot be negative'],
    },
    // quantityStatus: {
    //   type: String,
    //   enum: ['low stock', 'out of stock', 'in stock'],
    //   required: true,
    // },
    supplierName: {
      type: String,
      required: true,
      trim: true,
    },
    supplierEmail: {
      type: String,
      required: true,
      trim: true,
      match: [/.+@.+\..+/, 'Please enter a valid email address'], // Email validation
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
    },
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clinic',
    },
  },
  {
    timestamps: true, // Automatically create createdAt and updatedAt timestamps
  },
);

// Custom validation to ensure that only one of hospitalId or clinicId is provided
inventorySchema.pre('save', function (next) {
  if (!this.hospitalId && !this.clinicId) {
    return next(new Error('Either hospitalId or clinicId must be provided.'));
  }
  if (this.hospitalId && this.clinicId) {
    return next(
      new Error(
        'Only one of hospitalId or clinicId can be provided at a time.',
      ),
    );
  }
  next();
});

// Compound unique index to ensure no duplicate entries for same item and category per hospital or clinic
// Compound unique index to ensure no duplicate entries for the same item and category per hospital or clinic
inventorySchema.index(
  { itemName: 1, category: 1, hospitalId: 1 },
  { unique: true, partialFilterExpression: { hospitalId: { $exists: true } } },
);

// Partial index for clinicId uniqueness (if you need similar validation for clinics)
inventorySchema.index(
  { itemName: 1, category: 1, clinicId: 1 },
  { unique: true, partialFilterExpression: { clinicId: { $exists: true } } },
);

// Create and export model
const Inventory = mongoose.model('Inventory', inventorySchema);

// Force index creation
// Inventory.syncIndexes()
//   .then(() => console.log('Indexes synced'))
//   .catch((error) => console.error('Error syncing indexes:', error));

module.exports = Inventory;
