'use client';

import React, { useState } from 'react';
import { OperatorKYC, Trip, LiveTelemetry, Booking, User, SecurityEvent } from '../../types';
import GlobalFleetMap from '../map/GlobalFleetMap';
import { ShieldAlert, Radio, CheckCircle2, XCircle, Users, Bus, FileText, Lock, ShieldCheck, Clock } from 'lucide-react';

interface AdminDashboardProps {
  operatorKYC: OperatorKYC[];
  trips: Trip[];
  telemetry: Record<string, LiveTelemetry>;
  bookings: Booking[];
  users: User[];
  securityLogs: SecurityEvent[];
  onUpdateKYCStatus: (kycId: string, status: 'approved' | 'rejected', reason?: string) => void;
  onSelectTripToTrack: (trip: Trip) => void;
}

export default function AdminDashboard({
  operatorKYC,
  trips,
  telemetry,
  bookings,
  users,
  securityLogs,
  onUpdateKYCStatus,
  onSelectTripToTrack,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'radar' | 'kyc' | 'analytics' | 'security_logs'>('radar');
  const [selectedKYC, setSelectedKYC] = useState<OperatorKYC | null>(operatorKYC[0] || null);

  const pendingKYC = operatorKYC.filter((k) => k.status === 'pending');
  const approvedKYC = operatorKYC.filter((k) => k.status === 'approved');

  const totalPlatformVolume = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const platformCommissionEarned = Math.round(totalPlatformVolume * 0.1);
  const activeLiveTripsCount = trips.filter((t) => t.status === 'live').length;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* Admin Command Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black border-2 border-red-600/40 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-500 border border-red-600/40 text-xs font-bold px-3 py-1 rounded-full uppercase mb-2">
            <ShieldAlert className="w-3.5 h-3.5" /> Platform Admin Command Center
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">Super Admin Control & OWASP Security</h1>
          <p className="text-xs text-neutral-400 mt-1">Approve operator KYC, monitor national fleet radar, inspect security audit logs & MFA events.</p>
        </div>

        <div className="flex items-center gap-2 bg-neutral-950 p-1.5 rounded-2xl border border-neutral-900">
          <button
            onClick={() => setActiveTab('radar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'radar' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Live Fleet Radar
          </button>
          <button
            onClick={() => setActiveTab('kyc')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'kyc' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>KYC Queue</span>
            {pendingKYC.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-black text-[10px] flex items-center justify-center font-bold">
                {pendingKYC.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('security_logs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'security_logs' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Security Audit Logs</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'analytics' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Revenue Analytics
          </button>
        </div>
      </div>

      {/* Platform Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-black border border-neutral-900 p-5 rounded-3xl shadow-lg">
          <div className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Total Platform Volume</div>
          <div className="text-2xl font-black text-white mt-1">₹{totalPlatformVolume.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-neutral-500 mt-1">{bookings.length} total bookings</div>
        </div>

        <div className="bg-black border border-red-600/40 p-5 rounded-3xl shadow-lg">
          <div className="text-[10px] text-red-500 uppercase font-bold tracking-wider">Commission Revenue (10%)</div>
          <div className="text-2xl font-black text-red-500 mt-1">₹{platformCommissionEarned.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-neutral-400 mt-1">Platform gross earnings</div>
        </div>

        <div className="bg-black border border-neutral-900 p-5 rounded-3xl shadow-lg">
          <div className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Active Live Buses</div>
          <div className="text-2xl font-black text-white mt-1 flex items-center gap-2">
            <span>{activeLiveTripsCount}</span>
            <Radio className="w-4 h-4 text-red-500 animate-pulse" />
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">On-road real-time GPS</div>
        </div>

        <div className="bg-black border border-neutral-900 p-5 rounded-3xl shadow-lg">
          <div className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Security Events Logged</div>
          <div className="text-2xl font-black text-red-500 mt-1">{securityLogs.length}</div>
          <div className="text-[11px] text-neutral-500 mt-1">OWASP Audit History</div>
        </div>
      </div>

      {/* TAB VIEWS */}
      {activeTab === 'radar' && (
        <div className="bg-black border border-neutral-900 p-6 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-red-500 animate-pulse" />
              National Live Fleet Radar
            </h3>
            <span className="text-xs text-neutral-400 font-mono">
              Click any active vehicle marker to view telemetry
            </span>
          </div>

          <GlobalFleetMap trips={trips} telemetry={telemetry} height="520px" onSelectTrip={onSelectTripToTrack} />
        </div>
      )}

      {activeTab === 'kyc' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-red-500" /> Operator Applications ({operatorKYC.length})
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
                        ? 'bg-neutral-950 border-red-600 shadow-xl ring-1 ring-red-600/30'
                        : 'bg-black border-neutral-900 hover:border-neutral-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-white">{k.companyName}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        k.status === 'approved' ? 'bg-red-600/20 text-red-400 border border-red-600/40' : k.status === 'pending' ? 'bg-neutral-900 text-white border border-neutral-700' : 'bg-red-950 text-red-500'
                      }`}>
                        {k.status}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">Owner: {k.ownerName} ({k.phone})</p>
                    <p className="text-[11px] text-neutral-500 font-mono mt-2">Submitted: {new Date(k.createdAt).toLocaleDateString()}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {selectedKYC && (
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-black border border-neutral-900 p-6 rounded-3xl space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-white">{selectedKYC.companyName}</h3>
                    <p className="text-xs text-neutral-400">Owner: {selectedKYC.ownerName}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    selectedKYC.status === 'approved' ? 'bg-red-600/20 text-red-400 border border-red-600/40' : 'bg-neutral-900 text-neutral-300'
                  }`}>
                    {selectedKYC.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-900">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold block">Aadhaar Card</span>
                    <span className="text-white font-mono font-bold">{selectedKYC.aadhaarNumber}</span>
                  </div>

                  <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-900">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold block">PAN Card</span>
                    <span className="text-white font-mono font-bold">{selectedKYC.panNumber}</span>
                  </div>

                  <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-900">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold block">GST Number</span>
                    <span className="text-red-500 font-mono font-bold">{selectedKYC.gstNumber || 'N/A'}</span>
                  </div>

                  <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-900">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold block">Travel Agency Reg</span>
                    <span className="text-white font-mono font-bold">{selectedKYC.travelAgencyReg || 'N/A'}</span>
                  </div>

                  <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-900">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold block">Bank Account & IFSC</span>
                    <span className="text-neutral-200 font-mono">{selectedKYC.bankAccount} ({selectedKYC.ifscCode})</span>
                  </div>

                  <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-900">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold block">UPI Payout ID</span>
                    <span className="text-neutral-200 font-mono">{selectedKYC.upiId}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2 border-t border-neutral-900">
                  <button
                    onClick={() => {
                      onUpdateKYCStatus(selectedKYC.id, 'rejected', 'Verification details missing');
                      alert(`KYC for ${selectedKYC.companyName} marked REJECTED.`);
                    }}
                    className="w-1/2 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <XCircle className="w-4 h-4 text-neutral-400" />
                    <span>Reject Application</span>
                  </button>

                  <button
                    onClick={() => {
                      onUpdateKYCStatus(selectedKYC.id, 'approved');
                      alert(`KYC for ${selectedKYC.companyName} APPROVED!`);
                    }}
                    className="w-1/2 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-red-600/30 transition"
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

      {/* SECURITY AUDIT LOGS TAB (OWASP Event History) */}
      {activeTab === 'security_logs' && (
        <div className="bg-black border border-neutral-900 p-6 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-500" /> OWASP Security Audit Log History
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">Real-time tracking of login events, OTP requests, password resets & 2FA MFA verification.</p>
            </div>
            <span className="text-xs text-neutral-400 font-mono">No raw passwords stored</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-neutral-300">
              <thead className="text-[10px] text-neutral-400 uppercase bg-neutral-950 border-b border-neutral-900">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Event Type</th>
                  <th className="p-3">Mobile / Email Identifier</th>
                  <th className="p-3">Audit Log Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900 font-mono">
                {securityLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-950">
                    <td className="p-3 text-neutral-400 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-red-500 shrink-0" />
                      <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        log.eventType.includes('SUCCESS')
                          ? 'bg-red-600/20 text-red-400 border border-red-600/40'
                          : log.eventType.includes('UNAUTHORIZED') || log.eventType.includes('FAILED')
                          ? 'bg-red-950 text-red-500 border border-red-800'
                          : 'bg-neutral-900 text-white border border-neutral-800'
                      }`}>
                        {log.eventType}
                      </span>
                    </td>
                    <td className="p-3 text-white font-bold">{log.identifier}</td>
                    <td className="p-3 font-sans text-neutral-300">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-black border border-neutral-900 p-6 rounded-3xl space-y-6 shadow-xl">
          <h3 className="text-lg font-black text-white">Platform Revenue & Commission Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-neutral-950 border border-neutral-900 p-5 rounded-2xl space-y-3">
              <h4 className="text-sm font-bold text-white">Platform Commission Structure</h4>
              <p className="text-xs text-neutral-400">Current platform commission fee charged on tour bookings: <strong className="text-red-500">10%</strong></p>
              <div className="flex items-center gap-3 pt-2">
                <input type="text" value="10%" readOnly className="bg-black border border-neutral-800 rounded-xl px-3 py-2 text-xs font-bold text-white w-24 text-center" />
                <span className="text-xs text-neutral-400">Auto-settled via payment gateway</span>
              </div>
            </div>

            <div className="bg-neutral-950 border border-neutral-900 p-5 rounded-2xl space-y-3">
              <h4 className="text-sm font-bold text-white">User Statistics</h4>
              <div className="text-xs text-neutral-300 space-y-2">
                <div className="flex justify-between">
                  <span>Registered Passengers:</span>
                  <strong className="text-white">1,420</strong>
                </div>
                <div className="flex justify-between">
                  <span>Verified Tour Operators:</span>
                  <strong className="text-red-500">{approvedKYC.length}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Total Trips Published:</span>
                  <strong className="text-white">{trips.length}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
