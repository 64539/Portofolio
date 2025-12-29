"use client";

import { motion } from "framer-motion";
import { Component, type ReactNode, useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import Terminal from "./Terminal";

const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 z-0 flex items-center justify-center bg-black/80 text-cyber-blue font-mono text-xs animate-pulse">
      Loading Satellite Data...
    </div>
  ),
});

class PanelErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { hasError: boolean }> {
  constructor(props: { fallback: ReactNode; children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function RadarOverlay() {
  return (
    <div className="absolute top-5 right-5 z-20 w-[200px] h-[200px] glass-panel rounded-lg overflow-hidden border border-cyber-blue/30">
      <div className="h-full bg-black/70 p-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative h-full flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <radialGradient id="ob_rg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </radialGradient>
            </defs>

            <circle cx="100" cy="100" r="90" fill="url(#ob_rg)" />
            <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(59,130,246,0.35)" strokeWidth="2" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(59,130,246,0.22)" strokeWidth="1" />
            <circle cx="100" cy="100" r="30" fill="none" stroke="rgba(59,130,246,0.18)" strokeWidth="1" />

            <g className="radar-sweep" style={{ transformOrigin: "100px 100px" }}>
              <path d="M100 100 L100 10 A90 90 0 0 1 160 28 Z" fill="rgba(6,182,212,0.28)" />
              <line x1="100" y1="100" x2="100" y2="10" stroke="#06b6d4" strokeWidth="2" />
            </g>

            <circle cx="100" cy="100" r="2" fill="#06b6d4" />
            <circle cx="62" cy="78" r="2" className="radar-pulse" fill="#60a5fa" opacity="0.9" />
            <circle cx="138" cy="116" r="2" className="radar-pulse" fill="#06b6d4" opacity="0.9" />
            <circle cx="112" cy="58" r="2" className="radar-pulse" fill="#60a5fa" opacity="0.9" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function OperationalBase() {
  const [isExpanded, setIsExpanded] = useState(false);
  const mapFallback = useMemo(
    () => (
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-black/80">
        <div className="font-mono text-xs text-gray-500">Satellite feed unavailable.</div>
      </div>
    ),
    []
  );

  return (
    <section className="py-20 relative z-10 mb-[30px]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
         "use client";

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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
  const basePosition: [number, number] = [-6.1115, 106.8926];
  const schoolPosition: [number, number] = [-6.1098, 106.8912];

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
            <strong className="text-cyber-blue">BASE OF OPERATIONS</strong><br />
            North Jakarta<br />
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
      <Circle
        center={schoolPosition}
        pathOptions={{ color: "#06b6d4", opacity: 0.5 }}
        radius={900}
        className="radar-ring"
      />
    </MapContainer>
  );
}
