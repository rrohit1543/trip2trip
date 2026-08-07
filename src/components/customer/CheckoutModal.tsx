'use client';

import React, { useState } from 'react';
import { Trip, Booking } from '../../types';
import { X, ShieldCheck, QrCode, CreditCard, Landmark, Wallet, CheckCircle2, Download, Radio, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  trip: Trip | null;
  selectedSeats: number[];
  pickupPoint: string;
  dropPoint: string;
  onClose: () => void;
  onConfirmBooking: (bookingData: any) => Booking;
  onViewBookingInDashboard: () => void;
}

export default function CheckoutModal({
  trip,
  selectedSeats,
  pickupPoint,
  dropPoint,
  onClose,
  onConfirmBooking,
  onViewBookingInDashboard,
}: CheckoutModalProps) {
  if (!trip) return null;

  const [travellerName, setTravellerName] = useState('Rahul Sharma');
  const [travellerPhone, setTravellerPhone] = useState('+91 98765 43210');
  const [travellerEmail, setTravellerEmail] = useState('rahul.sharma@example.com');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'Wallet'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const basePrice = selectedSeats.length * trip.pricePerPerson;
  const gstAmount = Math.round(basePrice * 0.05);
  const grandTotal = basePrice + gstAmount;

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const booking = onConfirmBooking({
        tripId: trip.id,
        tripName: trip.name,
        operatorName: trip.operatorName,
        customerId: 'usr_customer_1',
        customerName: travellerName,
        customerPhone: travellerPhone,
        customerEmail: travellerEmail,
        selectedSeats,
        totalAmount: grandTotal,
        paymentMethod,
        paymentStatus: 'paid',
        pickupPoint,
        dropPoint,
      });

      setIsProcessing(false);
      setConfirmedBooking(booking);

      // Trigger Confetti Effect
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        console.error(err);
      }
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="text-lg font-black text-white">
                {confirmedBooking ? 'Booking Confirmed!' : 'Secure Express Checkout'}
              </h3>
              <p className="text-xs text-slate-400">
                {confirmedBooking ? 'Ticket & QR Code Generated' : 'Instant Booking Confirmation'}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-900 border border-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmation Screen View */}
        {confirmedBooking ? (
          <div className="p-6 overflow-y-auto space-y-6 text-center">
            <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-white">Trip Booking Successfully Confirmed!</h2>
              <p className="text-xs text-slate-400 mt-1">Booking ID: <strong className="text-emerald-400 font-mono">{confirmedBooking.id}</strong></p>
            </div>

            {/* Ticket Card Preview */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-left space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="text-xs font-bold text-emerald-400 font-mono uppercase">{confirmedBooking.operatorName}</div>
                  <h4 className="text-base font-bold text-white mt-0.5">{confirmedBooking.tripName}</h4>
                </div>
                <div className="p-2 bg-white rounded-xl">
                  {/* Mock QR Code SVG */}
                  <QrCode className="w-12 h-12 text-slate-950" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Passenger Name</span>
                  <span className="text-slate-200 font-bold">{confirmedBooking.customerName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Seats Booked</span>
                  <span className="text-emerald-400 font-bold font-mono">S{confirmedBooking.selectedSeats.join(', S')}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Boarding Location</span>
                  <span className="text-slate-300 font-medium">{confirmedBooking.pickupPoint}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Paid</span>
                  <span className="text-emerald-400 font-bold">₹{confirmedBooking.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  alert(`Downloading Digital Ticket PDF for Booking #${confirmedBooking.id}...`);
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Ticket (PDF)</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onViewBookingInDashboard();
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                <span>Track Trip Live Now</span>
              </button>
            </div>
          </div>
        ) : (
          /* Form Checkout Screen */
          <form onSubmit={handlePayNow} className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Order Summary */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
              <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Booking Summary</div>
              <h4 className="text-base font-bold text-white">{trip.name}</h4>
              <div className="text-xs text-slate-300 flex items-center justify-between pt-2 border-t border-slate-800">
                <span>Seats Selected: <strong className="text-emerald-400 font-mono">S{selectedSeats.join(', S')}</strong></span>
                <span>Base Fare: <strong>₹{basePrice.toLocaleString('en-IN')}</strong></span>
              </div>
              <div className="text-xs text-slate-300 flex items-center justify-between">
                <span>GST & Platform Toll (5%):</span>
                <span>₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="text-sm font-extrabold text-white flex items-center justify-between pt-2 border-t border-slate-800">
                <span>Grand Total:</span>
                <span className="text-emerald-400 text-lg font-black">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Traveller Information Inputs */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">Passenger Contact Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={travellerName}
                    onChange={(e) => setTravellerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Phone Number (For Live Updates)</label>
                  <input
                    type="text"
                    required
                    value={travellerPhone}
                    onChange={(e) => setTravellerPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">Select Payment Mode</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition ${
                    paymentMethod === 'UPI'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Card')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition ${
                    paymentMethod === 'Card'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('NetBanking')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition ${
                    paymentMethod === 'NetBanking'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Landmark className="w-5 h-5" />
                  <span>Net Banking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Wallet')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition ${
                    paymentMethod === 'Wallet'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Wallet className="w-5 h-5" />
                  <span>Wallets</span>
                </button>
              </div>

              {/* Dynamic Payment Screen Simulation */}
              {paymentMethod === 'UPI' && (
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-center space-y-2">
                  <div className="w-24 h-24 bg-white p-2 rounded-xl mx-auto flex items-center justify-center border border-slate-700">
                    <QrCode className="w-20 h-20 text-slate-950" />
                  </div>
                  <p className="text-xs text-slate-400 font-mono">Scan QR via PhonePe, GPay, Paytm, or BHIM</p>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">
                    UPI ID: trip2trip@icici
                  </span>
                </div>
              )}
            </div>

            {/* Pay Now Action Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 hover:scale-[1.02] transition flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing Payment...</span>
                </>
              ) : (
                <span>Pay ₹{grandTotal.toLocaleString('en-IN')} & Confirm Ticket</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
