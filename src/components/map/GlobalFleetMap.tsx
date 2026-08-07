'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { Trip, LiveTelemetry } from '../../types';

const GlobalFleetMapInner = dynamic(() => import('./GlobalFleetMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-slate-400 gap-3">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-medium">Scanning National Live Fleet Radar...</p>
    </div>
  ),
});

interface Props {
  trips: Trip[];
  telemetry: Record<string, LiveTelemetry>;
  height?: string;
  onSelectTrip?: (trip: Trip) => void;
}

export default function GlobalFleetMap({ trips, telemetry, height, onSelectTrip }: Props) {
  return <GlobalFleetMapInner trips={trips} telemetry={telemetry} height={height} onSelectTrip={onSelectTrip} />;
}
