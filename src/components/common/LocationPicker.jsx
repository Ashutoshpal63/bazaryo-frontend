// src/components/common/LocationPicker.jsx

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Import marker icons using the ESM `import` syntax, which works with Vite/Create-React-App
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// This part fixes the default icon issue by merging the imported images
// into Leaflet's default icon configuration.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// A helper component to handle map events like clicks and auto-locating the user
const LocationMarker = ({ position, setPosition }) => {
  const map = useMapEvents({
    // Fired when the user clicks on the map
    click(e) {
      setPosition(e.latlng);
    },
    // Fired when the map successfully determines the user's location
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  // Effect to move the map view to the pin's location when it changes
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  // On initial load, if no position is set, try to find the user's location
  useEffect(() => {
    if (!position) {
      map.locate();
    }
  }, [map, position]);

  // Render the marker only when a position is available
  return position === null ? null : (
    <Marker position={position}>
      <Popup>Your selected location</Popup>
    </Marker>
  );
};

export const LocationPicker = ({ onLocationChange, initialPosition }) => {
  const [position, setPosition] = useState(initialPosition);

  // This effect ensures that if the initialPosition (from the user's saved profile)
  // loads after the component has already rendered, we update the map.
  useEffect(() => {
    if (initialPosition && (!position || initialPosition.lat !== position.lat)) {
      setPosition(initialPosition);
    }
  }, [initialPosition, position]);

  // When the internal 'position' state changes (e.g., from a map click),
  // we call the parent's onLocationChange function to update the main form.
  useEffect(() => {
    if (position) {
      onLocationChange({ lat: position.lat, lng: position.lng });
    }
  }, [position, onLocationChange]);

  const defaultCenter = [28.6139, 77.2090]; // Default to Delhi, India if no location is set

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Pin Your Location on the Map
      </label>
      <div className="h-80 w-full rounded-lg overflow-hidden border-2 border-slate-200 focus-within:border-cyan-500">
        <MapContainer
          center={position || defaultCenter}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
      </div>
      <p className="text-xs text-slate-500 mt-2">Click on the map or allow browser access to set your location.</p>
    </div>
  );
};