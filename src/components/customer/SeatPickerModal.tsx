'use client';

import React, { useState } from 'react';
import { Trip } from '../../types';
import { X, Check, Bus, MapPin, Info, ArrowRight } from 'lucide-react';

interface SeatPickerModalProps {
  trip: Trip | null;
  onClose: () => void;
  onProceedToCheckout: (trip: Trip, selectedSeats: number[], pickupPoint: string, dropPoint: string) => void;
}

export default function SeatPickerModal({ trip, onClose, onProceedToCheckout }: SeatPickerModalProps) {
  if (!trip) return null;

  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [pickupPoint, setPickupPoint] = useState(trip.pickupLocation.name);
  const [dropPoint, setDropPoint] = useState(trip.dropPoints[0]?.name || trip.destinationCity);
  const [deckTab, setDeckTab] = useState<'lower' | 'upper'>('lower');

  const toggleSeat = (seatNum: number) => {
    if (trip.bookedSeatNumbers.includes(seatNum)) return;
    if (selectedSeats.includes(seatNum)) {
      setSelectedSeats((prev) => prev.filter((s) => s !== seatNum));
    } else {
      if (selectedSeats.length >= 6) {
        alert('Maximum 6 seats can be selected per booking');
        return;
      }
      setSelectedSeats((prev) => [...prev, seatNum]);
    }
  };

  const totalPrice = selectedSeats.length * trip.pricePerPerson;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">{trip.name}</h3>
              <p className="text-xs text-slate-400">Select Seats on {trip.vehicle.type}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-900 border border-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Pickup & Drop Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 border border-slate-800 p-4 rounded-2xl">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Boarding Point</label>
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <input
                  type="text"
                  value={pickupPoint}
                  onChange={(e) => setPickupPoint(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Dropping Point</label>
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-xl">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <select
                  value={dropPoint}
                  onChange={(e) => setDropPoint(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                >
                  {trip.dropPoints.map((dp, i) => (
                    <option key={i} value={dp.name} className="bg-slate-900 text-white">
                      {dp.name}
                    </option>
                  ))}
                  <option value={trip.destinationCity} className="bg-slate-900 text-white">
                    {trip.destinationCity} Final Terminus
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Seat Legend & Deck Selector */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setDeckTab('lower')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  deckTab === 'lower' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                Lower Deck
              </button>
              <button
                onClick={() => setDeckTab('upper')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  deckTab === 'upper' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                Upper Deck
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-slate-800 border border-slate-700"></span>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-cyan-500 border border-cyan-400 shadow-sm shadow-cyan-500/50"></span>
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-slate-950 border border-slate-800 text-slate-600 flex items-center justify-center text-[10px]">✕</span>
                <span>Booked</span>
              </div>
            </div>
          </div>

          {/* Interactive Bus Seat Grid Layout */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 relative max-w-md mx-auto shadow-inner">
            {/* Steering Wheel / Driver Position Icon */}
            <div className="flex justify-end border-b border-slate-800 pb-3 mb-6">
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-xl text-slate-400 text-xs font-bold">
                <span>Driver</span>
                <div className="w-4 h-4 rounded-full border-2 border-slate-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Seat Rows (30 Seats Layout: 15 Lower Deck, 15 Upper Deck) */}
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, rowIdx) => {
                const baseSeatNum = (deckTab === 'lower' ? 0 : 15) + rowIdx * 3;
                const seat1 = baseSeatNum + 1;
                const seat2 = baseSeatNum + 2;
                const seat3 = baseSeatNum + 3;

                const isBooked1 = trip.bookedSeatNumbers.includes(seat1);
                const isBooked2 = trip.bookedSeatNumbers.includes(seat2);
                const isBooked3 = trip.bookedSeatNumbers.includes(seat3);

                const isSel1 = selectedSeats.includes(seat1);
                const isSel2 = selectedSeats.includes(seat2);
                const isSel3 = selectedSeats.includes(seat3);

                return (
                  <div key={rowIdx} className="flex items-center justify-between gap-4">
                    {/* Left Single Sleeper / Seat */}
                    <button
                      disabled={isBooked1}
                      onClick={() => toggleSeat(seat1)}
                      className={`w-16 h-12 rounded-xl border flex flex-col items-center justify-center font-bold text-xs transition-all ${
                        isBooked1
                          ? 'bg-slate-950 border-slate-800/60 text-slate-600 cursor-not-allowed'
                          : isSel1
                          ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/40 font-black scale-105'
                          : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-emerald-500 hover:text-emerald-400'
                      }`}
                    >
                      <span>S{seat1}</span>
                      <span className="text-[9px] font-normal">{isBooked1 ? 'Booked' : 'Window'}</span>
                    </button>

                    {/* Aisle Space */}
                    <div className="text-[10px] text-slate-700 uppercase font-mono tracking-widest">Aisle</div>

                    {/* Right Double Sleeper / Seats */}
                    <div className="flex items-center gap-2">
                      <button
                        disabled={isBooked2}
                        onClick={() => toggleSeat(seat2)}
                        className={`w-16 h-12 rounded-xl border flex flex-col items-center justify-center font-bold text-xs transition-all ${
                          isBooked2
                            ? 'bg-slate-950 border-slate-800/60 text-slate-600 cursor-not-allowed'
                            : isSel2
                            ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/40 font-black scale-105'
                            : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-emerald-500 hover:text-emerald-400'
                        }`}
                      >
                        <span>S{seat2}</span>
                        <span className="text-[9px] font-normal">{isBooked2 ? 'Booked' : 'Aisle'}</span>
                      </button>

                      <button
                        disabled={isBooked3}
                        onClick={() => toggleSeat(seat3)}
                        className={`w-16 h-12 rounded-xl border flex flex-col items-center justify-center font-bold text-xs transition-all ${
                          isBooked3
                            ? 'bg-slate-950 border-slate-800/60 text-slate-600 cursor-not-allowed'
                            : isSel3
                            ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/40 font-black scale-105'
                            : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-emerald-500 hover:text-emerald-400'
                        }`}
                      >
                        <span>S{seat3}</span>
                        <span className="text-[9px] font-normal">{isBooked3 ? 'Booked' : 'Window'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer with Calculation & Proceed Button */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-400">
              Selected Seats ({selectedSeats.length}):{' '}
              <strong className="text-white font-mono">{selectedSeats.length > 0 ? selectedSeats.sort((a, b) => a - b).join(', ') : 'None'}</strong>
            </div>
            <div className="text-2xl font-black text-emerald-400">₹{totalPrice.toLocaleString('en-IN')}</div>
          </div>

          <button
            disabled={selectedSeats.length === 0}
            onClick={() => onProceedToCheckout(trip, selectedSeats, pickupPoint, dropPoint)}
            className={`px-8 py-3 rounded-2xl font-black text-xs flex items-center gap-2 shadow-xl transition-all ${
              selectedSeats.length > 0
                ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 shadow-emerald-500/25 hover:scale-105'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>Proceed to Payment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
