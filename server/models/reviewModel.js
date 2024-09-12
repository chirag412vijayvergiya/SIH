// const mongoose = require('mongoose');
// const Doctor = require('./doctorModel');

// const reviewSchema = new mongoose.Schema(
//   {
//     review: {
//       type: String,
//       required: [true, 'Review can not be empty!'],
//     },
//     rating: {
//       type: Number,
//       min: 1,
//       max: 5,
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now(),
//     },
//     // doctor: {
//     //   type: mongoose.Schema.ObjectId,
//     //   ref: 'Doctor',
//     //   required: [true, 'Review must belong to a doctor.'],
//     // },
//     // hospital: {
//     //   type: mongoose.Schema.ObjectId,
//     //   ref: 'Hospital',
//     //   required: [true, 'Review must belong to a hospital.'],
//     // },
//     doctor: {
//       type: mongoose.Schema.ObjectId,
//       ref: 'Doctor',
//       required: function () {
//         return !this.hospital; // Only required if hospital is not provided
//       },
//     },
//     hospital: {
//       type: mongoose.Schema.ObjectId,
//       ref: 'Hospital',
//       required: function () {
//         return !this.doctor; // Only required if doctor is not provided
//       },
//     },
//     patient: {
//       type: mongoose.Schema.ObjectId,
//       ref: 'Patient',
//       required: [true, 'Review must belong to a patient.'],
//     },
//   },
//   {
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//     id: false,
//   },
// );

// reviewSchema.index({ patient: 1, doctor: 1 }, { unique: true });
// reviewSchema.pre(/^find/, function (next) {
//   //   this.populate({
//   //     path: 'patient',
//   //     select: 'name',
//   //   }).populate({
//   //     path: 'doctor',
//   //     select: 'name',
//   //   });

//   this.populate({
//     path: 'patient',
//     select: ['name', 'photo'],
//   });

//   next();
// });

// reviewSchema.statics.calcAverageRatings = async function (doctorId) {
//   console.log(doctorId);
//   const stats = await this.aggregate([
//     {
//       $match: { doctor: doctorId },
//     },
//     {
//       $group: {
//         _id: '$doctor',
//         nRating: { $sum: 1 },
//         avgRating: { $avg: '$rating' },
//       },
//     },
//   ]);
//   console.log(stats);
//   if (stats.length > 0) {
//     await Doctor.findByIdAndUpdate(doctorId, {
//       ratingsQuantity: stats[0].nRating,
//       ratingsAverage: stats[0].avgRating,
//     });
//   } else {
//     await Doctor.findByIdAndUpdate(doctorId, {
//       ratingsQuantity: 0,
//       ratingsAverage: 4.5,
//     });
//   }
// };

// reviewSchema.post('save', function () {
//   console.log(this.doctor._id);
//   this.constructor.calcAverageRatings(this.doctor);
// });

// //findByIdAndUpdate
// //findByIdAndDelete
// /*
// reviewSchema.pre(/^findOneAnd/, async function (next) {
//   this.r = await this.findOne();
//   // console.log(this.r);
//   next();
// });
// */
// // In post query middleware we got doc parameter which is nothing but the executed document
// reviewSchema.post(/^findOneAnd/, async (doc) => {
//   if (doc) await doc.constructor.calcAverageRatings(doc.doctor);
// });
// // ******************************************************************************* //

// const Review = mongoose.model('Review', reviewSchema);

// module.exports = Review;

const mongoose = require('mongoose');
const Doctor = require('./doctorModel');
const Hospital = require('./hospitalModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    doctor: {
      type: mongoose.Schema.ObjectId,
      ref: 'Doctor',
      required: function () {
        return !this.hospital; // Only required if hospital is not provided
      },
    },
    hospital: {
      type: mongoose.Schema.ObjectId,
      ref: 'Hospital',
      required: function () {
        return !this.doctor; // Only required if doctor is not provided
      },
    },
    patient: {
      type: mongoose.Schema.ObjectId,
      ref: 'Patient',
      required: [true, 'Review must belong to a patient.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  },
);

// Custom validation to ensure that only one of doctor or hospital is provided
reviewSchema.pre('validate', function (next) {
  if (!this.doctor && !this.hospital) {
    return next(
      new Error(
        'Review must be associated with either a doctor or a hospital.',
      ),
    );
  }
  if (this.doctor && this.hospital) {
    return next(
      new Error(
        'Review cannot be associated with both a doctor and a hospital.',
      ),
    );
  }
  next();
});

// reviewSchema.index({ patient: 1, doctor: 1 }, { unique: true });

// reviewSchema.index({ patient: 1, hospital: 1 }, { unique: true });

// Creating separate conditional unique indexes
reviewSchema.index(
  { patient: 1, doctor: 1 },
  { unique: true, partialFilterExpression: { doctor: { $exists: true } } },
);
reviewSchema.index(
  { patient: 1, hospital: 1 },
  { unique: true, partialFilterExpression: { hospital: { $exists: true } } },
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'patient',
    select: ['name', 'photo'],
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (
  doctorId,
  hospitalId,
) {
  if (doctorId) {
    const stats = await this.aggregate([
      { $match: { doctor: doctorId } },
      {
        $group: {
          _id: '$doctor',
          nRating: { $sum: 1 },
          avgRating: { $avg: '$rating' },
        },
      },
    ]);
    if (stats.length > 0) {
      await Doctor.findByIdAndUpdate(doctorId, {
        ratingsQuantity: stats[0].nRating,
        ratingsAverage: stats[0].avgRating,
      });
    } else {
      await Doctor.findByIdAndUpdate(doctorId, {
        ratingsQuantity: 0,
        ratingsAverage: 4.5,
      });
    }
  }

  if (hospitalId) {
    const stats = await this.aggregate([
      { $match: { hospital: hospitalId } },
      {
        $group: {
          _id: '$hospital',
          nRating: { $sum: 1 },
          avgRating: { $avg: '$rating' },
        },
      },
    ]);
    if (stats.length > 0) {
      await Hospital.findByIdAndUpdate(hospitalId, {
        ratingsQuantity: stats[0].nRating,
        ratingsAverage: stats[0].avgRating,
      });
    } else {
      await Hospital.findByIdAndUpdate(hospitalId, {
        ratingsQuantity: 0,
        ratingsAverage: 4.5,
      });
    }
  }
};

reviewSchema.post('save', function () {
  if (this.doctor) {
    this.constructor.calcAverageRatings(this.doctor, null);
  } else if (this.hospital) {
    this.constructor.calcAverageRatings(null, this.hospital);
  }
});

reviewSchema.post(/^findOneAnd/, async (doc) => {
  if (doc) {
    if (doc.doctor) {
      await doc.constructor.calcAverageRatings(doc.doctor, null);
    } else if (doc.hospital) {
      await doc.constructor.calcAverageRatings(null, doc.hospital);
    }
  }
});

const Review = mongoose.model('Review', reviewSchema);

Review.syncIndexes()
  .then(() => console.log('Indexes synced'))
  .catch((error) => console.error('Error syncing indexes:', error));

module.exports = Review;
