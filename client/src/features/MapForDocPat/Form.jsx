import { useEffect, useState } from 'react';
import { useUrlPosition } from '../../hooks/useUrlPosition';
import { useGetNearhospitals } from './useGetNearhospitals';
import { BsFillTelephoneFill } from 'react-icons/bs';

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [lat, lng] = useUrlPosition();
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [cityName, setCityName] = useState('');
  const [country, setCountry] = useState('');
  const [emoji, setEmoji] = useState('');
  const [geoCodingError, setGeoCodingError] = useState('');

  // Use custom hook to fetch nearby hospitals based on latitude and longitude
  const { isPending, hospitals } = useGetNearhospitals(lat, lng);

  useEffect(() => {
    if (!lat || !lng) return;

    async function fetchCityData() {
      try {
        setIsLoadingGeocoding(true);
        setGeoCodingError('');
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}?latitude=${lat}&longitude=${lng}`,
        );

        const data = await res.json();
        console.log(data);

        if (!data.countryCode)
          throw new Error(
            'That does not seem to be a city. Click somewhere else. 🙃',
          );

        setCityName(data.city || data.locality || '');
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));
      } catch (err) {
        setGeoCodingError(err.message);
      } finally {
        setIsLoadingGeocoding(false);
      }
    }

    fetchCityData();
  }, [lat, lng]);

  return (
    <>
      <form
        className="mt-4 flex w-full flex-col gap-8 rounded-lg bg-slate-700 p-4 font-mono md:p-8 md:py-2"
        // onSubmit={handleSubmit}
      >
        <div className="relative flex flex-col gap-2 ">
          <label htmlFor="cityName" className="text-white">
            City name
          </label>
          <input
            id="cityName"
            onChange={(e) => setCityName(e.target.value)}
            className="rounded-md border-[1px] border-solid p-[0.4rem_0.8rem] text-slate-900"
            value={cityName}
          />
          <span className="absolute right-4 top-9 text-3xl">{emoji}</span>
        </div>
      </form>

      <div className="mt-4 flex w-full flex-col gap-8 rounded-lg bg-slate-700 p-4 font-mono md:p-8 md:py-3">
        <div className="relative flex flex-col gap-2 font-mono">
          <label htmlFor="cityName" className="mx-auto text-green-300">
            Hospitals in Ascending Order of Distance
          </label>

          {isPending ? (
            <div className="text-white">Loading hospitals...</div>
          ) : hospitals && hospitals.length > 0 ? (
            hospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="flex flex-col gap-2 border-b-2 border-blue-600"
              >
                <div className="flex justify-between">
                  <span className="text-lg text-indigo-300">
                    {hospital.name}
                  </span>
                  <span className="text-green-300">
                    {parseFloat(hospital.distance).toFixed(2)} km
                  </span>
                </div>
                <span className="text-white">{hospital.address}</span>
                <div className="flex items-center justify-between">
                  <span className="text-white">
                    Beds Available: {hospital.availableBeds}
                  </span>
                  <a
                    href={`tel:${hospital.phone}`}
                    className="flex items-center text-white hover:text-grey-400"
                  >
                    <BsFillTelephoneFill className="mr-2" /> {hospital.phone}
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="text-white">No hospitals found.</div>
          )}
        </div>
      </div>
    </>
  );
}

export default Form;
