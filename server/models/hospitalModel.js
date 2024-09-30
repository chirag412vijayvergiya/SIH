const mongoose = require('mongoose');
// const slugify = require('slugify');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const hospitalSchema = new mongoose.Schema(
  {
    // googleId: String,
    name: {
      type: String,
      required: [true, 'Please tell your Hospital name!'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide your email'],
    },
    role: {
      type: String,
      default: 'hospital',
    },
    website: { type: String, required: true },
    address: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    photo: {
      type: String,
      default:
        'https://res.cloudinary.com/dzhyyyxpv/image/upload/v1718378101/users/user-65c145c36311be26c72960ac-1718378099343.jpg',
    },
    accreditation: {
      type: String,
      required: [true, 'Please provide your accreditation'],
    },
    bedCapacity: { type: Number, required: true },
    availableBeds: { type: Number, required: true },
    emergencyServices: { type: Boolean, required: true },
    registrationDate: { type: Date, required: true },
    departments: {
      type: [String],
      validate: {
        validator: function (value) {
          // Custom validator function to check if the array is not empty
          return value && value.length > 0;
        },
        message: 'At least one departments is required.',
      },
    },
    fees: {
      type: Number,
      required: [true, 'A hospital must have a starting fees'],
    },
    password: {
      type: String,
      // required: [true, 'Please provide a password'],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      // required: [true, 'Please confirm your password'],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!',
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    phone: {
      type: String,
      required: [true, 'Please provide your Mobile Number'],
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating muust be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true }, // By this we ensure that virtual properties are included when i
    toObject: { virtuals: true }, //convert a Mongoose document to either JSON or JavaScript object.
  },
);

hospitalSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'hospital',
  localField: '_id',
});

// ******************************************************************************* //

// Set the Password when password will actually modified
hospitalSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified (isModified is inbuilt method).
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// ******************************************************************************* //

// Set the Password changed date when password change
hospitalSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// ******************************************************************************* //

//The pre middleware that runs before any query with a method starting with "find".
//At the time of find it will select only user which is not equal to false.
hospitalSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

// ******************************************************************************* //

// This is the method that will check whether user credentials is correct or not (It will not save in the databases).
hospitalSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

hospitalSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  // Convert the passwordChangedAt timestamp to seconds
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000, // 1000 for miliseconds to seconds and result will be store in decimal (base 10)
      10,
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

hospitalSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256') // 'sha256 is a hashing algorithm '
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Current time + 10 minutes

  return resetToken;
};

// ******************************************************************************* //
const Hospital = mongoose.model('Hospital', hospitalSchema);

module.exports = Hospital;
