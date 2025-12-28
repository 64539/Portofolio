"use client";

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix for default marker icon in Next.js
const iconUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapComponent() {
  const position: [number, number] = [-6.1115, 106.8926]; // North Jakarta

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={false}
      className="w-full h-full z-0"
      style={{ background: "#050505" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <Marker position={position} icon={customIcon}>
        <Popup className="glass-popup">
          <div className="font-mono text-sm">
            <strong className="text-cyber-blue">BASE OF OPERATIONS</strong><br />
            North Jakarta<br />
            <span className="text-xs text-gray-400">Coords: 6.1115° S, 106.8926° E</span>
          </div>
        </Popup>
      </Marker>
      <Circle
        center={position}
        pathOptions={{ fillColor: '#3b82f6', color: '#3b82f6' }}
        radius={1000}
        className="animate-pulse-slow"
      />
    </MapContainer>
  );
}
