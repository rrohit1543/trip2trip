'use client';

import React, { useState } from 'react';
import { Trip } from '../../types';
import { X, Calendar, CheckCircle2, XCircle, MapPin, Bus, Hotel, UserCheck, ShieldAlert, FileText, Star, Award, Phone } from 'lucide-react';

interface TripDetailModalProps {
  trip: Trip | null;
  onClose: () => void;
  onBookSeats: (trip: Trip) => void;
}

export default function TripDetailModal({ trip, onClose, onBookSeats }: TripDetailModalProps) {
  if (!trip) return null;

  const [activeTab, setActiveTab] = useState<'itinerary' | 'inclusions' | 'stay_vehicle' | 'policy'>('itinerary');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header Image Banner */}
        <div className="relative h-64 w-full bg-slate-950 shrink-0">
          <img
            src={trip.images[0] || 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'}
            alt={trip.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-slate-950/80 hover:bg-slate-950 text-slate-300 hover:text-white p-2.5 rounded-full border border-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                  {trip.category}
                </span>
                <span className="bg-slate-950/80 text-cyan-300 border border-slate-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {trip.difficultyLevel} Trek/Tour
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white">{trip.name}</h2>
              <p className="text-xs text-slate-300 flex items-center gap-2 mt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{trip.departureCity} &rarr; {trip.destinationCity}</span>
                <span>•</span>
                <span>{trip.durationDays} Days / {trip.durationNights} Nights</span>
              </p>
            </div>

            <div className="bg-slate-950/90 border border-emerald-500/50 p-3 rounded-2xl text-right">
              <div className="text-2xl font-black text-emerald-400">
                ₹{trip.pricePerPerson.toLocaleString('en-IN')}
                <span className="text-xs text-slate-400 font-normal"> / person</span>
              </div>
              <div className="text-[11px] text-slate-400">{trip.availableSeats} seats remaining</div>
            </div>
          </div>
        </div>

        {/* Modal Navigation Bar */}
        <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-950/90 px-6 py-3 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'itinerary' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Day-wise Itinerary
          </button>
          <button
            onClick={() => setActiveTab('inclusions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'inclusions' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Inclusions & Exclusions
          </button>
          <button
            onClick={() => setActiveTab('stay_vehicle')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'stay_vehicle' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Vehicle, Hotel & Guide
          </button>
          <button
            onClick={() => setActiveTab('policy')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'policy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Policies & Documents
          </button>
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'itinerary' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                Day-by-Day Tour Itinerary
              </h3>
              <div className="space-y-3">
                {trip.itinerary.map((day) => (
                  <div key={day.dayNumber} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-lg">
                        Day {day.dayNumber}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">Meals: {day.meals}</span>
                    </div>
                    <h4 className="text-base font-bold text-white">{day.title}</h4>
                    <ul className="space-y-1.5 pl-4 list-disc text-xs text-slate-300">
                      {day.activities.map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                    <div className="text-xs text-slate-400 border-t border-slate-800/80 pt-2 mt-2">
                      Stay: <strong className="text-slate-200">{day.stayDetails}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'inclusions' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-950 border border-emerald-500/20 p-5 rounded-2xl space-y-3">
                <h4 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> What's Included
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {trip.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950 border border-rose-500/20 p-5 rounded-2xl space-y-3">
                <h4 className="text-base font-bold text-rose-400 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-400" /> What's Excluded
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {trip.exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'stay_vehicle' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Vehicle Card */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Bus className="w-5 h-5" /> Vehicle Specs
                </div>
                <h5 className="text-sm font-bold text-white">{trip.vehicle.type}</h5>
                <p className="text-xs text-slate-400 font-mono">Reg: {trip.vehicle.regNumber}</p>
                <div className="text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <strong className="text-slate-400 block text-[10px] uppercase">Amenities:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {trip.vehicle.amenities.map((am, i) => (
                      <span key={i} className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[10px] text-slate-300">
                        {am}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-slate-400 pt-2">
                  Driver: <strong className="text-white">{trip.vehicle.driverName}</strong> ({trip.vehicle.driverPhone})
                </div>
              </div>

              {/* Hotel Card */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <Hotel className="w-5 h-5" /> Accommodations
                </div>
                <h5 className="text-sm font-bold text-white">{trip.hotel.name}</h5>
                <div className="flex items-center gap-1 text-xs text-amber-400">
                  {Array.from({ length: trip.hotel.stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                  <span className="text-slate-400 text-[11px] ml-1">{trip.hotel.stars}-Star Hotel</span>
                </div>
                <p className="text-xs text-slate-400">{trip.hotel.location}</p>
              </div>

              {/* Guide Profile */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <UserCheck className="w-5 h-5" /> Certified Tour Guide
                </div>
                <div className="flex items-center gap-3">
                  <img src={trip.tourGuide.photo} alt={trip.tourGuide.name} className="w-10 h-10 rounded-full object-cover border border-amber-500/40" />
                  <div>
                    <h5 className="text-sm font-bold text-white">{trip.tourGuide.name}</h5>
                    <p className="text-xs text-slate-400">{trip.tourGuide.languages.join(', ')}</p>
                  </div>
                </div>
                <div className="text-xs text-slate-300 pt-2 flex items-center justify-between border-t border-slate-800">
                  <span>Rating: <strong className="text-amber-400">{trip.tourGuide.rating} ★</strong></span>
                  <span className="flex items-center gap-1 text-slate-400"><Phone className="w-3 h-3" /> {trip.tourGuide.phone}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'policy' && (
            <div className="space-y-4">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" /> Cancellation Policy
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">{trip.cancellationPolicy}</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" /> Mandatory Documents Required
                </h4>
                <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1">
                  {trip.requiredDocuments.map((doc, i) => (
                    <li key={i}>{doc}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div>
            <div className="text-xs text-slate-400">Total Price</div>
            <div className="text-xl font-black text-emerald-400">₹{trip.pricePerPerson.toLocaleString('en-IN')} <span className="text-xs text-slate-400 font-normal">/ person</span></div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-bold text-xs hover:bg-slate-800 transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBookSeats(trip);
              }}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-500/25 transition"
            >
              Select Seats & Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
