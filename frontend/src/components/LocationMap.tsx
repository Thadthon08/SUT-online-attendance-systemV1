import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const customMarker = new L.Icon({
  iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-green.png",
  iconSize: [38, 95],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
  shadowUrl: "https://leafletjs.com/examples/custom-icons/leaf-shadow.png",
  shadowSize: [50, 64],
  shadowAnchor: [4, 62],
});

function RecenterMap({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView([center.lat, center.lng], 15);
  }, [center, map]);
  return null;
}

interface LocationMapProps {
  currentLocation: { lat: number; lng: number };
}

export const LocationMap: React.FC<LocationMapProps> = ({
  currentLocation,
}) => {
  return (
    <MapContainer
      center={currentLocation}
      zoom={15}
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <RecenterMap center={currentLocation} />
      {currentLocation.lat && currentLocation.lng && (
        <Marker position={currentLocation} icon={customMarker}>
          <Popup>
            ที่อยู่ปัจจุบันของคุณ <br /> (Latitude: {currentLocation.lat},{" "}
            <br />
            Longitude: {currentLocation.lng})
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};
