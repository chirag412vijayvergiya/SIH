import customFetch from '../utils/customFetch';

export async function getHospitals({ latitude, longitude }) {
  try {
    const response = await customFetch.get(
      `/hospitals/nearby?latitude=${latitude}&longitude=${longitude}`,
    );
    console.log('Find Near hospitals:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching nearest hospitals: ', error);
    throw new Error('Failed to fetch nearest hospitals');
  }
}
