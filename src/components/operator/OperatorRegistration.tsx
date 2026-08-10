'use client';

import React, { useState } from 'react';
import { OperatorKYC } from '../../types';
import { X, ShieldAlert, CheckCircle2, Building, CreditCard, FileText } from 'lucide-react';

interface OperatorRegistrationProps {
  operatorId: string;
  onClose: () => void;
  onSubmitKYC: (data: Omit<OperatorKYC, 'id' | 'status' | 'createdAt'>) => void;
}

export default function OperatorRegistration({ operatorId, onClose, onSubmitKYC }: OperatorRegistrationProps) {
  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState('Royal Expeditions India');
  const [ownerName, setOwnerName] = useState('Vikramaditya Singh');
  const [email, setEmail] = useState('vikram@royalexpeditions.com');
  const [phone, setPhone] = useState('+91 98111 22334');

  const [aadhaarNumber, setAadhaarNumber] = useState('4532 9812 7711');
  const [panNumber, setPanNumber] = useState('ABCDE1234F');
  const [gstNumber, setGstNumber] = useState('07AAAAA0000A1Z5');
  const [travelAgencyReg, setTravelAgencyReg] = useState('DL-MOT-2024-9981');

  const [bankAccount, setBankAccount] = useState('992100448123');
  const [ifscCode, setIfscCode] = useState('HDFC0001234');
  const [upiId, setUpiId] = useState('royalexpeditions@hdfcbank');
  const [address, setAddress] = useState('Suite 402, Connaught Place, New Delhi');
  const [emergencyContact, setEmergencyContact] = useState('+91 98111 22335');
  const [logoUrl, setLogoUrl] = useState('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=200&q=80');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitKYC({
      operatorId,
      companyName,
      ownerName,
      email,
      phone,
      aadhaarNumber,
      panNumber,
      gstNumber,
      travelAgencyReg,
      bankAccount,
      ifscCode,
      upiId,
      address,
      emergencyContact,
      logoUrl,
    });
    onClose();
    alert('KYC Documents Submitted Successfully! Your company profile is sent for Admin Approval.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-black border-2 border-neutral-900 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-5 bg-neutral-950 border-b border-neutral-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-red-500" />
            <div>
              <h3 className="text-lg font-black text-white">Tour Operator KYC Registration</h3>
              <p className="text-xs text-neutral-400">Complete verification to create & publish group trips</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-900 border border-neutral-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between bg-neutral-950 px-6 py-3 border-b border-neutral-900 text-xs font-bold">
          <span className={step >= 1 ? 'text-red-500' : 'text-neutral-600'}>1. Contact Verification</span>
          <span className={step >= 2 ? 'text-red-500' : 'text-neutral-600'}>2. Identity & Tax</span>
          <span className={step >= 3 ? 'text-red-500' : 'text-neutral-600'}>3. Bank & Payouts</span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 bg-black">
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-red-500" /> Company & Owner Contact Info
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Company / Agency Name</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Owner / Director Name</label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Business Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Mobile Number</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="bg-neutral-950 border border-red-600/30 p-3 rounded-xl flex items-center justify-between text-xs">
                <span className="text-red-500 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Mobile & Email OTP Verified
                </span>
                <span className="text-[10px] text-neutral-400 uppercase font-mono">STATUS: VERIFIED</span>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3 rounded-xl bg-red-600 text-white font-black text-xs hover:bg-red-700 transition"
              >
                Proceed to Identity Verification &rarr;
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-500" /> Identity Documents & Registration
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Aadhaar Card Number</label>
                  <input
                    type="text"
                    required
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">PAN Card Number</label>
                  <input
                    type="text"
                    required
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">GST Number (Optional)</label>
                  <input
                    type="text"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Travel Agency Reg (Optional)</label>
                  <input
                    type="text"
                    value={travelAgencyReg}
                    onChange={(e) => setTravelAgencyReg(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 rounded-xl bg-neutral-900 text-neutral-300 font-bold text-xs hover:bg-neutral-800 transition"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-2/3 py-3 rounded-xl bg-red-600 text-white font-black text-xs hover:bg-red-700 transition"
                >
                  Proceed to Bank Details &rarr;
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-red-500" /> Bank Payout & Settlement Info
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Bank Account Number</label>
                  <input
                    type="text"
                    required
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">IFSC Code</label>
                  <input
                    type="text"
                    required
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">UPI ID for Payouts</label>
                  <input
                    type="text"
                    required
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Emergency Contact Number</label>
                  <input
                    type="text"
                    required
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Company Registered Address</label>
                <textarea
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-3.5 rounded-xl bg-neutral-900 text-neutral-300 font-bold text-xs hover:bg-neutral-800 transition"
                >
                  &larr; Back
                </button>

                <button
                  type="submit"
                  className="w-2/3 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-xl shadow-red-600/30 transition"
                >
                  Submit KYC for Admin Approval
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
