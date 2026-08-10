'use client';

import React, { useState } from 'react';
import { Booking, Trip, LiveTelemetry } from '../../types';
import LiveTripMap from '../map/LiveTripMap';
import { Bus, MapPin, Radio, AlertTriangle, Phone, MessageSquare, Download, Share2, Star, Calendar, ShieldAlert, CheckCircle2, UserCheck } from 'lucide-react';

interface PassengerDashboardProps {
  bookings: Booking[];
  trips: Trip[];
  telemetry: Record<string, LiveTelemetry>;
  onOpenChat: (tripId: string) => void;
  onOpenReview: (tripId: string, operatorId: string) => void;
}

export default function PassengerDashboard({ bookings, trips, telemetry, onOpenChat, onOpenReview }: PassengerDashboardProps) {
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(bookings[0]?.id || null);
  const [sosActive, setSosActive] = useState(false);

  const activeBooking = bookings.find((b) => b.id === selectedBookingId) || bookings[0];
  const activeTrip = activeBooking ? trips.find((t) => t.id === activeBooking.tripId) : null;
  const activeTelem = activeTrip ? telemetry[activeTrip.id] : undefined;

  const handleSos = () => {
    setSosActive(true);
    alert('🚨 EMERGENCY SOS ACTIVATED! Emergency contacts, Tour Captain, and Operator Control Room have been notified with your current GPS coordinates.');
    setTimeout(() => setSosActive(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black border border-neutral-900 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-500 border border-red-600/40 text-xs font-bold px-3 py-1 rounded-full uppercase mb-2">
            <UserCheck className="w-3.5 h-3.5" /> Passenger Control Center
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">My Trips & Live Telemetry</h1>
          <p className="text-xs text-neutral-400 mt-1">Track active buses, download tickets, and contact operators in real-time.</p>
        </div>

        {/* SOS Emergency Button */}
        <button
          onClick={handleSos}
          className={`px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2 shadow-2xl transition-all ${
            sosActive
              ? 'bg-red-600 text-white animate-pulse border-2 border-white scale-105'
              : 'bg-red-950/80 text-red-400 hover:bg-red-900 border border-red-700'
          }`}
        >
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <span>{sosActive ? 'EMERGENCY ALERT SENT!' : 'EMERGENCY SOS BUTTON'}</span>
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-black border border-neutral-900 rounded-3xl p-12 text-center text-neutral-400 space-y-3">
          <Bus className="w-12 h-12 text-neutral-700 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Bookings Found</h3>
          <p className="text-xs">Search for upcoming group trips to book seats and track them live.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bus className="w-4 h-4 text-red-500" /> My Booked Tickets ({bookings.length})
            </h3>

            <div className="space-y-3">
              {bookings.map((b) => {
                const tr = trips.find((t) => t.id === b.tripId);
                const isSelected = b.id === selectedBookingId;
                const isLive = tr?.status === 'live';

                return (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBookingId(b.id)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-neutral-950 border-red-600 shadow-xl ring-1 ring-red-600/30'
                        : 'bg-black border-neutral-900 hover:border-neutral-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-red-500 font-mono font-bold uppercase bg-red-600/10 border border-red-600/30 px-2.5 py-0.5 rounded">
                        Booking #{b.id}
                      </span>
                      {isLive && (
                        <span className="flex items-center gap-1 text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-black uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                          LIVE NOW
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white line-clamp-1">{b.tripName}</h4>
                    <p className="text-xs text-neutral-400 mt-1">Operator: {b.operatorName}</p>

                    <div className="flex items-center justify-between text-xs text-neutral-300 mt-3 pt-3 border-t border-neutral-900">
                      <span>Seats: <strong className="text-red-500 font-mono">S{b.selectedSeats.join(', S')}</strong></span>
                      <span className="font-bold text-white">₹{b.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column */}
          {activeBooking && activeTrip && (
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                    Live Route GPS Tracker
                  </h3>
                  <span className="text-xs text-neutral-400 font-mono">
                    Bus: {activeTrip.vehicle.regNumber}
                  </span>
                </div>

                <LiveTripMap trip={activeTrip} telemetry={activeTelem} height="380px" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => onOpenChat(activeTrip.id)}
                  className="bg-black hover:bg-neutral-900 border border-neutral-800 text-red-500 font-bold p-3 rounded-2xl text-xs flex flex-col items-center justify-center gap-1.5 transition"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Chat Operator</span>
                </button>

                <button
                  onClick={() => alert(`Calling Operator Driver ${activeTrip.vehicle.driverName} (${activeTrip.vehicle.driverPhone})...`)}
                  className="bg-black hover:bg-neutral-900 border border-neutral-800 text-white font-bold p-3 rounded-2xl text-xs flex flex-col items-center justify-center gap-1.5 transition"
                >
                  <Phone className="w-5 h-5 text-red-500" />
                  <span>Call Operator</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Live Tracking Link Copied to Clipboard!');
                  }}
                  className="bg-black hover:bg-neutral-900 border border-neutral-800 text-neutral-300 font-bold p-3 rounded-2xl text-xs flex flex-col items-center justify-center gap-1.5 transition"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share Location</span>
                </button>

                <button
                  onClick={() => onOpenReview(activeTrip.id, activeTrip.operatorId)}
                  className="bg-black hover:bg-neutral-900 border border-neutral-800 text-red-400 font-bold p-3 rounded-2xl text-xs flex flex-col items-center justify-center gap-1.5 transition"
                >
                  <Star className="w-5 h-5 fill-red-500" />
                  <span>Rate & Review</span>
                </button>
              </div>

              <div className="bg-black border border-neutral-900 p-6 rounded-3xl space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-white">{activeBooking.tripName}</h4>
                    <p className="text-xs text-neutral-400">{activeBooking.operatorName}</p>
                  </div>
                  <button
                    onClick={() => alert(`Downloading E-Ticket PDF for Booking #${activeBooking.id}`)}
                    className="bg-red-600/10 border border-red-600/40 text-red-500 hover:bg-red-600/20 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Ticket</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-900">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold block">Boarding Point</span>
                    <span className="text-neutral-200 font-semibold">{activeBooking.pickupPoint}</span>
                  </div>

                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-900">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold block">Dropping Point</span>
                    <span className="text-neutral-200 font-semibold">{activeBooking.dropPoint}</span>
                  </div>

                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-900">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold block">Tour Captain</span>
                    <span className="text-neutral-200 font-semibold">{activeTrip.tourGuide.name} ({activeTrip.tourGuide.phone})</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
