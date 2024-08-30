const Hospital = require('../models/hospitalModel');
const factory = require('./handleFactory');

exports.createHospital = factory.createOne(Hospital);

// Haversine formula to calculate the distance between two points on the Earth
function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRadians = (degree) => (degree * Math.PI) / 180;

  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
}

exports.findNearbyHospitals = async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ error: 'Latitude and longitude are required' });
  }

  try {
    // Fetch all hospitals from the database
    const hospitals = await Hospital.find();

    // Calculate distance and sort hospitals by distance
    const sortedHospitals = hospitals
      .map((hospital) => {
        const distance = haversineDistance(
          latitude,
          longitude,
          hospital.coordinates.latitude,
          hospital.coordinates.longitude,
        );
        return { ...hospital._doc, distance };
      })
      .sort((a, b) => a.distance - b.distance);

    res.status(200).json(sortedHospitals);
  } catch (error) {
    console.error('Error finding nearby hospitals:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
