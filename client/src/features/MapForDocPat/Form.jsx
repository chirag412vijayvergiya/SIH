import { useEffect, useState } from 'react';
import { useUrlPosition } from '../../hooks/useUrlPosition';

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
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [emoji, setEmoji] = useState('');
  const [geoCodingError, setGeoCodingError] = useState('');

  useEffect(
    function () {
      console.log(lat, lng);
      if (!lat && !lng) {
        return;
      }
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
    },
    [lat, lng],
  );
  return (
    <form
      className="mt-4 flex w-full flex-col gap-8 rounded-lg bg-slate-700 p-4 font-mono md:p-8"
      //   onSubmit={handleSubmit}
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
  );
}

export default Form;
