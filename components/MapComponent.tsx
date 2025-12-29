"use client";

import { useMemo } from "react";
import { Circle, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";

const iconUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png";

export default function MapComponent() {
  const basePosition: [number, number] = [-6.1115, 106.8926];
  const schoolPosition: [number, number] = [-6.1098, 106.8912];

  const customIcon = useMemo(
    () =>
      new L.Icon({
        iconUrl,
        iconRetinaUrl,
        shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      }),
    []
  );

  return (
    <MapContainer
      center={basePosition}
      zoom={13}
      scrollWheelZoom={false}
      className="w-full h-full z-0"
      style={{ background: "#050505" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      <Marker position={basePosition} icon={customIcon}>
        <Popup className="glass-popup">
          <div className="font-mono text-sm">
            <strong className="text-cyber-blue">BASE OF OPERATIONS</strong>
            <br />
            North Jakarta
            <br />
            <span className="text-xs text-gray-400">Coords: 6.1115° S, 106.8926° E</span>
          </div>
        </Popup>
      </Marker>

      <Circle
        center={basePosition}
        pathOptions={{ fillColor: "#3b82f6", color: "#3b82f6", fillOpacity: 0.12, opacity: 0.4 }}
        radius={1000}
        className="animate-pulse-slow"
      />

      <Marker position={schoolPosition} icon={customIcon}>
        <Popup className="glass-popup">
          <div className="font-mono text-sm">
            <strong className="text-cyber-cyan">CORE EDUCATION SECTOR</strong>
            <br />
            SMKN 12 Jakarta (Kebon Bawang)
          </div>
        </Popup>
      </Marker>

      <Circle
        center={schoolPosition}
        pathOptions={{ fillColor: "#06b6d4", color: "#06b6d4", fillOpacity: 0.18, opacity: 0.9 }}
        radius={420}
        className="radar-pulse"
      />

      <Circle center={schoolPosition} pathOptions={{ color: "#06b6d4", opacity: 0.5 }} radius={900} className="radar-ring" />
    </MapContainer>
  );
}
