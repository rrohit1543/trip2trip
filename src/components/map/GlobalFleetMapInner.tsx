'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Trip, LiveTelemetry } from '../../types';
import 'leaflet/dist/leaflet.css';

const createFleetIcon = (operatorName: string, isLive: boolean) => {
  const iconHtml = `
    <div class="relative flex items-center justify-center cursor-pointer group">
      ${isLive ? '<div class="absolute -inset-2 rounded-full bg-red-600/40 animate-ping"></div>' : ''}
      <div class="relative flex items-center gap-1.5 bg-black border-2 border-red-600 text-white px-3 py-1 rounded-full shadow-2xl font-bold text-xs">
        <span class="w-2.5 h-2.5 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-neutral-500'}"></span>
        <span class="text-white font-extrabold">${operatorName.split(' ')[0]}</span>
      </div>
    </div>
  `;
  return L.divIcon({
    html: iconHtml,
    className: 'custom-fleet-marker',
    iconSize: [120, 36],
    iconAnchor: [60, 18],
  });
};

interface GlobalFleetMapProps {
  trips: Trip[];
  telemetry: Record<string, LiveTelemetry>;
  height?: string;
  onSelectTrip?: (trip: Trip) => void;
}

export default function GlobalFleetMapInner({ trips, telemetry, height = '500px', onSelectTrip }: GlobalFleetMapProps) {
  const center: [number, number] = [22.5937, 78.9629];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-neutral-900 bg-black" style={{ height }}>
      <MapContainer
        center={center}
        zoom={5}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', background: '#000000' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {trips.map((trip) => {
          const telem = telemetry[trip.id];
          const pos: [number, number] = telem
            ? [telem.currentLat, telem.currentLng]
            : trip.routePath[0] || [28.6139, 77.2090];

          return (
            <React.Fragment key={trip.id}>
              {trip.routePath.length > 0 && (
                <Polyline
                  positions={trip.routePath}
                  pathOptions={{
                    color: trip.status === 'live' ? '#ef4444' : '#525252',
                    weight: trip.status === 'live' ? 4 : 2,
                    opacity: 0.8,
                  }}
                />
              )}

              <Marker
                position={pos}
                icon={createFleetIcon(trip.operatorName, trip.status === 'live')}
              >
                <Popup>
                  <div className="text-xs p-2 min-w-[200px]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">{trip.operatorName}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${trip.status === 'live' ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-300'}`}>
                        {trip.status.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="font-semibold text-white leading-snug">{trip.name}</h4>
                    <p className="text-neutral-400 font-medium mt-1">{trip.departureCity} &rarr; {trip.destinationCity}</p>

                    {telem && (
                      <div className="mt-2 pt-2 border-t border-neutral-800 flex justify-between text-neutral-300">
                        <span>Speed: <strong>{telem.currentSpeed} km/h</strong></span>
                        <span>Progress: <strong>{telem.progressPercent}%</strong></span>
                      </div>
                    )}

                    {onSelectTrip && (
                      <button
                        onClick={() => onSelectTrip(trip)}
                        className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition"
                      >
                        Track This Trip Live
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>

      <div className="absolute bottom-4 left-4 z-[1000] bg-black/90 backdrop-blur-md border border-neutral-800 text-white px-3.5 py-2 rounded-xl text-xs flex items-center gap-4 shadow-xl">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
          <span className="font-semibold">Live GPS Active</span>
        </div>
        <div className="flex items-center gap-1.5 text-neutral-400">
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-600"></span>
          <span>Upcoming Departure</span>
        </div>
      </div>
    </div>
  );
}
