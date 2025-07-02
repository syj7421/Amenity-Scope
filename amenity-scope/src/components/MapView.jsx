import React from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100vh',
};

const center = {
  lat: -37.8136,  // Melbourne
  lng: 144.9631,
};

const MapView = () => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    console.log("api key:" + apiKey);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={14}
    >
      {/* 지도 위에 마커, 원, UI 등은 여기에 추가 */}
    </GoogleMap>
  );
};

export default MapView;
