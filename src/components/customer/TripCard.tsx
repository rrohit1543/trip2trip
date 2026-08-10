'use client';

import React from 'react';
import { Trip, LiveTelemetry } from '../../types';
import { Star, Bus, MapPin, Users, ShieldAlert, ArrowRight, Radio, Gauge, Calendar, ChevronRight } from 'lucide-react';

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
    <div className="relative group bg-neutral-950 border border-neutral-800 hover:border-red-600 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
      {/* Top Image Banner */}
      <div className="relative h-52 w-full overflow-hidden bg-black">
        <img
          src={trip.images[0] || 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'}
          alt={trip.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

        {/* Status Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          {isLive ? (
            <div className="flex items-center gap-1.5 bg-red-950/90 border border-red-600 text-red-500 font-extrabold text-xs px-3 py-1 rounded-full backdrop-blur shadow-lg">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>LIVE ON ROAD</span>
              {telemetry && <span className="ml-1 text-white font-mono">({telemetry.currentSpeed} km/h)</span>}
            </div>
          ) : (
            <div className="bg-black/80 border border-neutral-800 text-neutral-300 font-bold text-xs px-3 py-1 rounded-full backdrop-blur">
              UPCOMING DEPARTURE
            </div>
          )}

          <div className="bg-black/80 border border-neutral-800 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur">
            {trip.category}
          </div>
        </div>

        {/* Price & Rating Badge */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
          <div className="bg-black/90 backdrop-blur border border-red-600 text-white font-black text-lg px-3 py-1 rounded-xl shadow-lg">
            ₹{trip.pricePerPerson.toLocaleString('en-IN')} <span className="text-[10px] text-neutral-400 font-medium">/ person</span>
          </div>
          <div className="flex items-center gap-1 bg-black/80 backdrop-blur px-2.5 py-0.5 rounded-lg border border-neutral-800 text-white text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-white text-white" />
            <span>{trip.operatorRating}</span>
            <span className="text-neutral-400 text-[10px]">({trip.operatorReviewsCount})</span>
          </div>
        </div>

        {/* Route Header */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2 text-sm font-black">
            <span className="bg-black/80 backdrop-blur px-2.5 py-1 rounded-lg border border-neutral-800">{trip.departureCity}</span>
            <ArrowRight className="w-4 h-4 text-red-500" />
            <span className="bg-black/80 backdrop-blur px-2.5 py-1 rounded-lg border border-neutral-800">{trip.destinationCity}</span>
          </div>
          <div className="text-xs text-neutral-300 font-medium bg-black/80 backdrop-blur px-2.5 py-1 rounded-lg border border-neutral-800">
            {trip.durationDays}D / {trip.durationNights}N
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-lg font-extrabold text-white group-hover:text-red-500 transition-colors line-clamp-1">
            {trip.name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
            <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
            <span className="font-medium">{trip.operatorName}</span>
            <span className="text-neutral-600">•</span>
            <span>{trip.vehicle.type}</span>
          </div>
        </div>

        {/* Live GPS Telemetry Box */}
        {isLive && telemetry && (
          <div className="bg-black border border-red-600/40 rounded-2xl p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400 flex items-center gap-1 font-semibold">
                <Gauge className="w-3.5 h-3.5 text-red-500" /> Speed: <strong className="text-red-500 font-mono">{telemetry.currentSpeed} km/h</strong>
              </span>
              <span className="text-neutral-400">ETA: <strong className="text-white">{telemetry.etaDestination}</strong></span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden border border-neutral-800">
              <div
                className="bg-red-600 h-full rounded-full transition-all duration-1000"
                style={{ width: `${telemetry.progressPercent}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-300">
              <span className="truncate">Current: <strong className="text-white">{telemetry.currentStopName}</strong></span>
              <span className="truncate text-right">Next: <strong className="text-red-400">{telemetry.nextStopName}</strong></span>
            </div>
          </div>
        )}

        {/* Pickup & Seats Info */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-neutral-900">
          <div className="bg-black p-2.5 rounded-xl border border-neutral-900">
            <span className="text-[10px] text-neutral-500 uppercase font-bold block">Vehicle Number</span>
            <span className="text-neutral-200 font-mono font-bold">{trip.vehicle.regNumber}</span>
          </div>

          <div className="bg-black p-2.5 rounded-xl border border-neutral-900">
            <span className="text-[10px] text-neutral-500 uppercase font-bold block">Seat Availability</span>
            <span className={`font-bold ${trip.availableSeats <= 5 ? 'text-red-500' : 'text-white'}`}>
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
            className="sm:col-span-1 bg-red-600/10 hover:bg-red-600/20 border border-red-600/40 text-red-500 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Track Live</span>
          </button>
        )}

        <button
          onClick={() => onViewDetails(trip)}
          className={`${isLive ? 'sm:col-span-1' : 'sm:col-span-1.5'} bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 font-semibold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1 transition`}
        >
          <span>Itinerary</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onBookSeats(trip)}
          className={`${isLive ? 'sm:col-span-1' : 'sm:col-span-1.5'} bg-red-600 hover:bg-red-700 text-white font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1 shadow-lg shadow-red-600/30 transition`}
        >
          <span>Book Seats</span>
        </button>
      </div>
    </div>
  );
}
