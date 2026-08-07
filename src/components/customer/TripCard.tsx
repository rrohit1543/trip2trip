'use client';

import React from 'react';
import { Trip, LiveTelemetry } from '../../types';
import { Star, Bus, MapPin, Users, ShieldCheck, ArrowRight, Radio, Gauge, Calendar, ChevronRight } from 'lucide-react';

interface TripCardProps {
  trip: Trip;
  telemetry?: LiveTelemetry;
  onTrackLive: (trip: Trip) => void;
  onViewDetails: (trip: Trip) => void;
  onBookSeats: (trip: Trip) => void;
}

export default function TripCard({ trip, telemetry, onTrackLive, onViewDetails, onBookSeats }: TripCardProps) {
  const isLive = trip.status === 'live';

  return (
    <div className="relative group bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
      {/* Top Image Banner */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-950">
        <img
          src={trip.images[0] || 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'}
          alt={trip.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent"></div>

        {/* Status Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          {isLive ? (
            <div className="flex items-center gap-1.5 bg-emerald-950/90 border border-emerald-500/50 text-emerald-400 font-extrabold text-xs px-3 py-1 rounded-full backdrop-blur shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>LIVE ON ROAD</span>
              {telemetry && <span className="ml-1 text-white font-mono">({telemetry.currentSpeed} km/h)</span>}
            </div>
          ) : (
            <div className="bg-slate-950/80 border border-slate-700 text-slate-300 font-bold text-xs px-3 py-1 rounded-full backdrop-blur">
              UPCOMING DEPARTURE
            </div>
          )}

          <div className="bg-slate-950/80 border border-slate-700 text-cyan-300 text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur">
            {trip.category}
          </div>
        </div>

        {/* Price & Rating Badge */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
          <div className="bg-slate-950/90 backdrop-blur border border-emerald-500/40 text-emerald-400 font-black text-lg px-3 py-1 rounded-xl shadow-lg">
            ₹{trip.pricePerPerson.toLocaleString('en-IN')} <span className="text-[10px] text-slate-400 font-medium">/ person</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur px-2.5 py-0.5 rounded-lg border border-slate-700 text-amber-400 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{trip.operatorRating}</span>
            <span className="text-slate-400 text-[10px]">({trip.operatorReviewsCount})</span>
          </div>
        </div>

        {/* Route Header */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2 text-sm font-black">
            <span className="bg-slate-950/70 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-700/60">{trip.departureCity}</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
            <span className="bg-slate-950/70 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-700/60">{trip.destinationCity}</span>
          </div>
          <div className="text-xs text-slate-300 font-medium bg-slate-950/70 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-700/60">
            {trip.durationDays}D / {trip.durationNights}N
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-lg font-extrabold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
            {trip.name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium">{trip.operatorName}</span>
            <span className="text-slate-600">•</span>
            <span>{trip.vehicle.type}</span>
          </div>
        </div>

        {/* Live GPS Telemetry Box (If Live) */}
        {isLive && telemetry && (
          <div className="bg-slate-950/90 border border-emerald-500/30 rounded-2xl p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1 font-semibold">
                <Gauge className="w-3.5 h-3.5 text-emerald-400" /> Current Speed: <strong className="text-emerald-400 font-mono">{telemetry.currentSpeed} km/h</strong>
              </span>
              <span className="text-slate-400">ETA: <strong className="text-amber-400">{telemetry.etaDestination}</strong></span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-1000"
                style={{ width: `${telemetry.progressPercent}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span className="truncate">Current: <strong className="text-white">{telemetry.currentStopName}</strong></span>
              <span className="truncate text-right">Next: <strong className="text-emerald-300">{telemetry.nextStopName}</strong></span>
            </div>
          </div>
        )}

        {/* Pickup & Seats Info */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800/60">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Vehicle Number</span>
            <span className="text-slate-200 font-mono font-bold">{trip.vehicle.regNumber}</span>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Seat Availability</span>
            <span className={`font-bold ${trip.availableSeats <= 5 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {trip.availableSeats} Left ({trip.totalSeats} Total)
            </span>
          </div>
        </div>
      </div>

      {/* Card Action Buttons Footer */}
      <div className="p-5 pt-0 grid grid-cols-1 sm:grid-cols-3 gap-2">
        {isLive && (
          <button
            onClick={() => onTrackLive(trip)}
            className="sm:col-span-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Track Live</span>
          </button>
        )}

        <button
          onClick={() => onViewDetails(trip)}
          className={`${isLive ? 'sm:col-span-1' : 'sm:col-span-1.5'} bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1 transition`}
        >
          <span>Itinerary</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onBookSeats(trip)}
          className={`${isLive ? 'sm:col-span-1' : 'sm:col-span-1.5'} bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1 shadow-lg shadow-emerald-500/20 transition`}
        >
          <span>Book Seats</span>
        </button>
      </div>
    </div>
  );
}
