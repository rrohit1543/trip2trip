'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Trip, LiveTelemetry } from '../../types';
import 'leaflet/dist/leaflet.css';

// Black & Red Bus Icon
const createBusIcon = (speed: number, isLive: boolean) => {
  const iconHtml = `
    <div class="relative flex items-center justify-center">
      ${isLive ? '<div class="absolute -inset-2 rounded-full bg-red-600/40 animate-ping"></div>' : ''}
      <div class="relative flex items-center gap-1.5 bg-black border-2 border-red-600 text-white px-2.5 py-1 rounded-full shadow-2xl font-semibold text-xs transition-transform duration-300 hover:scale-110">
        <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h8m-8 4h8m-4 8l-4-4h8l-4 4 shadow-sm" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span class="text-white font-bold">${speed > 0 ? `${speed} km/h` : 'LIVE'}</span>
      </div>
    </div>
  `;
  return L.divIcon({
    html: iconHtml,
    className: 'custom-bus-marker',
    iconSize: [80, 40],
    iconAnchor: [40, 20],
  });
};

const createStopIcon = (title: string, isPickup: boolean) => {
  const iconHtml = `
    <div class="flex items-center gap-1 bg-black text-white text-[11px] font-medium px-2 py-0.5 rounded border border-neutral-700 shadow-lg">
      <span class="w-2 h-2 rounded-full ${isPickup ? 'bg-red-600' : 'bg-white'}"></span>
      <span>${title}</span>
    </div>
  `;
  return L.divIcon({
    html: iconHtml,
    className: 'custom-stop-marker',
    iconSize: [120, 24],
    iconAnchor: [10, 12],
  });
};

function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.panTo(center, { animate: true, duration: 1 });
  }, [center, map]);
  return null;
}

interface LiveTripMapProps {
  trip: Trip;
  telemetry?: LiveTelemetry;
  height?: string;
}

export default function LiveTripMapInner({ trip, telemetry, height = '450px' }: LiveTripMapProps) {
  const currentPos: [number, number] = telemetry
    ? [telemetry.currentLat, telemetry.currentLng]
    : trip.routePath[0] || [28.6139, 77.2090];

  const polylineCoords: [number, number][] = trip.routePath.length > 0
    ? trip.routePath
    : [currentPos, [trip.pickupLocation.lat, trip.pickupLocation.lng]];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-neutral-900 bg-black" style={{ height }}>
      <MapContainer
        center={currentPos}
        zoom={9}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', background: '#000000' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapRecenter center={currentPos} />

        {/* Route Line Polyline in Red */}
        <Polyline
          positions={polylineCoords}
          pathOptions={{ color: '#ef4444', weight: 5, opacity: 0.9, dashArray: '8, 8' }}
        />

        {/* Pickup Pin */}
        <Marker
          position={[trip.pickupLocation.lat, trip.pickupLocation.lng]}
          icon={createStopIcon(`Pickup: ${trip.pickupLocation.name.split(',')[0]}`, true)}
        >
          <Popup>
            <div className="text-xs p-1">
              <strong className="text-red-500 block font-semibold">Exact Pickup Location</strong>
              <span>{trip.pickupLocation.name}</span>
            </div>
          </Popup>
        </Marker>

        {/* Drop Points */}
        {trip.dropPoints.map((drop, idx) => (
          <Marker
            key={idx}
            position={[drop.lat, drop.lng]}
            icon={createStopIcon(`Drop: ${drop.name.split(',')[0]}`, false)}
          >
            <Popup>
              <div className="text-xs p-1">
                <strong className="text-white block font-semibold">Drop Location #{idx + 1}</strong>
                <span>{drop.name}</span>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Live Moving Vehicle Marker */}
        <Marker
          position={currentPos}
          icon={createBusIcon(telemetry?.currentSpeed || 0, trip.status === 'live')}
        >
          <Popup>
            <div className="text-xs p-1 leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-red-500">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                <span>{trip.vehicle.regNumber}</span>
              </div>
              <p className="text-white font-medium mt-1">{trip.name}</p>
              <p className="text-neutral-400">Operator: {trip.operatorName}</p>
              <p className="text-neutral-400">Speed: {telemetry?.currentSpeed || 60} km/h</p>
              <p className="text-red-400 font-semibold mt-1">Next Stop: {telemetry?.nextStopName || 'En-route'}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Floating Speedometer & ETA Overlay in Black & Red */}
      {telemetry && (
        <div className="absolute top-4 left-4 z-[1000] flex flex-wrap gap-2 pointer-events-none">
          <div className="bg-black/90 backdrop-blur-md border border-red-600 text-white px-3.5 py-2 rounded-xl shadow-xl flex items-center gap-3 pointer-events-auto">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-red-600/20 border border-red-600">
              <span className="text-red-500 font-black text-sm">{telemetry.currentSpeed}</span>
              <span className="text-[9px] text-red-300 absolute -bottom-1">KM/H</span>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Live GPS Tracker</div>
              <div className="text-xs font-bold text-white flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span>Next: {telemetry.nextStopName}</span>
              </div>
            </div>
          </div>

          <div className="bg-black/90 backdrop-blur-md border border-neutral-800 text-white px-3.5 py-2 rounded-xl shadow-xl flex items-center gap-3 pointer-events-auto">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">ETA Destination</div>
              <div className="text-xs font-bold text-red-500">{telemetry.etaDestination}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
