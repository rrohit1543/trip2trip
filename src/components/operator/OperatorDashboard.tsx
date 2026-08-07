'use client';

import React, { useState } from 'react';
import { User, Trip, LiveTelemetry, Booking, OperatorKYC } from '../../types';
import LiveTripMap from '../map/LiveTripMap';
import { Bus, Radio, Plus, Users, DollarSign, ShieldCheck, Play, Square, Gauge, ChevronRight, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

interface OperatorDashboardProps {
  currentUser: User;
  trips: Trip[];
  telemetry: Record<string, LiveTelemetry>;
  bookings: Booking[];
  operatorKYC: OperatorKYC[];
  onOpenCreateTrip: () => void;
  onOpenKYC: () => void;
  onToggleLiveTrip: (tripId: string) => void;
}

export default function OperatorDashboard({
  currentUser,
  trips,
  telemetry,
  bookings,
  operatorKYC,
  onOpenCreateTrip,
  onOpenKYC,
  onToggleLiveTrip,
}: OperatorDashboardProps) {
  const operatorTrips = trips.filter((t) => t.operatorId === currentUser.id || true); // fallback for demo view
  const [activeTripId, setActiveTripId] = useState<string>(operatorTrips[0]?.id || 'trip_1');

  const selectedTrip = operatorTrips.find((t) => t.id === activeTripId) || operatorTrips[0];
  const selectedTelem = selectedTrip ? telemetry[selectedTrip.id] : undefined;
  const tripBookings = selectedTrip ? bookings.filter((b) => b.tripId === selectedTrip.id) : [];

  const myKYC = operatorKYC.find((k) => k.operatorId === currentUser.id) || operatorKYC[0];

  // Earnings calculations
  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const platformCommission = Math.round(totalRevenue * 0.1);
  const netEarnings = totalRevenue - platformCommission;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* Operator Welcome Banner & KYC Alert */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-black text-white">{currentUser.operatorCompany || 'Tour Operator Dashboard'}</h1>
            {myKYC?.status === 'approved' ? (
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> VERIFIED OPERATOR
              </span>
            ) : (
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> KYC APPROVAL PENDING
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">Manage fleet trips, trigger live GPS broadcasts, view passenger manifest & earnings.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {myKYC?.status !== 'approved' && (
            <button
              onClick={onOpenKYC}
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 transition"
            >
              <FileText className="w-4 h-4" />
              <span>Submit KYC Docs</span>
            </button>
          )}

          <button
            onClick={onOpenCreateTrip}
            className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-105 transition"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create New Trip</span>
          </button>
        </div>
      </div>

      {/* Financial Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-lg">
          <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Gross Bookings</div>
          <div className="text-2xl font-black text-white mt-1">₹{totalRevenue.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-500 mt-1">{bookings.length} confirmed passenger seats</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-lg">
          <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Platform Commission (10%)</div>
          <div className="text-2xl font-black text-amber-400 mt-1">₹{platformCommission.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-500 mt-1">Auto-deducted on payout</div>
        </div>

        <div className="bg-slate-900 border border-emerald-500/30 p-5 rounded-3xl shadow-lg bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="text-xs text-emerald-400 uppercase font-bold tracking-wider">Net Settlement Payout</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">₹{netEarnings.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-emerald-300/80 mt-1">Direct Bank / UPI Settlement</div>
        </div>
      </div>

      {/* Main Fleet & Live Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Published Trips List */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Bus className="w-4 h-4 text-emerald-400" /> My Fleet Trips ({operatorTrips.length})
          </h3>

          <div className="space-y-3">
            {operatorTrips.map((t) => {
              const isSelected = t.id === selectedTrip?.id;
              const isLive = t.status === 'live';

              return (
                <div
                  key={t.id}
                  onClick={() => setActiveTripId(t.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500/80 shadow-xl ring-1 ring-emerald-500/30'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white line-clamp-1">{t.name}</span>
                    {isLive ? (
                      <span className="flex items-center gap-1 text-[10px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded font-black uppercase shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping"></span>
                        LIVE ON ROAD
                      </span>
                    ) : (
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-bold uppercase shrink-0">
                        UPCOMING
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400">{t.departureCity} &rarr; {t.destinationCity}</p>
                  <div className="flex items-center justify-between text-xs text-slate-300 mt-3 pt-3 border-t border-slate-800">
                    <span>Seats: <strong className="text-emerald-400">{t.totalSeats - t.availableSeats} / {t.totalSeats} Booked</strong></span>
                    <span>Vehicle: <strong className="text-mono text-white">{t.vehicle.regNumber}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Trip Control Center & Live Map */}
        {selectedTrip && (
          <div className="lg:col-span-7 space-y-6">
            {/* Live Trip Launcher & Telemetry Hub */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-black text-white">{selectedTrip.name}</h3>
                  <p className="text-xs text-slate-400">Bus Reg: <span className="font-mono text-white font-bold">{selectedTrip.vehicle.regNumber}</span></p>
                </div>

                {/* Main "Start Live Trip" Toggle Button */}
                <button
                  onClick={() => onToggleLiveTrip(selectedTrip.id)}
                  className={`px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 shadow-2xl transition-all ${
                    selectedTrip.status === 'live'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-emerald-500/25 hover:scale-105'
                  }`}
                >
                  {selectedTrip.status === 'live' ? (
                    <>
                      <Square className="w-4 h-4 fill-rose-400" />
                      <span>End Live Trip Broadcast</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-slate-950" />
                      <span>CLICK TO START LIVE TRIP</span>
                    </>
                  )}
                </button>
              </div>

              {/* Map Telemetry View */}
              <LiveTripMap trip={selectedTrip} telemetry={selectedTelem} height="360px" />
            </div>

            {/* Passenger Manifest Table */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" /> Passenger Manifest ({tripBookings.length})
                </h4>
                <span className="text-xs text-slate-400 font-mono">Real-Time Boarding Tracker</span>
              </div>

              {tripBookings.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No passenger bookings recorded for this trip yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-300">
                    <thead className="text-[10px] text-slate-400 uppercase bg-slate-950 border-b border-slate-800">
                      <tr>
                        <th className="p-3">Passenger</th>
                        <th className="p-3">Seats</th>
                        <th className="p-3">Boarding Point</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {tripBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-950/50">
                          <td className="p-3 font-bold text-white">
                            {b.customerName}
                            <div className="text-[10px] text-slate-400 font-normal">{b.customerPhone}</div>
                          </td>
                          <td className="p-3 font-mono font-bold text-emerald-400">S{b.selectedSeats.join(', S')}</td>
                          <td className="p-3">{b.pickupPoint}</td>
                          <td className="p-3 font-bold text-white">₹{b.totalAmount.toLocaleString('en-IN')} ({b.paymentMethod})</td>
                          <td className="p-3">
                            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">
                              BOARDED
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
