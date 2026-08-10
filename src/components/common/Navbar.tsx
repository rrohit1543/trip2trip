'use client';

import React from 'react';
import { User, UserRole } from '../../types';
import { Compass, ShieldAlert, Bus, UserCheck, Radio, LogIn, LogOut, Lock } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  onOpenAuthModal: () => void;
  onOpenAdminAuthModal: () => void;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({
  currentUser,
  onOpenAuthModal,
  onOpenAdminAuthModal,
  onLogout,
  activeTab,
  setActiveTab,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('explore')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-red-700 shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform duration-300">
            <Bus className="w-6 h-6 text-white stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600 border-2 border-black"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white font-mono">
                trip<span className="text-red-500">2</span>trip
              </span>
              <span className="bg-red-600/20 text-red-500 border border-red-600/40 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wide">
                LIVE GPS
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 hidden sm:block">Group Trips & Real-Time Route Telemetry</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-neutral-950 border border-neutral-900 p-1.5 rounded-2xl shadow-inner">
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'explore'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30 font-bold'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Discover Route & Trips</span>
          </button>

          <button
            onClick={() => setActiveTab('live-radar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'live-radar'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30 font-bold'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Radio className="w-4 h-4 text-red-500 animate-pulse" />
            <span>National Fleet Radar</span>
          </button>

          {currentUser?.role === 'customer' && (
            <button
              onClick={() => setActiveTab('passenger-dash')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'passenger-dash'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30 font-bold'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>My Bookings & Live Track</span>
            </button>
          )}

          {currentUser?.role === 'operator' && (
            <button
              onClick={() => setActiveTab('operator-dash')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'operator-dash'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30 font-bold'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Bus className="w-4 h-4" />
              <span>Operator Dashboard</span>
            </button>
          )}

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin-dash')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'admin-dash'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30 font-bold'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <span>Admin Control & KYC</span>
            </button>
          )}
        </nav>

        {/* User Auth Controls & Separate Admin Portal Button */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 bg-neutral-950 border border-neutral-900 px-3 py-1.5 rounded-2xl">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-red-600"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white leading-tight">{currentUser.name}</div>
                  <div className="text-[10px] text-red-500 font-mono capitalize">
                    {currentUser.operatorCompany || currentUser.role}
                  </div>
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-2 rounded-xl bg-neutral-950 border border-neutral-900 hover:border-red-600 text-neutral-400 hover:text-white transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 transition"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          )}

          {/* Dedicated Administrator Portal Button */}
          <button
            onClick={onOpenAdminAuthModal}
            className="p-2 rounded-2xl bg-neutral-950 border border-neutral-900 hover:border-red-600 text-red-500 hover:text-white transition flex items-center gap-1.5 text-xs font-bold"
            title="Restricted Admin Portal"
          >
            <Lock className="w-4 h-4" />
            <span className="hidden lg:inline">Admin Portal</span>
          </button>
        </div>
      </div>
    </header>
  );
}
