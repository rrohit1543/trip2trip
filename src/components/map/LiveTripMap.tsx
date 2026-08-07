'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { Trip, LiveTelemetry } from '../../types';

const LiveTripMapInner = dynamic(() => import('./LiveTripMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-slate-400 gap-3">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-medium">Initializing Real-time Route GPS Tracker...</p>
    </div>
  ),
});

interface Props {
  trip: Trip;
  telemetry?: LiveTelemetry;
  height?: string;
}

export default function LiveTripMap({ trip, telemetry, height }: Props) {
  return <LiveTripMapInner trip={trip} telemetry={telemetry} height={height} />;
}
