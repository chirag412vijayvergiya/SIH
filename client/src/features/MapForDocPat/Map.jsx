import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from 'react-leaflet';
import styles from './Map.module.css';
import { useEffect, useState } from 'react';
import Button from '../../ui/Button';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useUrlPosition } from '../../hooks/useUrlPosition';
import { useNavigate } from 'react-router-dom';

function Map() {
  const navigate = useNavigate();
  const [mapPosition, setMapPosition] = useState([20.385044, 78.072971]);
  const {
    isLoading: isLoadingPostion,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation(null, (newPosition) => {
    // console.log(newPosition);
    navigate(
      `nearest-hospitals/clinic?lat=${newPosition.lat}&lng=${newPosition.lng}`,
    );
  });
  const [mapLat, mapLng] = useUrlPosition();

  useEffect(
    function () {
      if (mapLat && mapLng) {
        setMapPosition([mapLat, mapLng]);
      }
    },
    [mapLat, mapLng],
  );

  useEffect(
    function () {
      if (geolocationPosition) {
        console.log(geolocationPosition);
        setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
      }
    },
    [geolocationPosition],
  );

  return (
    <div className="relative h-[100%] w-full overflow-hidden bg-gray-500 md:h-[calc(100vh-6rem)] md:w-1/2 md:flex-1">
      {!geolocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPostion ? 'Loading...' : 'Use your position'}
        </Button>
      )}

      <MapContainer
        center={mapPosition}
        zoom={9}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        <Marker position={mapPosition}>
          <Popup>
            <div className="flex items-center ">
              <span className="text-sm leading-none">A pretty CSS3 popup.</span>
              <span>Easily customizable.</span>
            </div>
          </Popup>
        </Marker>
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvent({
    click: (e) =>
      navigate(
        `nearest-hospitals/clinic?lat=${e.latlng.lat}&lng=${e.latlng.lng}`,
      ),
  });
}

export default Map;
