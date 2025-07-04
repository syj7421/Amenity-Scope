import React, { useState, useRef } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100vh',
};

const center = {
  lat: -37.8136,
  lng: 144.9631,
};

const MapView = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const mapRef = useRef(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [places, setPlaces] = useState([]);

  const handleMapLoad = (map) => {
    mapRef.current = map;
  };

  const handleMapClick = (event) => {
    setSelectedPosition({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
    setPlaces([]); // 클릭할 때 기존 마커 초기화
  };

  const handleSearchNearby = () => {
    if (!selectedPosition || !mapRef.current) return;

    const service = new window.google.maps.places.PlacesService(mapRef.current);

    const request = {
      location: selectedPosition,
      radius: 800, // 대략 도보 10분 (800m)
      type: ['restaurant', 'convenience_store', 'cafe', 'supermarket'], // 원하는 시설 유형
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setPlaces(results);
      } else {
        console.error('Places search failed:', status);
      }
    });
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        onClick={handleMapClick}
        onLoad={handleMapLoad}
      >
        {/* 클릭한 지점 마커 */}
        {selectedPosition && (
          <Marker position={selectedPosition} />
        )}

        {/* 검색된 장소 마커들 */}
        {places.map((place, index) => (
          <Marker
            key={index}
            position={{
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            }}
          />
        ))}
      </GoogleMap>

      {/* 버튼 */}
      {selectedPosition && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 1000,
            background: 'white',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          }}
        >
          <button onClick={handleSearchNearby}>
            도보 10분 거리 시설 찾기
          </button>
        </div>
      )}
    </>
  );
};

export default MapView;
