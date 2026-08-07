'use client';

import React from 'react';
import { User, UserRole } from '../../types';
import { Compass, ShieldCheck, Bus, UserCheck, Radio, AlertTriangle } from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  onSwitchRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ currentUser, onSwitchRole, activeTab, setActiveTab }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('explore')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-300">
            <Bus className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-slate-950"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white font-mono">trip<span className="text-emerald-400">2</span>trip</span>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wide">
                LIVE GPS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Group Trips & Real-Time Route Telemetry</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl shadow-inner">
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'explore'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Discover Route & Trips</span>
          </button>

          <button
            onClick={() => setActiveTab('live-radar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'live-radar'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>National Fleet Radar</span>
          </button>

          {currentUser.role === 'customer' && (
            <button
              onClick={() => setActiveTab('passenger-dash')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'passenger-dash'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>My Bookings & Live Track</span>
            </button>
          )}

          {currentUser.role === 'operator' && (
            <button
              onClick={() => setActiveTab('operator-dash')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'operator-dash'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Bus className="w-4 h-4" />
              <span>Operator Dashboard</span>
            </button>
          )}

          {currentUser.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin-dash')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'admin-dash'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Admin Control & KYC</span>
            </button>
          )}
        </nav>

        {/* User Role Switcher & Persona Badge */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1 flex items-center gap-1">
            <button
              onClick={() => {
                onSwitchRole('customer');
                setActiveTab('explore');
              }}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                currentUser.role === 'customer'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Customer
            </button>

            <button
              onClick={() => {
                onSwitchRole('operator');
                setActiveTab('operator-dash');
              }}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                currentUser.role === 'operator'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Operator
            </button>

            <button
              onClick={() => {
                onSwitchRole('admin');
                setActiveTab('admin-dash');
              }}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                currentUser.role === 'admin'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Admin
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-2xl">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-emerald-500/40"
            />
            <div className="text-left">
              <div className="text-xs font-bold text-white leading-tight">{currentUser.name}</div>
              <div className="text-[10px] text-emerald-400 font-mono capitalize">
                {currentUser.operatorCompany || currentUser.role}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
