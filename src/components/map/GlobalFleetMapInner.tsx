'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Trip, LiveTelemetry } from '../../types';
import 'leaflet/dist/leaflet.css';

const createFleetIcon = (operatorName: string, isLive: boolean) => {
  const iconHtml = `
    <div class="relative flex items-center justify-center cursor-pointer group">
      ${isLive ? '<div class="absolute -inset-2 rounded-full bg-emerald-500/40 animate-ping"></div>' : ''}
      <div class="relative flex items-center gap-1.5 bg-slate-900 border-2 border-emerald-400 text-white px-3 py-1 rounded-full shadow-2xl font-bold text-xs">
        <span class="w-2.5 h-2.5 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}"></span>
        <span class="text-emerald-300 font-extrabold">${operatorName.split(' ')[0]}</span>
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
  // Center map around central India (20.5937, 78.9629)
  const center: [number, number] = [22.5937, 78.9629];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-700/60 bg-slate-950" style={{ height }}>
      <MapContainer
        center={center}
        zoom={5}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', background: '#0f172a' }}
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
              {/* Route line */}
              {trip.routePath.length > 0 && (
                <Polyline
                  positions={trip.routePath}
                  pathOptions={{
                    color: trip.status === 'live' ? '#10b981' : '#64748b',
                    weight: trip.status === 'live' ? 4 : 2,
                    opacity: 0.7,
                  }}
                />
              )}

              {/* Fleet Marker */}
              <Marker
                position={pos}
                icon={createFleetIcon(trip.operatorName, trip.status === 'live')}
              >
                <Popup>
                  <div className="text-xs p-2 min-w-[200px]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800">{trip.operatorName}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${trip.status === 'live' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                        {trip.status.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="font-semibold text-slate-900 leading-snug">{trip.name}</h4>
                    <p className="text-slate-600 font-medium mt-1">{trip.departureCity} &rarr; {trip.destinationCity}</p>

                    {telem && (
                      <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between text-slate-700">
                        <span>Speed: <strong>{telem.currentSpeed} km/h</strong></span>
                        <span>Progress: <strong>{telem.progressPercent}%</strong></span>
                      </div>
                    )}

                    {onSelectTrip && (
                      <button
                        onClick={() => onSelectTrip(trip)}
                        className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition"
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

      <div className="absolute bottom-4 left-4 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white px-3.5 py-2 rounded-xl text-xs flex items-center gap-4 shadow-xl">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold">Live GPS Active</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
          <span>Upcoming Departure</span>
        </div>
      </div>
    </div>
  );
}
