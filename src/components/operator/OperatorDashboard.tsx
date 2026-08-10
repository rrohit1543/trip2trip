'use client';

import React, { useState } from 'react';
import { User, Trip, LiveTelemetry, Booking, OperatorKYC } from '../../types';
import LiveTripMap from '../map/LiveTripMap';
import { Bus, Radio, Plus, Users, ShieldAlert, Play, Square, AlertCircle, FileText } from 'lucide-react';

interface OperatorDashboardProps {
  currentUser: User | null;
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
  const operatorTrips = trips.filter((t) => (currentUser ? t.operatorId === currentUser.id : true));
  const [activeTripId, setActiveTripId] = useState<string>(operatorTrips[0]?.id || 'trip_1');

  const selectedTrip = operatorTrips.find((t) => t.id === activeTripId) || operatorTrips[0];
  const selectedTelem = selectedTrip ? telemetry[selectedTrip.id] : undefined;
  const tripBookings = selectedTrip ? bookings.filter((b) => b.tripId === selectedTrip.id) : [];

  const myKYC = currentUser ? operatorKYC.find((k) => k.operatorId === currentUser.id) || operatorKYC[0] : operatorKYC[0];

  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const platformCommission = Math.round(totalRevenue * 0.1);
  const netEarnings = totalRevenue - platformCommission;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black border border-neutral-900 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-black text-white">{currentUser?.operatorCompany || 'Tour Operator Dashboard'}</h1>
            {myKYC?.status === 'approved' ? (
              <span className="bg-neutral-900 text-white border border-neutral-700 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-red-500" /> VERIFIED OPERATOR
              </span>
            ) : (
              <span className="bg-red-950 text-red-400 border border-red-800 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> KYC APPROVAL PENDING
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-400">Manage fleet trips, trigger live GPS broadcasts, view passenger manifest & earnings.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {myKYC?.status !== 'approved' && (
            <button
              onClick={onOpenKYC}
              className="bg-neutral-900 hover:bg-neutral-800 text-red-400 border border-red-900 font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 transition"
            >
              <FileText className="w-4 h-4 text-red-500" />
              <span>Submit KYC Docs</span>
            </button>
          )}

          <button
            onClick={onOpenCreateTrip}
            className="bg-red-600 hover:bg-red-700 text-white font-black px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 hover:scale-105 transition"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create New Trip</span>
          </button>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-black border border-neutral-900 p-5 rounded-3xl shadow-lg">
          <div className="text-xs text-neutral-400 uppercase font-bold tracking-wider">Total Gross Bookings</div>
          <div className="text-2xl font-black text-white mt-1">₹{totalRevenue.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-neutral-500 mt-1">{bookings.length} confirmed passenger seats</div>
        </div>

        <div className="bg-black border border-neutral-900 p-5 rounded-3xl shadow-lg">
          <div className="text-xs text-neutral-400 uppercase font-bold tracking-wider">Platform Commission (10%)</div>
          <div className="text-2xl font-black text-red-500 mt-1">₹{platformCommission.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-neutral-500 mt-1">Auto-deducted on payout</div>
        </div>

        <div className="bg-black border-2 border-red-600/40 p-5 rounded-3xl shadow-lg">
          <div className="text-xs text-red-500 uppercase font-bold tracking-wider">Net Settlement Payout</div>
          <div className="text-2xl font-black text-white mt-1">₹{netEarnings.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-neutral-400 mt-1">Direct Bank / UPI Settlement</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Bus className="w-4 h-4 text-red-500" /> My Fleet Trips ({operatorTrips.length})
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
                      ? 'bg-neutral-950 border-red-600 shadow-xl ring-1 ring-red-600/30'
                      : 'bg-black border-neutral-900 hover:border-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white line-clamp-1">{t.name}</span>
                    {isLive ? (
                      <span className="flex items-center gap-1 text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-black uppercase shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                        LIVE ON ROAD
                      </span>
                    ) : (
                      <span className="text-[10px] bg-neutral-900 text-neutral-400 px-2 py-0.5 rounded font-bold uppercase shrink-0">
                        UPCOMING
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-400">{t.departureCity} &rarr; {t.destinationCity}</p>
                  <div className="flex items-center justify-between text-xs text-neutral-300 mt-3 pt-3 border-t border-neutral-900">
                    <span>Seats: <strong className="text-red-500">{t.totalSeats - t.availableSeats} / {t.totalSeats} Booked</strong></span>
                    <span>Vehicle: <strong className="text-mono text-white">{t.vehicle.regNumber}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selectedTrip && (
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-black border border-neutral-900 p-6 rounded-3xl space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-900 pb-4">
                <div>
                  <h3 className="text-lg font-black text-white">{selectedTrip.name}</h3>
                  <p className="text-xs text-neutral-400">Bus Reg: <span className="font-mono text-white font-bold">{selectedTrip.vehicle.regNumber}</span></p>
                </div>

                <button
                  onClick={() => onToggleLiveTrip(selectedTrip.id)}
                  className={`px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 shadow-2xl transition-all ${
                    selectedTrip.status === 'live'
                      ? 'bg-neutral-900 text-neutral-300 border border-neutral-800 hover:bg-neutral-800'
                      : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/30 hover:scale-105'
                  }`}
                >
                  {selectedTrip.status === 'live' ? (
                    <>
                      <Square className="w-4 h-4 fill-red-500" />
                      <span>End Live Trip Broadcast</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>CLICK TO START LIVE TRIP</span>
                    </>
                  )}
                </button>
              </div>

              <LiveTripMap trip={selectedTrip} telemetry={selectedTelem} height="360px" />
            </div>

            <div className="bg-black border border-neutral-900 p-6 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-red-500" /> Passenger Manifest ({tripBookings.length})
                </h4>
                <span className="text-xs text-neutral-400 font-mono">Real-Time Boarding Tracker</span>
              </div>

              {tripBookings.length === 0 ? (
                <p className="text-xs text-neutral-500 py-4 text-center">No passenger bookings recorded for this trip yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-neutral-300">
                    <thead className="text-[10px] text-neutral-400 uppercase bg-neutral-950 border-b border-neutral-900">
                      <tr>
                        <th className="p-3">Passenger</th>
                        <th className="p-3">Seats</th>
                        <th className="p-3">Boarding Point</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-900">
                      {tripBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-neutral-950">
                          <td className="p-3 font-bold text-white">
                            {b.customerName}
                            <div className="text-[10px] text-neutral-500 font-normal">{b.customerPhone}</div>
                          </td>
                          <td className="p-3 font-mono font-bold text-red-500">S{b.selectedSeats.join(', S')}</td>
                          <td className="p-3">{b.pickupPoint}</td>
                          <td className="p-3 font-bold text-white">₹{b.totalAmount.toLocaleString('en-IN')} ({b.paymentMethod})</td>
                          <td className="p-3">
                            <span className="bg-red-600/20 text-red-400 border border-red-600/40 px-2 py-0.5 rounded text-[10px] font-bold">
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
