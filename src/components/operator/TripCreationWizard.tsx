'use client';

import React, { useState } from 'react';
import { Trip, ItineraryDay } from '../../types';
import { X, Plus, Trash2, Bus, MapPin, Calendar, DollarSign, ShieldAlert, FileText, CheckCircle2, Star } from 'lucide-react';

interface TripCreationWizardProps {
  onClose: () => void;
  onCreateTrip: (tripData: any) => void;
}

export default function TripCreationWizard({ onClose, onCreateTrip }: TripCreationWizardProps) {
  const [step, setStep] = useState(1);

  // Form Fields
  const [name, setName] = useState('Spiti Valley Camping & Star-Gazing Expedition');
  const [category, setCategory] = useState<'Trekking' | 'Heritage' | 'Beach Caravan' | 'Leisure & Luxury' | 'Spiritual' | 'Adventure'>('Trekking');
  const [departureCity, setDepartureCity] = useState('Delhi');
  const [destinationCity, setDestinationCity] = useState('Spiti');
  const [pickupName, setPickupName] = useState('Kashmiri Gate ISBT, Delhi');
  const [pickupLat, setPickupLat] = useState(28.6667);
  const [pickupLng, setPickupLng] = useState(77.2333);

  const [dropPoints, setDropPoints] = useState([
    { name: 'Chandigarh Tribune Chowk', lat: 30.7077, lng: 76.7972 },
    { name: 'Shimla Victory Tunnel', lat: 31.1048, lng: 77.1734 },
    { name: 'Kaza Bus Stand', lat: 32.2276, lng: 78.0710 },
  ]);

  const [durationDays, setDurationDays] = useState(5);
  const [durationNights, setDurationNights] = useState(4);
  const [departureDateTime, setDepartureDateTime] = useState('2026-08-15T18:00');
  const [returnDateTime, setReturnDateTime] = useState('2026-08-20T10:00');
  const [pricePerPerson, setPricePerPerson] = useState(11999);
  const [totalSeats, setTotalSeats] = useState(24);
  const [difficultyLevel, setDifficultyLevel] = useState<'Easy' | 'Moderate' | 'Hard'>('Moderate');

  // Itinerary
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([
    {
      dayNumber: 1,
      title: 'Delhi to Shimla & Narkanda Scenic Drive',
      activities: ['Overnight Volvo journey', 'Breakfast at Solan'],
      meals: 'Dinner Included',
      stayDetails: 'Luxury Volvo AC Bus',
    },
    {
      dayNumber: 2,
      title: 'Narkanda to Kalpa Village & Kinnaur Valley',
      activities: ['Visit Suicide Point Kalpa', 'Sunset view of Kinner Kailash'],
      meals: 'Breakfast & Dinner',
      stayDetails: 'Hotel Grand Kalpa 3★',
    },
  ]);

  // Inclusions & Exclusions
  const [inclusions, setInclusions] = useState([
    'Luxury Volvo / Tempo Traveler Transport',
    'Stays in Deluxe Hotels & Alpine Tents',
    'Daily Breakfast & Dinner',
    'Inner Line Permits for Spiti Valley',
  ]);
  const [exclusions, setExclusions] = useState(['Personal Monastery entry fees', 'Lunch meals']);
  const [cancellationPolicy, setCancellationPolicy] = useState('100% refund 7 days before departure. Non-refundable within 48 hrs.');
  const [requiredDocs, setRequiredDocs] = useState(['Aadhaar Card Copy', 'Medical Fitness Certificate']);

  // Vehicle & Guide Details
  const [vehicleType, setVehicleType] = useState('Force Urbania 17-Seater Luxury AC');
  const [vehicleReg, setVehicleReg] = useState('DL 01 EXP 9988');
  const [driverName, setDriverName] = useState('Sarabjit Singh');
  const [driverPhone, setDriverPhone] = useState('+91 98111 44556');
  const [guideName, setGuideName] = useState('Tenzin Norbu');
  const [guidePhone, setGuidePhone] = useState('+91 94180 77665');

  const addDropPoint = () => {
    setDropPoints([...dropPoints, { name: 'New Drop Stop', lat: 31.0, lng: 77.0 }]);
  };

  const removeDropPoint = (index: number) => {
    setDropPoints(dropPoints.filter((_, i) => i !== index));
  };

  const addItineraryDay = () => {
    const nextDay = itinerary.length + 1;
    setItinerary([
      ...itinerary,
      {
        dayNumber: nextDay,
        title: `Day ${nextDay} Exploration`,
        activities: ['Local sightseeing & group photography'],
        meals: 'Breakfast & Dinner',
        stayDetails: 'Mountain Resort',
      },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateTrip({
      name,
      category,
      departureCity,
      destinationCity,
      pickupLocation: { name: pickupName, lat: pickupLat, lng: pickupLng },
      dropPoints,
      durationDays,
      durationNights,
      departureDateTime,
      returnDateTime,
      pricePerPerson,
      totalSeats,
      availableSeats: totalSeats,
      bookingDeadline: departureDateTime,
      itinerary,
      inclusions,
      exclusions,
      cancellationPolicy,
      requiredDocuments: requiredDocs,
      images: [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
      ],
      tourGuide: {
        name: guideName,
        phone: guidePhone,
        rating: 4.9,
        languages: ['English', 'Hindi', 'Tibetan'],
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      },
      vehicle: {
        type: vehicleType,
        regNumber: vehicleReg,
        amenities: ['Reclining Pushback Seats', 'Individual USB Ports', 'Live GPS Tracking', 'First Aid'],
        driverName,
        driverPhone,
      },
      hotel: {
        name: 'Hotel Grand Kalpa & Kaza Camps',
        stars: 4,
        location: 'Spiti Valley',
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'],
      },
      difficultyLevel,
      tags: ['Spiti Valley', 'High Altitude', 'Live GPS'],
      routePath: [
        [28.6139, 77.2090], // Delhi
        [30.7333, 76.7794], // Chandigarh
        [31.1048, 77.1734], // Shimla
        [31.5000, 78.2000], // Kalpa
        [32.2276, 78.0710], // Kaza Spiti
      ],
      intermediateCities: ['Delhi', 'Chandigarh', 'Shimla', 'Narkanda', 'Kalpa', 'Kaza', 'Spiti'],
    });

    onClose();
    alert('New Group Trip Published Successfully! Available live for booking & route discovery.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bus className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="text-lg font-black text-white">Create New Group Tour Package</h3>
              <p className="text-xs text-slate-400">Configure route, day-wise itinerary, seats, and pricing</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-900 border border-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps */}
        <div className="flex items-center justify-between bg-slate-950/60 px-6 py-3 border-b border-slate-800 text-xs font-bold">
          <span className={step >= 1 ? 'text-emerald-400' : 'text-slate-500'}>1. Basic Details & Route</span>
          <span className={step >= 2 ? 'text-emerald-400' : 'text-slate-500'}>2. Itinerary Builder</span>
          <span className={step >= 3 ? 'text-emerald-400' : 'text-slate-500'}>3. Vehicle, Guide & Inclusions</span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Trip Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
                  >
                    <option value="Trekking">Trekking</option>
                    <option value="Beach Caravan">Beach Caravan</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Heritage">Heritage</option>
                    <option value="Leisure & Luxury">Leisure & Luxury</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Departure City</label>
                  <input
                    type="text"
                    required
                    value={departureCity}
                    onChange={(e) => setDepartureCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Destination City</label>
                  <input
                    type="text"
                    required
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Exact Pickup Location */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Exact Boarding Pickup Location (Google Maps Pin)</label>
                <input
                  type="text"
                  required
                  value={pickupName}
                  onChange={(e) => setPickupName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-bold text-white focus:outline-none"
                />
              </div>

              {/* Drop Points */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Multiple Drop Points along Route</label>
                  <button
                    type="button"
                    onClick={addDropPoint}
                    className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-3 h-3" /> Add Drop Stop
                  </button>
                </div>

                {dropPoints.map((dp, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={dp.name}
                      onChange={(e) => {
                        const updated = [...dropPoints];
                        updated[i].name = e.target.value;
                        setDropPoints(updated);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeDropPoint(i)}
                      className="p-2 text-rose-400 hover:text-rose-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Price / Person (₹)</label>
                  <input
                    type="number"
                    required
                    value={pricePerPerson}
                    onChange={(e) => setPricePerPerson(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-emerald-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Total Bus Seats</label>
                  <input
                    type="number"
                    required
                    value={totalSeats}
                    onChange={(e) => setTotalSeats(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Difficulty</label>
                  <select
                    value={difficultyLevel}
                    onChange={(e) => setDifficultyLevel(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs hover:bg-emerald-400 transition"
              >
                Proceed to Itinerary Builder &rarr;
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" /> Day-wise Itinerary Configurator
                </h4>
                <button
                  type="button"
                  onClick={addItineraryDay}
                  className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Day {itinerary.length + 1}
                </button>
              </div>

              <div className="space-y-3">
                {itinerary.map((day, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 uppercase">Day {day.dayNumber}</span>
                      <input
                        type="text"
                        placeholder="Day Title"
                        value={day.title}
                        onChange={(e) => {
                          const updated = [...itinerary];
                          updated[idx].title = e.target.value;
                          setItinerary(updated);
                        }}
                        className="w-3/4 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-bold text-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold uppercase">Meals Included</label>
                        <input
                          type="text"
                          value={day.meals}
                          onChange={(e) => {
                            const updated = [...itinerary];
                            updated[idx].meals = e.target.value;
                            setItinerary(updated);
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold uppercase">Stay Details</label>
                        <input
                          type="text"
                          value={day.stayDetails}
                          onChange={(e) => {
                            const updated = [...itinerary];
                            updated[idx].stayDetails = e.target.value;
                            setItinerary(updated);
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-2/3 py-3 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs hover:bg-emerald-400 transition"
                >
                  Proceed to Vehicle & Staff &rarr;
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Bus className="w-4 h-4 text-emerald-400" /> Vehicle Specs & Tour Staff
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Bus / Vehicle Model</label>
                  <input
                    type="text"
                    required
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Registration Number</label>
                  <input
                    type="text"
                    required
                    value={vehicleReg}
                    onChange={(e) => setVehicleReg(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold font-mono text-emerald-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Driver Name & Phone</label>
                  <input
                    type="text"
                    required
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Certified Tour Guide Name</label>
                  <input
                    type="text"
                    required
                    value={guideName}
                    onChange={(e) => setGuideName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cancellation Policy</label>
                <textarea
                  value={cancellationPolicy}
                  onChange={(e) => setCancellationPolicy(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-3.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
                >
                  &larr; Back
                </button>

                <button
                  type="submit"
                  className="w-2/3 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/25 hover:scale-[1.02] transition"
                >
                  Publish Group Trip & Activate Live GPS
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
