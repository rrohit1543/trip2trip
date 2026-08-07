'use client';

import React, { useState } from 'react';
import { OperatorKYC, Trip, LiveTelemetry, Booking, User } from '../../types';
import GlobalFleetMap from '../map/GlobalFleetMap';
import { ShieldCheck, Radio, CheckCircle2, XCircle, Users, Bus, DollarSign, AlertCircle, Eye, Settings, FileText } from 'lucide-react';

interface AdminDashboardProps {
  operatorKYC: OperatorKYC[];
  trips: Trip[];
  telemetry: Record<string, LiveTelemetry>;
  bookings: Booking[];
  users: User[];
  onUpdateKYCStatus: (kycId: string, status: 'approved' | 'rejected', reason?: string) => void;
  onSelectTripToTrack: (trip: Trip) => void;
}

export default function AdminDashboard({
  operatorKYC,
  trips,
  telemetry,
  bookings,
  users,
  onUpdateKYCStatus,
  onSelectTripToTrack,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'radar' | 'kyc' | 'analytics' | 'disputes'>('radar');
  const [selectedKYC, setSelectedKYC] = useState<OperatorKYC | null>(operatorKYC[0] || null);

  const pendingKYC = operatorKYC.filter((k) => k.status === 'pending');
  const approvedKYC = operatorKYC.filter((k) => k.status === 'approved');

  const totalPlatformVolume = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const platformCommissionEarned = Math.round(totalPlatformVolume * 0.1);
  const activeLiveTripsCount = trips.filter((t) => t.status === 'live').length;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* Admin Command Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Platform Admin Command Center
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">Super Admin Control & Compliance</h1>
          <p className="text-xs text-slate-400 mt-1">Approve operator KYC, monitor live national fleet radar, manage commissions & disputes.</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('radar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'radar' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Fleet Radar
          </button>
          <button
            onClick={() => setActiveTab('kyc')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'kyc' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>KYC Queue</span>
            {pendingKYC.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                {pendingKYC.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'analytics' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Revenue Analytics
          </button>
        </div>
      </div>

      {/* Platform Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-lg">
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Platform Volume</div>
          <div className="text-2xl font-black text-white mt-1">₹{totalPlatformVolume.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-500 mt-1">{bookings.length} total bookings</div>
        </div>

        <div className="bg-slate-900 border border-emerald-500/30 p-5 rounded-3xl shadow-lg">
          <div className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Commission Revenue (10%)</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">₹{platformCommissionEarned.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-emerald-300/80 mt-1">Platform gross earnings</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-lg">
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active Live Buses</div>
          <div className="text-2xl font-black text-cyan-400 mt-1 flex items-center gap-2">
            <span>{activeLiveTripsCount}</span>
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <div className="text-[11px] text-slate-500 mt-1">On-road real-time GPS</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-lg">
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Pending KYC Reviews</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{pendingKYC.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">{approvedKYC.length} operators approved</div>
        </div>
      </div>

      {/* Main Tab Content Views */}
      {activeTab === 'radar' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
              National Live Fleet Radar
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Click any active vehicle marker to view driver specs & telemetry
            </span>
          </div>

          <GlobalFleetMap trips={trips} telemetry={telemetry} height="520px" onSelectTrip={onSelectTripToTrack} />
        </div>
      )}

      {activeTab === 'kyc' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: KYC Queue */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" /> Operator Applications ({operatorKYC.length})
            </h3>

            <div className="space-y-3">
              {operatorKYC.map((k) => {
                const isSelected = k.id === selectedKYC?.id;
                return (
                  <div
                    key={k.id}
                    onClick={() => setSelectedKYC(k)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500/80 shadow-xl ring-1 ring-cyan-500/30'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-white">{k.companyName}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        k.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : k.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {k.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">Owner: {k.ownerName} ({k.phone})</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-2">Submitted: {new Date(k.createdAt).toLocaleDateString()}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Selected KYC Detail & Decision Panel */}
          {selectedKYC && (
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-white">{selectedKYC.companyName}</h3>
                    <p className="text-xs text-slate-400">Owner: {selectedKYC.ownerName}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    selectedKYC.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}>
                    {selectedKYC.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Aadhaar Card</span>
                    <span className="text-white font-mono font-bold">{selectedKYC.aadhaarNumber}</span>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">PAN Card</span>
                    <span className="text-white font-mono font-bold">{selectedKYC.panNumber}</span>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">GST Number</span>
                    <span className="text-emerald-400 font-mono font-bold">{selectedKYC.gstNumber || 'N/A'}</span>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Travel Agency Reg</span>
                    <span className="text-cyan-400 font-mono font-bold">{selectedKYC.travelAgencyReg || 'N/A'}</span>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Bank Account & IFSC</span>
                    <span className="text-slate-200 font-mono">{selectedKYC.bankAccount} ({selectedKYC.ifscCode})</span>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">UPI Payout ID</span>
                    <span className="text-slate-200 font-mono">{selectedKYC.upiId}</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Company Registered Address</span>
                  <span className="text-slate-300">{selectedKYC.address}</span>
                </div>

                {/* Decision Buttons */}
                <div className="flex items-center gap-4 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      onUpdateKYCStatus(selectedKYC.id, 'rejected', 'Document details missing verification');
                      alert(`KYC for ${selectedKYC.companyName} marked REJECTED.`);
                    }}
                    className="w-1/2 py-3 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Application</span>
                  </button>

                  <button
                    onClick={() => {
                      onUpdateKYCStatus(selectedKYC.id, 'approved');
                      alert(`KYC for ${selectedKYC.companyName} APPROVED! Operator can now create & publish live trips.`);
                    }}
                    className="w-1/2 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 hover:scale-105 transition"
                  >
                    <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                    <span>Approve Operator Profile</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6 shadow-xl">
          <h3 className="text-lg font-black text-white">Platform Revenue & Commission Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
              <h4 className="text-sm font-bold text-white">Platform Commission Structure</h4>
              <p className="text-xs text-slate-400">Current platform commission fee charged on tour bookings: <strong className="text-emerald-400">10%</strong></p>
              <div className="flex items-center gap-3 pt-2">
                <input type="text" value="10%" readOnly className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white w-24 text-center" />
                <span className="text-xs text-slate-400">Auto-settled via payment gateway</span>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
              <h4 className="text-sm font-bold text-white">User Statistics</h4>
              <div className="text-xs text-slate-300 space-y-2">
                <div className="flex justify-between">
                  <span>Registered Passengers:</span>
                  <strong className="text-white">1,420</strong>
                </div>
                <div className="flex justify-between">
                  <span>Verified Tour Operators:</span>
                  <strong className="text-emerald-400">{approvedKYC.length}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Total Trips Published:</span>
                  <strong className="text-cyan-400">{trips.length}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
