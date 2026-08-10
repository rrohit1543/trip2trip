'use client';

import React, { useState } from 'react';
import { Search, MapPin, Radio, Clock, ShieldAlert, Flame, Filter } from 'lucide-react';
import { RouteSearchResult } from '../../types';

interface RouteSearchProps {
  onSearch: (departure: string, destination: string, category?: string) => void;
  searchResult: RouteSearchResult;
}

export default function RouteSearch({ onSearch, searchResult }: RouteSearchProps) {
  const [departure, setDeparture] = useState('Delhi');
  const [destination, setDestination] = useState('Manali');
  const [category, setCategory] = useState('All');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(departure, destination, category);
  };

  const setPreset = (dep: string, dest: string) => {
    setDeparture(dep);
    setDestination(dest);
    onSearch(dep, dest, category);
  };

  return (
    <div className="relative w-full rounded-3xl bg-black border-2 border-neutral-900 p-6 md:p-8 shadow-2xl overflow-hidden">
      {/* Background glow accents in Red */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-900/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 text-xs font-bold uppercase tracking-wider mb-4">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          Real-Time Live GPS Route Discovery
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
          Discover Group Trips & Track <span className="text-red-500">Live Active Buses</span>
        </h1>
        <p className="text-neutral-400 text-sm md:text-base mt-3 max-w-2xl mx-auto">
          Unlike ordinary booking platforms, see live trips currently moving on your route, check real-time GPS coordinates, seat availability, and book verified tour packages.
        </p>
      </div>

      {/* Main Search Bar Form */}
      <form onSubmit={handleSubmit} className="relative z-10 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-neutral-950/90 border border-neutral-800 p-3 rounded-2xl shadow-2xl backdrop-blur-xl">
          {/* Departure */}
          <div className="md:col-span-4 flex items-center gap-3 bg-black border border-neutral-800 px-4 py-3 rounded-xl focus-within:border-red-600 transition-all">
            <MapPin className="w-5 h-5 text-red-500 shrink-0" />
            <div className="w-full text-left">
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">From (Pickup / City)</label>
              <input
                type="text"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                placeholder="e.g. Delhi, Indore, Mumbai"
                className="w-full bg-transparent text-white text-sm font-bold focus:outline-none placeholder-neutral-600"
              />
            </div>
          </div>

          {/* Destination */}
          <div className="md:col-span-4 flex items-center gap-3 bg-black border border-neutral-800 px-4 py-3 rounded-xl focus-within:border-red-600 transition-all">
            <MapPin className="w-5 h-5 text-white shrink-0" />
            <div className="w-full text-left">
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">To (Destination / Route)</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Manali, Goa, Coorg"
                className="w-full bg-transparent text-white text-sm font-bold focus:outline-none placeholder-neutral-600"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="md:col-span-2 flex items-center gap-2 bg-black border border-neutral-800 px-3 py-3 rounded-xl focus-within:border-red-600 transition-all">
            <Filter className="w-4 h-4 text-neutral-400 shrink-0" />
            <div className="w-full text-left">
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Category</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  onSearch(departure, destination, e.target.value);
                }}
                className="w-full bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-black text-white">All Categories</option>
                <option value="Trekking" className="bg-black text-white">Trekking</option>
                <option value="Beach Caravan" className="bg-black text-white">Beach Caravan</option>
                <option value="Adventure" className="bg-black text-white">Adventure</option>
                <option value="Heritage" className="bg-black text-white">Heritage</option>
                <option value="Leisure & Luxury" className="bg-black text-white">Leisure & Luxury</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full h-full min-h-[50px] bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-transform active:scale-95"
            >
              <Search className="w-5 h-5 stroke-[3]" />
              <span>Search Route</span>
            </button>
          </div>
        </div>
      </form>

      {/* Quick Route Preset Chips */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 mt-5">
        <span className="text-xs text-neutral-400 font-medium mr-1">Popular Live Routes:</span>
        <button
          onClick={() => setPreset('Delhi', 'Manali')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
            departure === 'Delhi' && destination === 'Manali'
              ? 'bg-red-600/20 border-red-600 text-red-500'
              : 'bg-black border-neutral-800 text-neutral-300 hover:border-neutral-700'
          }`}
        >
          Delhi &rarr; Manali
        </button>

        <button
          onClick={() => setPreset('Indore', 'Goa')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
            departure === 'Indore' && destination === 'Goa'
              ? 'bg-red-600/20 border-red-600 text-red-500'
              : 'bg-black border-neutral-800 text-neutral-300 hover:border-neutral-700'
          }`}
        >
          Indore &rarr; Goa
        </button>

        <button
          onClick={() => setPreset('Mumbai', 'Goa')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
            departure === 'Mumbai' && destination === 'Goa'
              ? 'bg-red-600/20 border-red-600 text-red-500'
              : 'bg-black border-neutral-800 text-neutral-300 hover:border-neutral-700'
          }`}
        >
          Mumbai &rarr; Goa
        </button>
      </div>

      {/* Live Route Discovery Status Metrics Bar */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 max-w-4xl mx-auto">
        <div className="bg-neutral-950 border border-neutral-800 p-3.5 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="text-xl font-black text-white">{searchResult.upcomingCount}</div>
            <div className="text-[11px] font-semibold text-neutral-400">Upcoming Departures</div>
          </div>
        </div>

        <div className="bg-neutral-950 border border-red-600/40 p-3.5 rounded-2xl flex items-center gap-3 relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-600 flex items-center justify-center text-red-500">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-left">
            <div className="text-xl font-black text-red-500 flex items-center gap-1.5">
              <span>{searchResult.liveCount}</span>
              <span className="text-[10px] bg-red-600/20 text-red-400 px-1.5 py-0.5 rounded font-bold uppercase">LIVE</span>
            </div>
            <div className="text-[11px] font-semibold text-neutral-300">Live Active Trips</div>
          </div>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 p-3.5 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white">
            <Flame className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-left">
            <div className="text-xl font-black text-white">{searchResult.nearIntermediateCount}</div>
            <div className="text-[11px] font-semibold text-neutral-400">En-route / Intermediate</div>
          </div>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 p-3.5 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <div className="text-xl font-black text-white">{searchResult.nearDestinationCount}</div>
            <div className="text-[11px] font-semibold text-neutral-400">Reaching Soon</div>
          </div>
        </div>
      </div>
    </div>
  );
}
